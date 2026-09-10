# Medusa page builder

**Status:** verified

## Scoped as

Move page authoring into the authenticated Medusa Admin and connect one complete lifecycle: create a page, edit Puck blocks, save a draft, publish it, and render only published content on the storefront.

## Current approach

- Add searchable page management and editor routes under Medusa Admin.
- Offer blank, campaign, and editorial starting layouts.
- Group fifteen drag-and-drop blocks into focused categories and expose readable field labels.
- Let layout sections contain nested blocks with their own width, spacing, and background.
- Upload images by choosing or dropping a file, reuse recent uploads from a media library, preview them in the field, or paste an existing URL; hero blocks also accept MP4 and WebM video.
- Search the live Medusa catalog from featured-product and product-grid blocks; selecting products fills storefront handles, names, descriptions, images, and prices while keeping those fields editable.
- Search the block library, insert common blocks directly from the editor header, and preview the canvas at mobile, tablet, desktop, and wide breakpoints.
- Use an embedded editor shell that preserves the Medusa page context, presents blocks as descriptive visual cards, and supports one-click insertion as well as drag-and-drop.
- Format copy with headings, bold and italic text, links, lists, quotes, and inline images while retaining compatibility with existing plain-text content.
- Control visibility, outer spacing, and content order independently for mobile and desktop; media-led blocks can use dedicated mobile imagery.
- Compose nested page structures with configurable sections, width and alignment containers, two-to-four-column layouts, and four-or-six-cell grids; sections support responsive background images, overlays, height, alignment, and Puck duplication.
- Inspect page quality before publishing with checks for missing media and alternative text, disconnected commerce, broken CTA destinations, page length, and search metadata; generate or improve SEO text from existing page content.
- Use Puck history controls for undo and redo, save with `Cmd/Ctrl+S`, and receive a browser warning when leaving with unsaved work.
- Autosave draft edits, while requiring an explicit publish for public changes.
- Edit title, slug, page type, and search metadata from the editor; archive, restore, duplicate, and delete pages.
- Persist editor JSON through typed, authenticated custom admin routes.
- Add a published-only store detail route by slug.
- Render saved data and SEO metadata with Puck's render-only component on the storefront.
- Redirect the old public storefront builder into Medusa Admin.

## Verification

- Medusa Admin compiles with the Pages navigation route, starting layouts, page settings, uploads and media reuse, catalog product pickers, draft autosave, lifecycle controls, and embedded Puck editor.
- Local use created three draft pages; one persisted a configured FullscreenHero block in PostgreSQL.
- The integration suite proves published pages resolve by slug, drafts return 404 publicly, and uploaded builder images are stored and served.
- The storefront `/builder` route redirects to the authenticated Medusa Admin login.
- Root lint, workspace typecheck, the stricter Admin TypeScript check, integration tests, and production builds pass.
