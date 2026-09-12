## staging.monereen.com wireframe — rollback plan

**Revert to:** the VPS state before the `staging.monereen.com` nginx site, document root, and certificate were installed.
**Restore:** disable `/etc/nginx/sites-enabled/staging.monereen.com`, remove its staging-only site file and `/var/www/staging.monereen.com`, then optionally delete the `staging.monereen.com` certificate with Certbot and remove the Cloudflare DNS record.
**Re-check after rollback:** run `nginx -t`, reload nginx, verify `https://monereen.com/` still returns 200, and verify `staging.monereen.com` no longer resolves or serve content.

## adm.monereen.com admin portal — rollback plan

**Revert to:** the VPS state before the `adm.monereen.com` nginx site and certificate were installed and before its origin was added to the Medusa CORS allowlists.
**Restore:** restore the pre-change `/etc/monereen/backend.env` (the installer records a timestamped backup), disable and remove only the `adm.monereen.com` nginx site, optionally delete its Certbot certificate, and remove its Cloudflare DNS record.
**Re-check after rollback:** restart Medusa if the environment file was restored, run `nginx -t`, reload nginx, verify `https://monereen.com/app` still loads, and verify `adm.monereen.com` no longer resolves or serves content.

## staging branch frontend — rollback plan

**Revert to:** the static wireframe site and no `monereen-staging-storefront.service` unit.
**Restore:** stop and disable `monereen-staging-storefront`, restore `/etc/nginx/sites-available/staging.monereen.com` from `staging.monereen.conf`, reload nginx, and restore the timestamped backend environment if the staging CORS update is rolled back.
**Re-check after rollback:** verify `staging.monereen.com/mrwireframe` returns 200, `monereen.com/` remains 200, and `monereen-medusa` is active with `/health` returning 200.
