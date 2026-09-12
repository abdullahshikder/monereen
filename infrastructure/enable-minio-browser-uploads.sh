#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 ]]; then
    echo "Run with sudo: sudo bash infrastructure/enable-minio-browser-uploads.sh" >&2
    exit 1
fi

backend_env=/etc/monereen/backend.env
nginx_conf=/etc/nginx/sites-available/monereen.com
medusa_service=monereen-medusa

for required in "$backend_env" "$nginx_conf"; do
    [[ -f "$required" ]] || { echo "Missing required file: $required" >&2; exit 1; }
done
for key in MINIO_ENDPOINT MINIO_PORT MINIO_FILE_URL; do
    grep -q "^${key}=" "$backend_env" || { echo "Missing $key in $backend_env" >&2; exit 1; }
done

nginx_backup="${nginx_conf}.before-browser-uploads.$(date +%s)"
env_backup="${backend_env}.before-browser-uploads.$(date +%s)"
rendered_nginx="$(mktemp)"
cleanup() { rm -f "$rendered_nginx"; }
trap cleanup EXIT

if ! grep -Fq 'Access-Control-Allow-Origin "https://adm.monereen.com"' "$nginx_conf"; then
    current_block="$(sed -n '/^    location \^~ \/monereen-media\/ {$/,/^    }$/p' "$nginx_conf")"
    expected_block=$'    location ^~ /monereen-media/ {\n        limit_except GET HEAD { deny all; }\n        proxy_pass http://127.0.0.1:9002;\n    }'
    [[ "$current_block" == "$expected_block" ]] || {
        echo "Unexpected /monereen-media/ nginx block; refusing to modify it." >&2
        exit 1
    }

    cp -p "$nginx_conf" "$nginx_backup"
    awk '
        $0 == "    location ^~ /monereen-media/ {" {
            print "    location ^~ /monereen-media/ {"
            print "        # Browser uploads are authorized by the MinIO presigned signature."
            printf "        add_header Access-Control-Allow-Origin %chttps://adm.monereen.com%c always;\n", 34, 34
            printf "        add_header Access-Control-Allow-Methods %cGET, HEAD, PUT, OPTIONS%c always;\n", 34, 34
            printf "        add_header Access-Control-Allow-Headers %ccontent-type, x-amz-checksum-crc32, x-amz-sdk-checksum-algorithm%c always;\n", 34, 34
            print "        add_header Access-Control-Max-Age 86400 always;"
            print ""
            print "        if ($request_method = OPTIONS) { return 204; }"
            print "        proxy_pass http://127.0.0.1:9002;"
            print "    }"
            in_minio_block = 1
            next
        }
        in_minio_block && $0 == "    }" { in_minio_block = 0; next }
        !in_minio_block { print }
    ' "$nginx_conf" > "$rendered_nginx"
    install -m 644 "$rendered_nginx" "$nginx_conf"

    if ! nginx -t; then
        cp -p "$nginx_backup" "$nginx_conf"
        nginx -t
        echo "nginx validation failed; restored $nginx_backup" >&2
        exit 1
    fi
    systemctl reload nginx
else
    echo "Browser-upload CORS block already present."
fi

cp -p "$backend_env" "$env_backup"
sed -i 's|^MINIO_ENDPOINT=.*|MINIO_ENDPOINT=https://monereen.com|' "$backend_env"
sed -i 's|^MINIO_PORT=.*|MINIO_PORT=443|' "$backend_env"
sed -i 's|^MINIO_FILE_URL=.*|MINIO_FILE_URL=https://monereen.com/monereen-media|' "$backend_env"

if ! systemctl restart "$medusa_service" || \
    ! curl --fail --retry 60 --retry-connrefused --retry-delay 2 \
        --retry-max-time 180 --max-time 10 --output /dev/null \
        http://127.0.0.1:9000/health; then
    cp -p "$env_backup" "$backend_env"
    [[ -f "$nginx_backup" ]] && cp -p "$nginx_backup" "$nginx_conf"
    nginx -t && systemctl reload nginx
    systemctl restart "$medusa_service"
    echo "Medusa restart failed; restored $env_backup and $nginx_backup" >&2
    exit 1
fi

echo "Browser uploads now use https://monereen.com/monereen-media/"
echo "Backups: $nginx_backup $env_backup"
