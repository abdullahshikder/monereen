import {
  CheckCircleMiniSolid,
  CursorArrowRays,
  DocumentText,
  Envelope,
  EyeMini,
  GaugeSparkle,
  GridList,
  Image,
  ImageSparkle,
  LayoutLeftRight,
  Minus,
  MagnifyingGlassMini,
  Newspaper,
  PlusMini,
  ShoppingBag,
  SquareTwoStack,
  Text as TextIcon,
} from "@medusajs/icons"
import { Button, Input, Text } from "@medusajs/ui"
import { usePuck, type Data } from "@measured/puck"
import { useEffect, useMemo, useState, type ReactNode } from "react"

export interface PageQualityIssue {
  id: string
  label: string
  detail: string
  severity: "needs-attention" | "suggestion"
  settings?: boolean
}

export interface PageQualityReport {
  score: number
  blockCount: number
  issues: PageQualityIssue[]
}

interface QualitySettings {
  title: string
  slug: string
  seoTitle: string
  seoDescription: string
}

const mediaProps: Record<string, string> = {
  FullscreenHero: "media",
  FullBleedImage: "src",
  ImageText: "image",
  FeaturedProduct: "image",
  StoryFeature: "image",
}

const altTextProps: Record<string, string> = {
  FullBleedImage: "alt",
  ImageText: "alt",
}

const blockLabel = (type: string) =>
  type.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase())

const blockMeta = {
  ImmersiveGallery: { description: "Cinematic, color-matched photo journey", icon: ImageSparkle },
  FullscreenHero: { description: "Large campaign opening", icon: ImageSparkle },
  EditorialText: { description: "Headline and long-form copy", icon: DocumentText },
  PullQuote: { description: "Editorial quotation", icon: TextIcon },
  FullBleedImage: { description: "Edge-to-edge visual", icon: Image },
  ImageText: { description: "Split image and copy", icon: LayoutLeftRight },
  FeaturedProduct: { description: "Spotlight one catalog item", icon: ShoppingBag },
  ProductGrid: { description: "Curated product collection", icon: GridList },
  StoryFeature: { description: "Link to a journal story", icon: Newspaper },
  Newsletter: { description: "Email signup section", icon: Envelope },
  CTA: { description: "Focused conversion prompt", icon: CursorArrowRays },
  Section: { description: "Container for nested blocks", icon: SquareTwoStack },
  Container: { description: "Constrain and align nested content", icon: SquareTwoStack },
  Columns: { description: "Two to four flexible columns", icon: LayoutLeftRight },
  GridLayout: { description: "Four or six content cells", icon: GridList },
  Spacer: { description: "Adjust vertical rhythm", icon: Minus },
} as const

const allBlocks = (data: Data) => [
  ...(data.content || []),
  ...Object.values(data.zones || {}).flat(),
]

