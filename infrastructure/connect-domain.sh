#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 ]]; then
    echo "Run with sudo: sudo bash infrastructure/connect-domain.sh" >&2
    exit 1
fi

task_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
site=/etc/nginx/sites-available/monereen.com
enabled=/etc/nginx/sites-enabled/monereen.com
command -v certbot >/dev/null
nginx -t

# Do not overwrite a domain configuration created outside this setup.
if [[ -e "$site" ]] && ! cmp -s "$site" "$task_dir/nginx/monereen.conf" && ! cmp -s "$site" "$task_dir/nginx/monereen-bootstrap.conf"; then
    echo "Existing $site differs. Review it before continuing." >&2
    exit 1
fi
if [[ -e "$enabled" || -L "$enabled" ]] && [[ "$(readlink -f "$enabled")" != "$site" ]]; then
    echo "Existing $enabled points elsewhere. Review it before continuing." >&2
    exit 1
fi

install -d -m 755 /var/www/monereen-acme
if [[ ! -f /etc/letsencrypt/live/monereen.com/fullchain.pem ]]; then
    install -m 644 "$task_dir/nginx/monereen-bootstrap.conf" "$site"
    ln -sfn "$site" "$enabled"
    nginx -t
    systemctl reload nginx
    certbot certonly --webroot -w /var/www/monereen-acme \
        --cert-name monereen.com -d monereen.com -d www.monereen.com \
        --non-interactive --agree-tos --register-unsafely-without-email \
        --deploy-hook 'systemctl reload nginx'
fi

install -d /etc/nginx/snippets
install -m 644 "$task_dir/nginx/cloudflare-real-ip.conf" /etc/nginx/snippets/monereen-cloudflare-real-ip.conf
install -m 644 "$task_dir/nginx/monereen-security.conf" /etc/nginx/conf.d/monereen-security.conf
install -m 644 "$task_dir/nginx/monereen.conf" "$site"
ln -sfn "$site" "$enabled"
nginx -t
systemctl reload nginx
echo "Monereen HTTPS routing installed. Use Full (strict) SSL/TLS mode in Cloudflare."
