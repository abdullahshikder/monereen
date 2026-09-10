#!/usr/bin/env bash
set -euo pipefail
[[ "$EUID" -eq 0 ]] || { echo 'Run: sudo bash infrastructure/harden-nginx.sh' >&2; exit 1; }
task_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
site=/etc/nginx/sites-available/monereen.com
[[ -f "$site" ]] || { echo 'Connect the domain first.' >&2; exit 1; }
nginx -t
backup="${site}.before-hardening.$(date +%s)"
cp -p "$site" "$backup"
install -d /etc/nginx/snippets
install -m 644 "$task_dir/nginx/cloudflare-real-ip.conf" /etc/nginx/snippets/monereen-cloudflare-real-ip.conf
install -m 644 "$task_dir/nginx/monereen-security.conf" /etc/nginx/conf.d/monereen-security.conf
install -m 644 "$task_dir/nginx/monereen.conf" "$site"
if ! nginx -t; then
    cp -p "$backup" "$site"
    echo "Validation failed. Previous site restored; running Nginx was not reloaded." >&2
    exit 1
fi
systemctl reload nginx
echo 'Monereen origin restrictions and login rate limiting are active.'
echo 'Other websites and their firewall rules were not changed.'