export function inspectPageQuality(data: Data, settings: QualitySettings): PageQualityReport {
  const blocks = allBlocks(data)
  const issues: PageQualityIssue[] = []

  if (!blocks.length) {
    issues.push({
      id: "empty-page",
      label: "The page is empty",
      detail: "Add a hero, editorial section, or product block to begin.",
      severity: "needs-attention",
    })
  }

  if (blocks.length && !blocks.some((block) => block.type === "FullscreenHero")) {
    issues.push({
      id: "missing-hero",
      label: "No opening hero",
      detail: "A strong opening block helps campaign and editorial pages establish context.",
      severity: "suggestion",
    })
  }

  blocks.forEach((block, index) => {
    const props = (block.props || {}) as Record<string, unknown>
    const mediaProp = mediaProps[block.type]
    if (mediaProp && !String(props[mediaProp] || "").trim()) {
      issues.push({
        id: `media-${props.id || index}`,
        label: `${blockLabel(block.type)} needs media`,
        detail: "Upload an image or choose one from the media library.",
        severity: "needs-attention",
      })
    }

    const altTextProp = altTextProps[block.type]
    if (
      mediaProp &&
      altTextProp &&
      String(props[mediaProp] || "").trim() &&
      !String(props[altTextProp] || "").trim()
    ) {
      issues.push({
        id: `alt-${props.id || index}`,
        label: `${blockLabel(block.type)} needs alternative text`,
        detail: "Describe the image so the page works for screen-reader and search users.",
        severity: "needs-attention",
      })
    }

    if (block.type === "CTA" && !String(props.href || "").trim()) {
      issues.push({
        id: `cta-${props.id || index}`,
        label: "Call to action has no destination",
        detail: "Add a link so the button takes customers somewhere useful.",
        severity: "needs-attention",
      })
    }

    if (
      block.type === "FullscreenHero" &&
      String(props.ctaLabel || "").trim() &&
      !String(props.ctaHref || "").trim()
    ) {
      issues.push({
        id: `hero-link-${props.id || index}`,
        label: "Hero button has no destination",
        detail: "Add a CTA link or remove the button label.",
        severity: "needs-attention",
      })
    }

    if (block.type === "FeaturedProduct" && !String(props.productId || "").trim()) {
      issues.push({
        id: `product-${props.id || index}`,
        label: "Featured product is not connected",
        detail: "Choose a published product from the Medusa catalog.",
        severity: "needs-attention",
      })
    }

    if (block.type === "ProductGrid") {
      const products = Array.isArray(props.products) ? props.products : []
      if (!products.length) {
        issues.push({
          id: `grid-${props.id || index}`,
          label: "Product grid is empty",
          detail: "Add catalog products or remove the block.",
          severity: "needs-attention",
        })
      }
    }

    if (block.type === "ImmersiveGallery") {
      const frames = Array.isArray(props.frames)
        ? props.frames.filter((frame): frame is Record<string, unknown> => Boolean(frame) && typeof frame === "object")
        : []
      const framesWithImages = frames.filter((frame) => String(frame.src || frame.mobileSrc || "").trim())
      if (!framesWithImages.length) {
        issues.push({
          id: `gallery-${props.id || index}`,
          label: "Immersive gallery has no photographs",
          detail: "Upload at least one image in the gallery Frames field.",
          severity: "needs-attention",
        })
      } else if (framesWithImages.some((frame) => !String(frame.alt || "").trim())) {
        issues.push({
          id: `gallery-alt-${props.id || index}`,
          label: "Gallery photographs need alternative text",
          detail: "Describe each photograph so the visual journey is accessible.",
          severity: "needs-attention",
        })
      }
    }
  })

  if (!settings.seoTitle.trim()) {
    issues.push({
      id: "seo-title",
      label: "SEO title is missing",
      detail: "Add a focused title of roughly 30–60 characters.",
      severity: "needs-attention",
      settings: true,
    })
  } else if (settings.seoTitle.length > 60) {
    issues.push({
      id: "seo-title-long",
      label: "SEO title may be truncated",
      detail: `${settings.seoTitle.length} characters; aim for 60 or fewer.`,
      severity: "suggestion",
      settings: true,
    })
  }

  if (!settings.seoDescription.trim()) {
    issues.push({
      id: "seo-description",
      label: "SEO description is missing",
      detail: "Summarize the page for search and social previews.",
      severity: "needs-attention",
      settings: true,
    })
  } else if (settings.seoDescription.length < 70) {
    issues.push({
      id: "seo-description-short",
      label: "SEO description is very short",
      detail: `${settings.seoDescription.length} characters; add enough context to earn the click.`,
      severity: "suggestion",
      settings: true,
    })
  }

  if (!settings.slug.trim()) {
    issues.push({
      id: "slug",
      label: "Page URL is missing",
      detail: "Choose a stable, readable slug before publishing.",
      severity: "needs-attention",
      settings: true,
    })
  }

  if (blocks.length > 20) {
    issues.push({
      id: "long-page",
      label: "This is a very long page",
      detail: `${blocks.length} blocks can make editing and browsing feel heavy.`,
      severity: "suggestion",
    })
  }

  const deduction = issues.reduce(
    (total, issue) => total + (issue.severity === "needs-attention" ? 12 : 5),
    0,
  )

  return {
    score: Math.max(0, 100 - deduction),
    blockCount: blocks.length,
    issues,
  }
}

