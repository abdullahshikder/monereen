# Catalog-to-cart

**Status:** verified

## Scoped as

Replace the storefront's hardcoded shop, product, header bag count, and empty cart placeholders with a working Medusa-backed flow. A visitor must be able to choose a variant, add it to a cart, refresh, and retain the cart.

## Tried

- Traced the storefront pages and confirmed all four surfaces were placeholders.
- Confirmed the existing Medusa seed creates a region, publishable API key, products, variants, prices, and inventory.
- Seeded the clean local database and updated local storefront configuration with the generated publishable key.

## Current approach

Implemented server-side Medusa REST requests for catalog reads and Next.js server actions for cart mutations. Only the cart ID persists in an HTTP-only cookie, keeping internal service URLs and mutation details off the client.

## Verified

- `pnpm typecheck`: six workspaces passed.
- `pnpm lint`: storefront passed with no warnings or errors.
- `pnpm test`: Medusa HTTP integration suite passed after applying all core and custom migrations.
- `pnpm build`: optimized storefront and Medusa backend/admin builds passed.
- `docker compose config --quiet`: development topology is valid.
- Added standard Compose credentials to `.env.test` after the local integration test revealed it only worked with CI-provided environment variables.
- Medusa catalog API returned four seeded products with EUR prices and inventory.
- Browser flow selected `S / White`, added it to a cart, updated quantity to three, refreshed with the same cart and totals, and removed the line item.
