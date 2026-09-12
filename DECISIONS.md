## 2026-09-12 — Isolate staging and admin hostnames at nginx

**Chose:** serve the initial wireframe from a staging-only static root and route `adm.monereen.com` to the existing Medusa admin backend.
**Over:** pointing both hostnames at the production storefront or running a duplicate admin service.
**Why:** separate nginx sites and certificates keep staging content independent while the admin hostname reuses the one authoritative backend and database.
**Model:** GPT-5 · 2026-09-12

## 2026-09-12 — Run the staging frontend as an isolated port-3001 service

**Chose:** build `origin/staging` in `/srv/monereen-staging`, run its Next.js storefront on `127.0.0.1:3001`, and proxy only the staging hostname to it.
**Over:** pointing staging at production port 3000 or replacing the wireframe with a shared process.
**Why:** the branch gets an independent release and restart boundary while production remains on port 3000; staging API paths still reach the existing Medusa backend until a separate staging backend is provisioned.
**Model:** GPT-5 · 2026-09-12

## 2026-09-12 — Proxy signed MinIO uploads through the existing Monereen hostname

**Chose:** issue MinIO presigned URLs at `https://monereen.com/monereen-media/` and allow CORS `PUT` requests from `https://adm.monereen.com`.
**Over:** exposing MinIO directly on a public port or adding another storage subdomain.
**Why:** the existing TLS and Cloudflare-protected nginx proxy already reaches MinIO; browser uploads require a publicly reachable signed URL instead of the VPS-only `localhost:9002` address.
**Model:** GPT-5 · 2026-09-12