export function suggestSeoDescription(data: Data, fallback: string) {
  const candidates = allBlocks(data)
    .flatMap((block) => {
      const props = (block.props || {}) as Record<string, unknown>
      return [props.body, props.description, props.subtitle, props.excerpt]
    })
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
    .map((value) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())
  const normalized = [...new Set(candidates)].join(" ").trim() || fallback.trim()
  if (normalized.length <= 160) return normalized
  return `${normalized.slice(0, 157).replace(/\s+\S*$/, "")}…`
}

export const SmartComponentLibrary = ({ children }: { children: ReactNode }) => {
  const { appState, config, dispatch } = usePuck()
  const [query, setQuery] = useState("")
  const normalizedQuery = query.trim().toLowerCase()

  const matchCount = useMemo(() => {
    return Object.entries(config.components).filter(([name, component]) =>
      `${name} ${component.label || ""}`.toLowerCase().includes(normalizedQuery),
    ).length
  }, [config, normalizedQuery])

  useEffect(() => {
    const categories = config.categories || {}
    const nextComponentList = Object.fromEntries(
      Object.entries(categories).map(([categoryName, category]) => {
        const matches = (category.components || []).map(String).filter((name) => {
          const component = config.components[name]
          return `${String(name)} ${component?.label || ""}`
            .toLowerCase()
            .includes(normalizedQuery)
        })
        const current = appState.ui.componentList[categoryName]
        return [
          categoryName,
          {
            ...current,
            title: category.title,
            components: matches,
            visible: normalizedQuery ? matches.length > 0 : category.visible,
            expanded: normalizedQuery ? true : current?.expanded ?? category.defaultExpanded,
          },
        ]
      }),
    )

    dispatch({
      type: "setUi",
      ui: (current) => ({
        componentList: { ...current.componentList, ...nextComponentList },
      }),
    })
  }, [normalizedQuery, config, dispatch])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-ui-border-base p-3">
        <div className="relative">
          <MagnifyingGlassMini className="absolute left-2 top-1/2 -translate-y-1/2 text-ui-fg-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a block"
            aria-label="Find a page block"
            className="pl-7"
          />
        </div>
        <Text size="xsmall" className="mt-2 text-ui-fg-subtle">
          {normalizedQuery ? `${matchCount} matching blocks` : "Drag a block or click + to add it"}
        </Text>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

export const SmartComponentItem = ({ name }: { children: ReactNode; name: string }) => {
  const { appState, config, dispatch } = usePuck()
  const component = config.components[name]
  const meta = blockMeta[name as keyof typeof blockMeta]
  const Icon = meta?.icon || SquareTwoStack

  const addBlock = () => {
    const destinationIndex = appState.data.content.length
    dispatch({
      type: "insert",
      componentType: name,
      destinationIndex,
      destinationZone: "default-zone",
      recordHistory: true,
    })
    dispatch({
      type: "setUi",
      ui: {
        itemSelector: { index: destinationIndex, zone: "default-zone" },
        rightSideBarVisible: true,
      },
    })
  }

  return (
    <div className="monereen-block-card group">
      <span className="monereen-block-card__icon"><Icon /></span>
      <span className="min-w-0 flex-1">
        <span className="monereen-block-card__title">{component?.label || blockLabel(name)}</span>
        <span className="monereen-block-card__description">
          {meta?.description || "Page content block"}
        </span>
      </span>
      <button
        type="button"
        aria-label={`Add ${component?.label || blockLabel(name)}`}
        title="Add to the end of the page"
        className="monereen-block-card__add"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation()
          addBlock()
        }}
      >
        <PlusMini />
      </button>
    </div>
  )
}

