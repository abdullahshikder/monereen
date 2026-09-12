## staging.monereen.com wireframe — rollback plan

**Revert to:** the VPS state before the `staging.monereen.com` nginx site, document root, and certificate were installed.
**Restore:** disable `/etc/nginx/sites-enabled/staging.monereen.com`, remove its staging-only site file and `/var/www/staging.monereen.com`, then optionally delete the `staging.monereen.com` certificate with Certbot and remove the Cloudflare DNS record.
**Re-check after rollback:** run `nginx -t`, reload nginx, verify `https://monereen.com/` still returns 200, and verify `staging.monereen.com` no longer resolves or serve content.

## adm.monereen.com admin portal — rollback plan

**Revert to:** the VPS state before the `adm.monereen.com` nginx site and certificate were installed and before its origin was added to the Medusa CORS allowlists.
**Restore:** restore the pre-change `/etc/monereen/backend.env` (the installer records a timestamped backup), disable and remove only the `adm.monereen.com` nginx site, optionally delete its Certbot certificate, and remove its Cloudflare DNS record.
**Re-check after rollback:** restart Medusa if the environment file was restored, run `nginx -t`, reload nginx, verify `https://monereen.com/app` still loads, and verify `adm.monereen.com` no longer resolves or serves content.

## Medusa admin user creation — rollback plan

**Revert to:** the user list before the CLI invocation.
**Restore:** sign in as an existing administrator and remove the newly created user under Settings → Users; do not delete the database or alter other user records.
**Re-check after rollback:** confirm the removed email can no longer authenticate and existing administrator access still works.

## MinIO browser uploads — rollback plan

**Revert to:** the timestamped `/etc/nginx/sites-available/monereen.com.before-browser-uploads.*` and `/etc/monereen/backend.env.before-browser-uploads.*` backups made by the installer.
**Restore:** copy both backups back, run `nginx -t`, reload nginx, restart `monereen-medusa`, and wait for `/health` to return 200.
**Re-check after rollback:** verify `https://monereen.com/` returns 200, the existing media URLs still load, and no browser upload is routed to an unintended endpoint.

**CORS header follow-up:** if the duplicate-header repair needs reversal, restore the installer’s `/etc/nginx/sites-available/monereen.com.before-minio-cors-headers.*` backup, run `nginx -t`, and reload nginx.

**Public file URL follow-up:** if the media-path repair needs reversal, restore `/etc/monereen/backend.env.before-minio-public-file-url.*`, restart `monereen-medusa`, and verify `/health` returns 200.

## staging branch frontend — rollback plan

**Revert to:** the static wireframe site and no `monereen-staging-storefront.service` unit.
**Restore:** stop and disable `monereen-staging-storefront`, restore `/etc/nginx/sites-available/staging.monereen.com` from `staging.monereen.conf`, reload nginx, and restore the timestamped backend environment if the staging CORS update is rolled back.
**Re-check after rollback:** verify `staging.monereen.com/mrwireframe` returns 200, `monereen.com/` remains 200, and `monereen-medusa` is active with `/health` returning 200.
