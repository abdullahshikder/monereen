# Monereen on this VPS

The domain points to this server, 145.223.20.145. The app uses the existing host Nginx and PM2, plus its own PostgreSQL, Redis, and MinIO containers.

## Connect HTTPS

From `/home/shawon/monereen` run:

```bash
sudo bash infrastructure/connect-domain.sh
```

This installs only the monereen.com Nginx site, requests a Let’s Encrypt certificate for the apex and www using HTTP validation, validates Nginx, and reloads it. The first certificate request uses no contact email; a renewal hook reloads Nginx. The existing certbot timer handles renewal. DNS for both names must point to this server and port 80 must be reachable. A failed certificate request leaves a maintenance response; resolve the reported cause and rerun the command.

Set Cloudflare SSL/TLS encryption mode to **Full (strict)** after certificate installation. Keep the apex A record and www CNAME proxied. Do not enable Cache Everything for admin, auth, API, cart, or checkout paths.

- Website: https://monereen.com
- Admin: https://monereen.com/app
- Health: https://monereen.com/health
- Public uploaded images: https://monereen.com/monereen-media/

## Processes and updates

`pm2 status` shows `monereen-medusa` and `monereen-storefront`. Each uses production output and listens only on localhost. Settings are in `packages/medusa/.env` and `apps/storefront/.env.local`; admin credentials are in `.env.admin.local`. These files are ignored by Git.

Build and restart after changes (builds can take several minutes on this shared VPS):

```bash
NODE_ENV=production pnpm --filter @monereen/medusa build
NEXT_DIST_DIR=.next-hardened pnpm --filter storefront build
pm2 restart ecosystem.config.cjs --update-env
pm2 save
```

For source changes that include database migrations, run `pnpm --filter @monereen/medusa migration:run` before restarting. Back up data before schema changes. Avoid building into output directories while production is serving requests; schedule maintenance or build in a separate release directory.

Containers have an unless-stopped restart policy. Local ports are PostgreSQL 5432, Redis 6380, MinIO API 9002, and MinIO console 9001. The ignored Compose override preserves these port assignments. This deployment runs one Medusa process in shared worker mode; multi-process scaling needs shared event/workflow/locking providers configured first. Payment provider credentials are still placeholders.

See [security-hardening.md](security-hardening.md) for current security status, optional Access MFA, and the pending migration from PM2 to isolated systemd services.
