# Monereen Architecture

## Applications

- `apps/storefront` is the Next.js customer-facing site. It renders fixed brand experiences and published Puck page JSON fetched from Medusa.
- `packages/medusa` is the Medusa v2 backend and admin application. It owns page records, status and SEO metadata, media uploads, catalog data, and the editor interface.

## Shared packages

- `packages/page-builder` owns the portable Puck component schema and renderers. Both the Medusa editor preview and storefront use the same configuration, so saved page blocks render consistently in both places.
- `packages/ui` contains shared presentation components.
- `packages/design-tokens` contains shared visual tokens and Tailwind-facing values.
- `packages/types` contains shared domain and API types.

## Page data flow

1. An administrator creates or edits a page in the Medusa admin route under `packages/medusa/src/admin/routes/pages`.
2. The editor uses the shared Puck configuration from `packages/page-builder`. Medusa replaces portable URL and text fields with admin-only upload, media-library, catalog, and rich-text controls in `packages/medusa/src/admin/lib/puck-config.tsx`.
3. Draft or published Puck JSON is validated by the page API and stored in the Medusa page module.
4. The storefront fetches published page JSON through Medusa store routes and passes it to `PuckRenderer`.
5. `PuckRenderer` uses the shared configuration to produce the final page in the browser.

## Boundaries

- Page components must remain portable and cannot depend on Medusa admin APIs. Admin-only authoring controls belong in the Medusa package.
- Media assets are uploaded and indexed by Medusa; page JSON stores their URLs and presentation metadata.
- Fixed storefront experiences can use Next.js-specific features. Builder components must work in both the Medusa Vite admin and the Next.js storefront.
