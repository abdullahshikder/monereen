import type { Data } from "@measured/puck"

export type PageStatus =
  | "DRAFT"
  | "REVIEW"
  | "SCHEDULED"
  | "PUBLISHED"
  | "ARCHIVED"

export type PageType =
  | "STANDARD"
  | "HOMEPAGE"
  | "DROP_LANDING"
  | "STORY"
  | "LOOKBOOK"
  | "CUSTOM"

export interface AdminPage {
  id: string
  title: string
  slug: string
  pageType: PageType
  pageData: Data | null
  seo: {
    title?: string
    description?: string
  } | null
  status: PageStatus
  publishedAt: string | null
  created_at: string
  updated_at: string
}

export const emptyPageData: Data = { content: [], root: {} }

export const pageTypes: Array<{ label: string; value: PageType }> = [
  { label: "Standard page", value: "STANDARD" },
  { label: "Homepage", value: "HOMEPAGE" },
  { label: "Drop landing", value: "DROP_LANDING" },
  { label: "Story", value: "STORY" },
  { label: "Lookbook", value: "LOOKBOOK" },
  { label: "Custom", value: "CUSTOM" },
]

export type PageTemplate = "BLANK" | "EXHIBITION" | "CAMPAIGN" | "STORY"

export const pageTemplates: Array<{
  label: string
  value: PageTemplate
  description: string
}> = [
  { label: "Blank", value: "BLANK", description: "Start with an empty canvas" },
  { label: "Immersive exhibition", value: "EXHIBITION", description: "Cinematic gallery with color-matched atmosphere" },
  { label: "Campaign", value: "CAMPAIGN", description: "Hero, story, products, and signup" },
  { label: "Editorial story", value: "STORY", description: "Hero, article, quote, image, and CTA" },
]

function component(type: string, props: Record<string, unknown>) {
  return {
    type,
    props: { id: crypto.randomUUID(), ...props },
  }
}

export function createPageData(template: PageTemplate): Data {
  if (template === "EXHIBITION") {
    return {
      root: {},
      content: [
        component("ImmersiveGallery", {
          title: "Complete visual journey",
          frames: [
            { src: "", mobileSrc: "", alt: "", chapter: "Opening", caption: "", color: "#8f7854" },
            { src: "", mobileSrc: "", alt: "", chapter: "Details", caption: "", color: "#59677d" },
            { src: "", mobileSrc: "", alt: "", chapter: "Craft", caption: "", color: "#842f32" },
          ],
          height: "screen",
          initialFit: "contain",
          transition: "slide",
          autoplay: "true",
          autoplaySeconds: 7,
          ambientEffect: "strong",
          showFilmGrain: "true",
          showEditorialType: "true",
          showThumbnails: "true",
          showControls: "true",
          enableCinema: "true",
          enablePointerDepth: "true",
        }),
      ],
    }
  }

  if (template === "CAMPAIGN") {
    return {
      root: {},
      content: [
        component("FullscreenHero", {
          title: "New collection",
          subtitle: "Introduce the idea behind this release.",
          media: "",
          mediaType: "image",
          ctaLabel: "Shop the collection",
          ctaHref: "/shop",
          overlay: "dark",
          textAlignment: "center",
          height: "large",
          animation: "fadeUp",
        }),
        component("EditorialText", {
          heading: "Made with intention",
          body: "Tell customers what makes this collection distinct.",
          alignment: "center",
          width: "medium",
          background: "ivory",
          spacing: "lg",
        }),
        component("ProductGrid", {
          products: [
            { name: "Product one", price: "$0", image: "", href: "/shop" },
            { name: "Product two", price: "$0", image: "", href: "/shop" },
            { name: "Product three", price: "$0", image: "", href: "/shop" },
          ],
          columns: "3",
          heading: "Explore the collection",
          background: "sand",
        }),
        component("Newsletter", {
          heading: "Stay connected",
          body: "Receive stories, new drops, and updates.",
          buttonText: "Subscribe",
          background: "charcoal",
        }),
      ],
    }
  }

  if (template === "STORY") {
    return {
      root: {},
      content: [
        component("FullscreenHero", {
          title: "Story title",
          subtitle: "A short introduction to the story.",
          media: "",
          mediaType: "image",
          ctaLabel: "",
          ctaHref: "",
          overlay: "dark",
          textAlignment: "left",
          height: "large",
          animation: "fadeUp",
        }),
        component("EditorialText", {
          heading: "The beginning",
          body: "Write the story here. Use additional text, image, and quote blocks to shape the article.",
          alignment: "left",
          width: "narrow",
          background: "ivory",
          spacing: "lg",
        }),
        component("PullQuote", {
          quote: "Add a memorable line from the story.",
          attribution: "",
          background: "sand",
        }),
        component("FullBleedImage", {
          src: "",
          alt: "",
          caption: "",
          height: "large",
        }),
        component("CTA", {
          heading: "Continue exploring",
          body: "Guide readers to the next collection or story.",
          label: "Discover more",
          href: "/shop",
          background: "charcoal",
        }),
      ],
    }
  }

  return { content: [], root: {} }
}

export async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set("accept", "application/json")
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("content-type", "application/json")
  }

  const response = await fetch(path, {
    ...options,
    headers,
    credentials: "include",
  })

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string
    } | null
    throw new Error(body?.message || `Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
