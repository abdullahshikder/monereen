#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 ]]; then
    echo "Run with sudo: sudo bash infrastructure/install-staging-wireframe.sh" >&2
    exit 1
fi

task_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
site=/etc/nginx/sites-available/staging.monereen.com
enabled=/etc/nginx/sites-enabled/staging.monereen.com
web_root=/var/www/staging.monereen.com
acme_root=/var/www/monereen-acme
bootstrap="$task_dir/nginx/staging.monereen-bootstrap.conf"
final="$task_dir/nginx/staging.monereen.conf"

if [[ -f "$task_dir/wireframe.html" ]]; then
    wireframe="$task_dir/wireframe.html"
else
    wireframe="$task_dir/../mr wireframe/Monereen Website (standalone).html"
fi

for required in "$bootstrap" "$final" "$wireframe"; do
    [[ -f "$required" ]] || { echo "Missing required file: $required" >&2; exit 1; }
done

command -v certbot >/dev/null
nginx -t

if [[ -e "$site" ]] && ! cmp -s "$site" "$bootstrap" && ! cmp -s "$site" "$final"; then
    echo "Existing $site differs. Review it manually before continuing." >&2
    exit 1
fi
if [[ -e "$enabled" || -L "$enabled" ]] && [[ "$(readlink -f "$enabled")" != "$site" ]]; then
    echo "Existing $enabled points elsewhere. Review it before continuing." >&2
    exit 1
fi

install -d -m 755 "$web_root/mrwireframe"
install -d -m 755 "$acme_root"
install -m 644 "$wireframe" "$web_root/mrwireframe/index.html"

if [[ ! -f /etc/letsencrypt/live/staging.monereen.com/fullchain.pem ]]; then
    install -m 644 "$bootstrap" "$site"
    ln -sfn "$site" "$enabled"
    nginx -t
    systemctl reload nginx
    certbot certonly --webroot -w "$acme_root" \
        --cert-name staging.monereen.com -d staging.monereen.com \
        --non-interactive --agree-tos --register-unsafely-without-email \
        --deploy-hook 'systemctl reload nginx'
fi

install -m 644 "$final" "$site"
ln -sfn "$site" "$enabled"
nginx -t
systemctl reload nginx

echo "Staging wireframe is live at https://staging.monereen.com/mrwireframe"
