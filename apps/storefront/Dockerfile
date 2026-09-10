FROM node:20-alpine AS base

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.json ./
COPY apps/storefront/package.json ./apps/storefront/
COPY packages/design-tokens/package.json ./packages/design-tokens/
COPY packages/medusa/package.json ./packages/medusa/
COPY packages/page-builder/package.json ./packages/page-builder/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --frozen-lockfile

FROM base AS development
COPY . .
EXPOSE 3000
CMD ["pnpm", "--filter", "storefront", "dev"]

FROM base AS builder
COPY . .
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
RUN pnpm --filter storefront build

FROM builder AS production
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "--filter", "storefront", "start"]
