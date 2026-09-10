# Monereen Medusa Service

This package contains the Medusa v2 backend and bundled administration application for Monereen.

It owns the catalog, editorial domain modules, page records, media library, custom API routes, and the Puck page-builder interface. The admin is served by Medusa at `http://localhost:9000/app`.

Run commands from the repository root:

```bash
pnpm --filter @monereen/medusa migration:run
pnpm --filter @monereen/medusa seed
pnpm --filter @monereen/medusa dev
```

Useful checks:

```bash
pnpm --filter @monereen/medusa typecheck
pnpm --filter @monereen/medusa test
pnpm --filter @monereen/medusa build
```

Copy the root `.env.example` to `.env` for normal monorepo development. `packages/medusa/.env.template` documents the package-level equivalent.
