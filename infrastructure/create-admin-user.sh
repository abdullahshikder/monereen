#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 ]]; then
    echo "Run with sudo: sudo bash infrastructure/create-admin-user.sh <email>" >&2
    exit 1
fi

email="${1:-}"
if [[ -z "$email" ]]; then
    echo "Usage: sudo bash infrastructure/create-admin-user.sh <email>" >&2
    exit 1
fi

app_dir=/srv/monereen/current/packages/medusa
node_bin=/srv/monereen/runtime/node
cli="$app_dir/node_modules/@medusajs/cli/cli.js"
backend_env=/etc/monereen/backend.env
service_home=/var/lib/monereen
service_config=/var/lib/monereen/config
service_cache=/var/cache/monereen

for required in "$app_dir" "$node_bin" "$cli" "$backend_env" "$service_home" "$service_config" "$service_cache"; do
    [[ -e "$required" ]] || { echo "Missing required path: $required" >&2; exit 1; }
done

read -r -s -p "Password for $email: " password
printf '\n'
[[ -n "$password" ]] || { echo "Password cannot be empty." >&2; exit 1; }

set -a
# The CLI must use the same database and secrets as the running Medusa service.
source "$backend_env"
set +a

cd "$app_dir"
# sudo supplies HOME=/root; override it so the CLI uses the service account's
# writable Configstore location instead of attempting to read root's config.
runuser -u monereen --preserve-environment -- \
    env HOME="$service_home" XDG_CONFIG_HOME="$service_config" XDG_CACHE_HOME="$service_cache" \
    "$node_bin" "$cli" user --email "$email" --password "$password"

unset password
echo "Admin user created: $email"
