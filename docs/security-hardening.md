# Security hardening — 10 September 2026

## Applied to the app

- Next.js updated from 14.2.35 to 15.5.25; cookie and route parameter APIs migrated. Builds use `.next-hardened` so the active build is not overwritten during compilation.
- Unused legacy Medusa modules SDK removed from the storefront, eliminating its vulnerable MikroORM 5 dependency chain.
- Patched lodash, PostCSS, Vite/esbuild, UUID, Ajv, qs, CSV parsing, and React Router DOM dependencies locked with pnpm overrides. Production audit: 0 critical, 0 high, 2 moderate (see below).
- Dedicated app runtime: Node 22.23.2, downloaded from nodejs.org and verified against its published SHA-256 checksum. Other services keep their own runtimes.
- Database and MinIO default passwords rotated. `monereen_app` owns application tables but cannot act as superuser, create databases, or create roles.
- Database/storage/session secrets removed from the storefront environment. Production Medusa refuses missing or weak JWT/cookie secrets.
- Admin authentication limited to ten unsuccessful requests per minute per proxy-supplied client IP. Proxy client-IP trust is limited to localhost; Nginx overwrites X-Real-IP.
- Optional Cloudflare Access JWT verification checks signature, issuer, audience, expiry, and RS256 algorithm. It is inactive until both Access settings below are configured.

## Activate server protections

These changes are prepared and validated where possible, but have NOT been applied because sudo requires an interactive password:

```bash
cd /home/shawon/monereen
sudo bash infrastructure/harden-nginx.sh
sudo python3 infrastructure/isolate-app.py
```

The first command installs Monereen-only Cloudflare origin restrictions, trusted visitor-IP handling, login rate limits, a 25 MB upload limit, and defensive response headers. HTTP certificate-validation remains available. It validates Nginx before reload and keeps a copy of the prior site file. Cloudflare network ranges were retrieved from https://api.cloudflare.com/client/v4/ips; refresh them when Cloudflare changes its published ranges.

The second command is a one-time migration to root-owned `/srv/monereen/current` files and dedicated `monereen` systemd services. It generates fresh runtime secrets under root-only `/etc/monereen`, rotates database/storage credentials again, and removes only Monereen from the shared PM2 process list after service health checks. Existing admin sessions expire. It copies the admin login to `/etc/monereen/admin-login.env`; sudo is required to read it. Run during a maintenance window because the migration restarts app services. If it fails, retain the output and inspect the service journal before retrying; it refuses to overwrite an existing isolated deployment.

After isolation, use `sudo systemctl status monereen-medusa monereen-storefront` and `sudo journalctl -u monereen-medusa`. Source workspace environment files are then stale by design; do not restart the source workspace with PM2. Subsequent deployments require a new root-owned release, not an in-place build of the active release.

Isolation prevents Monereen from reading other home directories, but accounts with sudo or Docker socket access remain effectively privileged. Restricting those privileges and closing other apps’ public ports requires a server-wide service/access inventory; these scripts do not modify other sites or SSH/firewall access.

## Enable admin MFA in Cloudflare

1. In Cloudflare Zero Trust, add a self-hosted Access application for `monereen.com`, covering paths `/app*`, `/admin*`, and `/auth/user*` (multiple public hostnames/paths in the same application).
2. Add an Allow policy for your actual administrator email addresses. Do not use `admin@monereen.local` as an email identity provider address, and do not add a public bypass policy.
3. Enable independent MFA in the application's Authentication settings and enroll your authenticator/security key.
4. Copy your team hostname and the application's audience (AUD) tag. Set both in `packages/medusa/.env`, or `/etc/monereen/backend.env` after isolation:

```dotenv
CLOUDFLARE_ACCESS_TEAM_DOMAIN=your-team.cloudflareaccess.com
CLOUDFLARE_ACCESS_AUD=your-application-audience
```

5. Restart Medusa (`pm2 restart ecosystem.config.cjs --only monereen-medusa --update-env` before isolation, or `sudo systemctl restart monereen-medusa` afterward).
6. Verify an incognito visit to `/app` requires Access login plus MFA, and the public storefront remains accessible. Missing or invalid Access JWTs must be rejected on admin routes. Keep Cloudflare SSL/TLS set to Full (strict).

Official setup: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/self-hosted-public-app/
MFA: https://developers.cloudflare.com/cloudflare-one/access-controls/policies/mfa-requirements/

## Remaining dependency advisories

React Router 6.30.6 has two moderate advisories:

- GHSA-wrjc-x8rr-h8h6: attacker-controlled navigation paths can cause an external redirect.
- GHSA-337j-9hxr-rhxg: error deserialization during manual SSR/hydration. Medusa serves a client-rendered admin here, so the advisory's SSR prerequisite is not present.

The published fixes are in React Router 7.18+. Medusa's dashboard still imports the v6 `defer` and `json` APIs; blindly overriding it to v7 would break its loaders. These alerts remain visible in `pnpm audit --prod` and have not been suppressed. Follow a compatible Medusa dashboard upgrade or a tested backport.

## Recovery and validation

A local encrypted PostgreSQL + MinIO snapshot was created before credential changes. Decryption and a real restore into a disposable database succeeded with 154 public tables. `infrastructure/backup.py` creates local-only snapshots; `.env.backup.local` is the decryption key and must be retained separately. No off-server backup or backup schedule was configured, as requested.

Both production builds and type checks passed. Live probes verified protected admin routes return 401, ten failed logins are followed by 429, a valid administrator can sign in, and the homepage, cart, shop, and published-page fallback respond. Rotated storage credentials work; the app database role has no elevated role/database privileges; the old database password is rejected over the network authentication path. A temporary Nginx instance accepted trusted loopback traffic and rejected a different peer even with a forged Cloudflare header.

The existing full integration suite times out in database bootstrap before its tests run. Direct Node driver connectivity and the live checks pass; this test harness issue remains unresolved, so the integration suite is not reported as passing.
