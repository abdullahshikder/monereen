import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading, Input, Label, Text } from "@medusajs/ui"
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  adminRequest,
  createPageData,
  type AdminPage,
  type PageType,
  type PageTemplate,
  pageTemplates,
  pageTypes,
  slugify,
} from "../../lib/pages"

const PagesRoute = () => {
  const navigate = useNavigate()
  const [pages, setPages] = useState<AdminPage[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [pageType, setPageType] = useState<PageType>("STANDARD")
  const [template, setTemplate] = useState<PageTemplate>("BLANK")
  const [slugEdited, setSlugEdited] = useState(false)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const visiblePages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return pages.filter((page) => {
      const matchesQuery =
        !normalizedQuery ||
        page.title.toLowerCase().includes(normalizedQuery) ||
        page.slug.toLowerCase().includes(normalizedQuery)
      const matchesStatus = statusFilter === "ALL" || page.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [pages, query, statusFilter])

  const loadPages = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const result = await adminRequest<{ pages: AdminPage[] }>("/admin/pages")
      setPages(
        result.pages.sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
      )
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load pages")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPages()
  }, [loadPages])

  const createPage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCreating(true)
    setError("")
    try {
      const result = await adminRequest<{ page: AdminPage }>("/admin/pages", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug,
          pageType,
          pageData: createPageData(template),
        }),
      })
      navigate(`/pages/${result.page.id}`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not create page")
      setCreating(false)
    }
  }

  const duplicatePage = async (page: AdminPage) => {
    setError("")
    try {
      const suffix = crypto.randomUUID().slice(0, 6)
      const result = await adminRequest<{ page: AdminPage }>("/admin/pages", {
        method: "POST",
        body: JSON.stringify({
          title: `${page.title} copy`,
          slug: `${page.slug}-copy-${suffix}`,
          pageType: page.pageType,
          pageData: page.pageData ?? createPageData("BLANK"),
          seo: page.seo,
        }),
      })
      navigate(`/pages/${result.page.id}`)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not duplicate page")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Container>
        <div className="flex flex-col gap-1">
          <Heading level="h1">Page builder</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Create editorial pages, save drafts, and publish them to the storefront.
          </Text>
        </div>
      </Container>

      <Container>
        <form onSubmit={createPage} className="grid gap-4 p-2 md:grid-cols-2 xl:grid-cols-[1fr_1fr_180px_180px_auto] xl:items-end">
          <div className="flex flex-col gap-2">
            <Label htmlFor="page-title">Title</Label>
            <Input
              id="page-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                if (!slugEdited) setSlug(slugify(event.target.value))
              }}
              placeholder="Our craft philosophy"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="page-slug">Slug</Label>
            <Input
              id="page-slug"
              value={slug}
              onChange={(event) => {
                setSlugEdited(true)
                setSlug(slugify(event.target.value))
              }}
              placeholder="our-craft-philosophy"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="page-type">Page type</Label>
            <select
              id="page-type"
              value={pageType}
              onChange={(event) => setPageType(event.target.value as PageType)}
              className="txt-compact-small h-8 rounded-md border border-ui-border-base bg-ui-bg-field px-2 outline-none focus:border-ui-border-interactive"
            >
              {pageTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="page-template">Starting layout</Label>
            <select
              id="page-template"
              value={template}
              onChange={(event) => setTemplate(event.target.value as PageTemplate)}
              className="txt-compact-small h-8 rounded-md border border-ui-border-base bg-ui-bg-field px-2 outline-none focus:border-ui-border-interactive"
            >
              {pageTemplates.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" isLoading={creating} disabled={!title || !slug}>
            Create page
          </Button>
        </form>
        <Text size="xsmall" className="mt-2 px-2 text-ui-fg-subtle">
          {pageTemplates.find((item) => item.value === template)?.description}
        </Text>
        {error && <Text className="mt-4 text-ui-fg-error">{error}</Text>}
      </Container>

      <Container className="p-0">
        <div className="flex flex-col gap-3 border-b border-ui-border-base px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Heading level="h2">Pages</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {visiblePages.length} shown · {pages.length} total
            </Text>
          </div>
          <div className="flex gap-2">
            <Input
              aria-label="Search pages"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title or slug"
              className="w-full md:w-64"
            />
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="txt-compact-small h-8 rounded-md border border-ui-border-base bg-ui-bg-field px-2 outline-none focus:border-ui-border-interactive"
            >
              <option value="ALL">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="REVIEW">Review</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>
        {loading ? (
          <Text className="p-6 text-ui-fg-subtle">Loading pages…</Text>
        ) : visiblePages.length ? (
          <div className="divide-y divide-ui-border-base">
            {visiblePages.map((page) => (
              <div
                key={page.id}
                className="flex items-center gap-3 px-6 py-4 hover:bg-ui-bg-base-hover"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/pages/${page.id}`)}
                  className="min-w-0 flex-1 text-left"
                >
                  <Text weight="plus" className="truncate">{page.title}</Text>
                  <Text size="small" className="text-ui-fg-subtle">/{page.slug}</Text>
                </button>
                <span className="flex shrink-0 items-center gap-4">
                  <span className="rounded-full bg-ui-bg-subtle px-2 py-1 text-ui-fg-subtle txt-compact-xsmall-plus">
                    {page.status.toLowerCase()}
                  </span>
                  <Text size="small" className="hidden text-ui-fg-subtle sm:block">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </Text>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => void duplicatePage(page)}
                  >
                    Duplicate
                  </Button>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <Text className="p-6 text-ui-fg-subtle">
            {pages.length ? "No pages match these filters." : "No pages yet. Create the first one above."}
          </Text>
        )}
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Pages",
})

export default PagesRoute
