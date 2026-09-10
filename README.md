# Monereen

A self-hosted digital exhibition and editorial platform for Monereen. It combines an immersive fashion archive, a visual page builder, and Medusa-managed content and commerce services.

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Commerce:** Medusa.js (open-source)
- **Page Builder:** Puck Editor
- **Database:** PostgreSQL
- **Cache:** Redis
- **Storage:** S3-compatible (MinIO for dev)
- **Container:** Docker + Docker Compose

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

### Quick Start

```bash
# Install dependencies
pnpm install

# Start database and Redis
docker compose up -d postgres redis minio

# Set up environment
cp .env.example .env

# Run migrations
pnpm --filter @monereen/medusa migration:run

# Start development servers
pnpm dev
```

This starts:
- Storefront: http://localhost:3000
- Medusa API: http://localhost:9000
- Medusa Admin: http://localhost:9000/app
- MinIO Console: http://localhost:9001

## Project Structure

```
monereen/
├── apps/
│   └── storefront/          # Next.js exhibition and published pages
│
├── packages/
│   ├── medusa/              # Medusa backend + customized bundled admin
│   ├── ui/                  # Shared React components
│   ├── page-builder/        # Puck config + components
│   ├── design-tokens/       # Design tokens
│   └── types/               # Shared TypeScript types
│
├── infrastructure/
│   └── nginx/               # Reverse proxy
│
├── Monereen Website/        # Original source photography
└── docs/                    # Brand and project documentation
```

## Custom Modules

Monereen extends Medusa with these domain entities:

- **Drops** — seasonal collections with scheduling and homepage takeover
- **Stories** — editorial narratives linked to products, makers, crafts
- **Makers** — artisans and their profiles
- **Crafts** — traditional techniques and processes
- **Materials** — raw materials and their origins
- **Places** — geographic locations of craft and culture
- **Lookbooks** — visual editorial collections
- **Pages** — generic pages powered by Puck page builder
- **Homepage Experiences** — per-drop homepage compositions
- **Reusable Sections** — saved and reusable page sections
- **Page Templates** — templates for new pages
- **Campaign Themes** — visual themes per drop
- **Navigation Configs** — editable navigation structures

## Page Builder

The Monereen Builder uses Puck with approved components:

- **Experience:** Immersive Gallery with bulk upload, automatic color matching, responsive media, cinematic transitions, autoplay, chapter navigation, cinema mode, and fullscreen
- **Hero:** Fullscreen Hero
- **Editorial:** Editorial Text, Pull Quote, Image + Text
- **Media:** Full Bleed Image
- **Commerce:** Featured Product, Product Grid
- **Story:** Story Feature
- **Conversion:** Newsletter, CTA
- **Layout:** Section, Container, Columns, Content Grid, Spacer

Create a page at `http://localhost:9000/app/pages`. Choose the **Immersive exhibition** template to start with a ready-made gallery, upload multiple frames, then publish it to `/pages/{slug}` on the storefront.

## Deployment

### Hostinger VPS

```bash
# Clone and setup
git clone <repo>
cd monereen
cp .env.example .env
# Edit .env with production values

# Start all services
docker compose -f docker-compose.prod.yml up -d
```

### Environment Variables

See `.env.example` for all required variables. In production:

- Change all secrets
- Configure real payment provider keys
- Set up S3-compatible storage
- Configure domain and SSL

## License

MIT
