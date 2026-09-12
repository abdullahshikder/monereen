#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 ]]; then
    echo "Run with sudo: sudo bash infrastructure/install-admin-domain.sh" >&2
    exit 1
fi

task_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
site=/etc/nginx/sites-available/adm.monereen.com
enabled=/etc/nginx/sites-enabled/adm.monereen.com
acme_root=/var/www/monereen-acme
backend_env=/etc/monereen/backend.env
bootstrap="$task_dir/nginx/adm.monereen-bootstrap.conf"
final="$task_dir/nginx/adm.monereen.conf"

for required in "$bootstrap" "$final"; do
    [[ -f "$required" ]] || { echo "Missing required file: $required" >&2; exit 1; }
done

command -v certbot >/dev/null
[[ -f "$backend_env" ]] || { echo "Missing active backend environment: $backend_env" >&2; exit 1; }
nginx -t

if [[ -e "$site" ]] && ! cmp -s "$site" "$bootstrap" && ! cmp -s "$site" "$final"; then
    echo "Existing $site differs. Review it manually before continuing." >&2
    exit 1
fi
if [[ -e "$enabled" || -L "$enabled" ]] && [[ "$(readlink -f "$enabled")" != "$site" ]]; then
    echo "Existing $enabled points elsewhere. Review it before continuing." >&2
    exit 1
fi

install -d -m 755 "$acme_root"

if [[ ! -f /etc/letsencrypt/live/adm.monereen.com/fullchain.pem ]]; then
    install -m 644 "$bootstrap" "$site"
    ln -sfn "$site" "$enabled"
    nginx -t
    systemctl reload nginx
    certbot certonly --webroot -w "$acme_root" \
        --cert-name adm.monereen.com -d adm.monereen.com \
        --non-interactive --agree-tos --register-unsafely-without-email \
        --deploy-hook 'systemctl reload nginx'
fi

install -m 644 "$final" "$site"
ln -sfn "$site" "$enabled"
nginx -t
systemctl reload nginx

cors_changed=0
for key in ADMIN_CORS AUTH_CORS; do
    line="$(grep -m 1 "^${key}=" "$backend_env" || true)"
    [[ -n "$line" ]] || { echo "Missing $key in $backend_env" >&2; exit 1; }
    value="${line#*=}"
    case ",${value}," in
        *,https://adm.monereen.com,*) ;;
        *) cors_changed=1 ;;
    esac
done

if [[ "$cors_changed" -eq 1 ]]; then
    # Keep the root-only runtime environment recoverable if Medusa cannot boot
    # with the expanded origin allowlist.
    env_backup="${backend_env}.before-adm.$(date +%s)"
    cp -p "$backend_env" "$env_backup"
    for key in ADMIN_CORS AUTH_CORS; do
        line="$(grep -m 1 "^${key}=" "$backend_env")"
        value="${line#*=}"
        case ",${value}," in
            *,https://adm.monereen.com,*) ;;
            *) sed -i "/^${key}=/s|$|,https://adm.monereen.com|" "$backend_env" ;;
        esac
    done

    # systemctl returns before the app is ready; allow the isolated service
    # enough time to finish its normal Medusa startup sequence.
    if ! systemctl restart monereen-medusa || \
       ! curl --fail --retry 60 --retry-connrefused --retry-delay 2 \
           --retry-max-time 180 --max-time 10 --output /dev/null \
           http://127.0.0.1:9000/health; then
        cp -p "$env_backup" "$backend_env"
        systemctl restart monereen-medusa
        echo "Medusa restart failed; restored $env_backup" >&2
        exit 1
    fi
    echo "Admin and auth CORS allowlists updated; backup: $env_backup"
fi

echo "Admin portal is live at https://adm.monereen.com/app"
