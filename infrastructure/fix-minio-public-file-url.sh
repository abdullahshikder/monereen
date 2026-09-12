#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 ]]; then
    echo "Run with sudo: sudo bash infrastructure/fix-minio-public-file-url.sh" >&2
    exit 1
fi

backend_env=/etc/monereen/backend.env
service=monereen-medusa
[[ -f "$backend_env" ]] || { echo "Missing active backend environment: $backend_env" >&2; exit 1; }
grep -q '^MINIO_FILE_URL=' "$backend_env" || { echo "Missing MINIO_FILE_URL in $backend_env" >&2; exit 1; }

backup="${backend_env}.before-minio-public-file-url.$(date +%s)"
cp -p "$backend_env" "$backup"
# Public file URLs must include nginx's MinIO proxy prefix; the endpoint itself
# remains the hostname so presigned PUT URLs continue to target the S3 API.
sed -i 's|^MINIO_FILE_URL=.*|MINIO_FILE_URL=https://monereen.com/monereen-media|' "$backend_env"

if ! systemctl restart "$service" || \
    ! curl --fail --retry 60 --retry-connrefused --retry-delay 2 \
        --retry-max-time 180 --max-time 10 --output /dev/null \
        http://127.0.0.1:9000/health; then
    cp -p "$backup" "$backend_env"
    systemctl restart "$service"
    echo "Medusa restart failed; restored $backup" >&2
    exit 1
fi

echo "MinIO public file URLs now use https://monereen.com/monereen-media/"
echo "Backup: $backup"
