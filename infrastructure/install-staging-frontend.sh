#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 ]]; then
    echo "Run with sudo: sudo bash infrastructure/install-staging-frontend.sh" >&2
    exit 1
fi

task_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
stage_root=/srv/monereen-staging
repo="$stage_root/repo"
site=/etc/nginx/sites-available/staging.monereen.com
enabled=/etc/nginx/sites-enabled/staging.monereen.com
old_site="$task_dir/nginx/staging.monereen.conf"
new_site="$task_dir/nginx/staging.monereen-frontend.conf"
runtime_dir=/home/shawon/monereen/.runtime/node-v22.23.2-linux-x64
node_bin="$runtime_dir/bin/node"
corepack_bin="$runtime_dir/bin/corepack"
frontend_env=/etc/monereen/staging-storefront.env
backend_env=/etc/monereen/backend.env
services_env=/etc/monereen/services.env
service=/etc/systemd/system/monereen-staging-storefront.service

for required in "$old_site" "$new_site" "$node_bin" "$corepack_bin"; do
    [[ -e "$required" ]] || { echo "Missing required file: $required" >&2; exit 1; }
done
[[ -f "$backend_env" ]] || { echo "Missing active backend environment: $backend_env" >&2; exit 1; }
[[ -f "$services_env" ]] || { echo "Missing active services environment: $services_env" >&2; exit 1; }
command -v certbot >/dev/null
command -v nginx >/dev/null

if [[ -e "$site" ]] && ! cmp -s "$site" "$old_site" && ! cmp -s "$site" "$new_site"; then
    echo "Existing $site differs from the managed staging configs; refusing to overwrite." >&2
    exit 1
fi
if [[ -e "$enabled" || -L "$enabled" ]] && [[ "$(readlink -f "$enabled")" != "$site" ]]; then
    echo "Existing $enabled points elsewhere; refusing to overwrite." >&2
    exit 1
fi

install -d -o shawon -g shawon -m 750 "$stage_root"

if [[ ! -d "$repo/.git" ]]; then
    runuser -u shawon -- git clone --branch staging --single-branch \
        https://github.com/abdullahshikder/monereen.git "$repo"
else
    runuser -u shawon -- git -C "$repo" fetch origin staging
    runuser -u shawon -- git -C "$repo" checkout staging
    runuser -u shawon -- git -C "$repo" pull --ff-only origin staging
fi

# Use the same Node runtime as production; Corepack supplies the repository's
# pinned pnpm without installing a second system-wide toolchain.
export PATH="$runtime_dir/bin:$PATH"
cd "$repo"
runuser -u shawon -- env PATH="$runtime_dir/bin:$PATH" \
    NEXT_DIST_DIR=.next-staging \
    NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://staging.monereen.com \
    MEDUSA_BACKEND_URL=http://127.0.0.1:9000 \
    "$corepack_bin" pnpm install --frozen-lockfile
runuser -u shawon -- env PATH="$runtime_dir/bin:$PATH" \
    NEXT_DIST_DIR=.next-staging \
    NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://staging.monereen.com \
    MEDUSA_BACKEND_URL=http://127.0.0.1:9000 \
    "$corepack_bin" pnpm --filter storefront build

publishable_key="$(sed -n 's/^MEDUSA_PUBLISHABLE_KEY=//p' "$services_env" | head -1)"
[[ -n "$publishable_key" ]] || { echo "Missing MEDUSA_PUBLISHABLE_KEY in $services_env" >&2; exit 1; }

cat > "$frontend_env" <<EOF
NODE_ENV=production
NEXT_DIST_DIR=.next-staging
MEDUSA_BACKEND_URL=http://127.0.0.1:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://staging.monereen.com
MEDUSA_PUBLISHABLE_KEY=$publishable_key
EOF
chmod 600 "$frontend_env"

cat > "$service" <<EOF
[Unit]
Description=Monereen staging storefront
After=network-online.target monereen-medusa.service
Wants=network-online.target

[Service]
Restart=on-failure
RestartSec=5
User=shawon
Group=shawon
WorkingDirectory=$repo/apps/storefront
EnvironmentFile=$frontend_env
ExecStart=$node_bin $repo/apps/storefront/node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3001
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true
RestrictSUIDSGID=true
CapabilityBoundingSet=
RestrictAddressFamilies=AF_UNIX AF_INET AF_INET6

[Install]
WantedBy=multi-user.target
EOF
chmod 644 "$service"
systemctl daemon-reload
systemctl enable --now monereen-staging-storefront

if ! curl --fail --retry 30 --retry-connrefused --retry-delay 2 \
    --retry-max-time 90 --max-time 10 --output /dev/null \
    http://127.0.0.1:3001/; then
    systemctl status monereen-staging-storefront --no-pager -n 60 >&2 || true
    exit 1
fi

install -m 644 "$new_site" "$site"
ln -sfn "$site" "$enabled"
if ! nginx -t; then
    install -m 644 "$old_site" "$site"
    nginx -t
    systemctl reload nginx
    echo "nginx validation failed; restored the static wireframe site." >&2
    exit 1
fi
systemctl reload nginx

cors_changed=0
for key in STORE_CORS AUTH_CORS; do
    line="$(grep -m 1 "^${key}=" "$backend_env" || true)"
    [[ -n "$line" ]] || { echo "Missing $key in $backend_env" >&2; exit 1; }
    value="${line#*=}"
    case ",${value}," in
        *,https://staging.monereen.com,*) ;;
        *) cors_changed=1 ;;
    esac
done

if [[ "$cors_changed" -eq 1 ]]; then
    # Keep the active backend environment recoverable if this optional CORS
    # expansion causes a real Medusa boot failure.
    env_backup="${backend_env}.before-staging.$(date +%s)"
    cp -p "$backend_env" "$env_backup"
    for key in STORE_CORS AUTH_CORS; do
        line="$(grep -m 1 "^${key}=" "$backend_env")"
        value="${line#*=}"
        case ",${value}," in
            *,https://staging.monereen.com,*) ;;
            *) sed -i "/^${key}=/s|$|,https://staging.monereen.com|" "$backend_env" ;;
        esac
    done

    if ! systemctl restart monereen-medusa || \
       ! curl --fail --retry 60 --retry-connrefused --retry-delay 2 \
           --retry-max-time 180 --max-time 10 --output /dev/null \
           http://127.0.0.1:9000/health; then
        cp -p "$env_backup" "$backend_env"
        systemctl restart monereen-medusa
        echo "Medusa restart failed; restored $env_backup. Staging frontend remains available." >&2
        exit 1
    fi
    echo "Store and auth CORS allowlists updated; backup: $env_backup"
fi

echo "Staging storefront is live at https://staging.monereen.com/"
