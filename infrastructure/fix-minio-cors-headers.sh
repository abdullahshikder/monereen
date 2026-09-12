#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 ]]; then
    echo "Run with sudo: sudo bash infrastructure/fix-minio-cors-headers.sh" >&2
    exit 1
fi

nginx_conf=/etc/nginx/sites-available/monereen.com
[[ -f "$nginx_conf" ]] || { echo "Missing required file: $nginx_conf" >&2; exit 1; }

current_block="$(sed -n '/^    location \^~ \/monereen-media\/ {$/,/^    }$/p' "$nginx_conf")"
expected_block=$'    location ^~ /monereen-media/ {\n        # Browser uploads are authorized by the MinIO presigned signature.\n        add_header Access-Control-Allow-Origin "https://adm.monereen.com" always;\n        add_header Access-Control-Allow-Methods "GET, HEAD, PUT, OPTIONS" always;\n        add_header Access-Control-Allow-Headers "content-type, x-amz-checksum-crc32, x-amz-sdk-checksum-algorithm" always;\n        add_header Access-Control-Max-Age 86400 always;\n\n        if ($request_method = OPTIONS) { return 204; }\n        proxy_pass http://127.0.0.1:9002;\n    }'
updated_block=$'    location ^~ /monereen-media/ {\n        # Browser uploads are authorized by the MinIO presigned signature.\n        add_header Access-Control-Allow-Origin "https://adm.monereen.com" always;\n        add_header Access-Control-Allow-Methods "GET, HEAD, PUT, OPTIONS" always;\n        add_header Access-Control-Allow-Headers "content-type, x-amz-checksum-crc32, x-amz-sdk-checksum-algorithm" always;\n        add_header Access-Control-Max-Age 86400 always;\n\n        if ($request_method = OPTIONS) { return 204; }\n        # MinIO also emits CORS headers; hide them to avoid duplicate values.\n        proxy_hide_header Access-Control-Allow-Origin;\n        proxy_hide_header Access-Control-Allow-Methods;\n        proxy_hide_header Access-Control-Allow-Headers;\n        proxy_hide_header Access-Control-Max-Age;\n        proxy_pass http://127.0.0.1:9002;\n    }'

if [[ "$current_block" == "$updated_block" ]]; then
    echo "MinIO CORS header handling is already configured."
    exit 0
fi
[[ "$current_block" == "$expected_block" ]] || {
    echo "Unexpected /monereen-media/ nginx block; refusing to modify it." >&2
    exit 1
}

backup="${nginx_conf}.before-minio-cors-headers.$(date +%s)"
rendered_nginx="$(mktemp)"
cleanup() { rm -f "$rendered_nginx"; }
trap cleanup EXIT
cp -p "$nginx_conf" "$backup"

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
        print "        # MinIO also emits CORS headers; hide them to avoid duplicate values."
        print "        proxy_hide_header Access-Control-Allow-Origin;"
        print "        proxy_hide_header Access-Control-Allow-Methods;"
        print "        proxy_hide_header Access-Control-Allow-Headers;"
        print "        proxy_hide_header Access-Control-Max-Age;"
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
    cp -p "$backup" "$nginx_conf"
    nginx -t
    echo "nginx validation failed; restored $backup" >&2
    exit 1
fi
systemctl reload nginx
echo "MinIO CORS headers now pass through nginx once; backup: $backup"