interface EditorHeaderActionsProps {
  children: ReactNode
  saving: boolean
  published: boolean
  status: string
  dirty: boolean
  qualityScore: number
  onSaveDraft: () => void
  onOpenLive: () => void
  onOpenQuality: () => void
}

export const EditorHeaderActions = ({
  children,
  saving,
  published,
  status,
  dirty,
  qualityScore,
  onSaveDraft,
  onOpenLive,
  onOpenQuality,
}: EditorHeaderActionsProps) => {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`monereen-status ${published ? "monereen-status--published" : ""}`}>
        <span /> {dirty ? "Editing" : status.charAt(0) + status.slice(1).toLowerCase()}
      </span>
      <Button type="button" size="small" variant="transparent" onClick={onOpenQuality}>
        <GaugeSparkle /> Quality {qualityScore}
      </Button>
      {published && (
        <Button type="button" size="small" variant="transparent" onClick={onOpenLive}>
          <EyeMini /> Live
        </Button>
      )}
      <Button type="button" size="small" variant="secondary" isLoading={saving} onClick={onSaveDraft}>
        {published ? "Create draft" : "Save"}
      </Button>
      {children}
    </div>
  )
}

interface QualityPanelProps {
  report: PageQualityReport
  onClose: () => void
  onOpenSettings: () => void
  onSuggestSeo: () => void
}

export const QualityPanel = ({
  report,
  onClose,
  onOpenSettings,
  onSuggestSeo,
}: QualityPanelProps) => {
  const seoIssue = report.issues.some((issue) => issue.id.startsWith("seo-"))
  const needsAttention = report.issues.filter((issue) => issue.severity === "needs-attention").length
  const scoreTone = report.score >= 85
    ? "border-ui-tag-green-border text-ui-tag-green-text"
    : report.score >= 60
      ? "border-ui-tag-orange-border text-ui-tag-orange-text"
      : "border-ui-tag-red-border text-ui-tag-red-text"

  return (
    <section
      className="absolute right-4 top-[70px] z-40 max-h-[calc(100%-86px)] w-[min(520px,calc(100%-2rem))] overflow-y-auto rounded-lg border border-ui-border-base bg-ui-bg-base p-5 shadow-elevation-flyout"
      aria-label="Page quality report"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 bg-ui-bg-base ${scoreTone}`}>
              <Text weight="plus">{report.score}</Text>
            </div>
            <div>
              <Text weight="plus">Page quality</Text>
              <Text size="small" className="text-ui-fg-subtle">
                {report.blockCount} blocks · {needsAttention} need attention · {report.issues.length} total suggestions
              </Text>
            </div>
          </div>
          <div className="flex gap-2">
            {seoIssue && (
              <Button type="button" size="small" variant="secondary" onClick={onSuggestSeo}>
                Improve SEO
              </Button>
            )}
            <Button type="button" size="small" variant="transparent" onClick={onClose}>Close</Button>
          </div>
        </div>

        {report.issues.length ? (
          <div className="grid gap-2">
            {report.issues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                onClick={issue.settings ? onOpenSettings : undefined}
                className="flex gap-2 rounded-md border border-ui-border-base bg-ui-bg-base p-3 text-left transition-colors hover:bg-ui-bg-base-hover"
              >
                <span className={issue.severity === "needs-attention" ? "mt-0.5 text-ui-fg-error" : "mt-0.5 text-ui-fg-muted"}>
                  <GaugeSparkle />
                </span>
                <span>
                  <Text size="small" weight="plus">{issue.label}</Text>
                  <Text size="xsmall" className="mt-0.5 text-ui-fg-subtle">{issue.detail}</Text>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 border-t border-ui-border-base pt-3 text-ui-fg-success">
            <CheckCircleMiniSolid />
            <Text size="small" weight="plus">This page is ready to publish.</Text>
          </div>
        )}
      </div>
    </section>
  )
}
