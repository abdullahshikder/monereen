import { ArrowLeftMini, CogSixTooth } from "@medusajs/icons"
import { Button, Heading, Input, Label, Text, Textarea } from "@medusajs/ui"
import { Puck, type Data, type Overrides } from "@measured/puck"
import "@measured/puck/dist/index.css"
import "../../../lib/page-editor.css"
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  adminRequest,
  type AdminPage,
  emptyPageData,
  pageTypes,
  type PageStatus,
  type PageType,
  slugify,
} from "../../../lib/pages"
import { adminPuckConfig } from "../../../lib/puck-config"
import {
  EditorHeaderActions,
  inspectPageQuality,
  QualityPanel,
  SmartComponentLibrary,
  SmartComponentItem,
  suggestSeoDescription,
} from "../../../lib/page-editor-tools"

interface PageSettings {
  title: string
  slug: string
  pageType: PageType
  seoTitle: string
  seoDescription: string
}

const emptySettings: PageSettings = {
  title: "",
  slug: "",
  pageType: "STANDARD",
  seoTitle: "",
  seoDescription: "",
}

const dataSignature = (data: Data) => JSON.stringify(data)

const clipAtWord = (value: string, maxLength: number) => {
  const trimmed = value.trim()
  if (trimmed.length <= maxLength) return trimmed
  return trimmed.slice(0, maxLength).replace(/\s+\S*$/, "").trim()
}

const PageEditorRoute = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState<AdminPage | null>(null)
  const [settings, setSettings] = useState<PageSettings>(emptySettings)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [message, setMessage] = useState("")
  const [qualityOpen, setQualityOpen] = useState(false)
  const [editorData, setEditorData] = useState<Data>(emptyPageData)
  const currentData = useRef<Data>(emptyPageData)
  const savedDataSignature = useRef(dataSignature(emptyPageData))
  const statusRef = useRef<PageStatus>("DRAFT")
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestVersion = useRef(0)

  useEffect(() => {
    if (!id) return
    adminRequest<{ page: AdminPage }>(`/admin/pages/${id}`)
      .then((result) => {
        const loadedPage = result.page
        currentData.current = loadedPage.pageData ?? emptyPageData
        savedDataSignature.current = dataSignature(currentData.current)
        setEditorData(loadedPage.pageData ?? emptyPageData)
        statusRef.current = loadedPage.status
        setPage(loadedPage)
        setSettings({
          title: loadedPage.title,
          slug: loadedPage.slug,
          pageType: loadedPage.pageType,
          seoTitle: loadedPage.seo?.title ?? "",
          seoDescription: loadedPage.seo?.description ?? "",
        })
      })
      .catch((requestError) => {
        setMessage(requestError instanceof Error ? requestError.message : "Could not load page")
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    }
  }, [])

  const savePageData = useCallback(
    async (data: Data, status: PageStatus, successMessage: string) => {
      if (!id) return
      const version = ++requestVersion.current
      setSaving(true)
      setMessage(status === "DRAFT" ? "Saving draft…" : "Saving…")
      try {
        const result = await adminRequest<{ page: AdminPage }>(`/admin/pages/${id}`, {
          method: "POST",
          body: JSON.stringify({ pageData: data, status }),
        })
        if (version !== requestVersion.current) return
        const savedLatestData = currentData.current === data
        statusRef.current = result.page.status
        setPage((current) => ({
          ...result.page,
          pageData: savedLatestData ? result.page.pageData : current?.pageData ?? result.page.pageData,
        }))
        if (savedLatestData) {
          savedDataSignature.current = dataSignature(data)
          setDirty(false)
          setMessage(successMessage)
        } else {
          setMessage("Newer changes are waiting to be saved.")
        }
      } catch (requestError) {
        if (version !== requestVersion.current) return
        setMessage(requestError instanceof Error ? requestError.message : "Could not save page")
      } finally {
        if (version === requestVersion.current) setSaving(false)
      }
    },
    [id],
  )

  const handleChange = useCallback(
    (data: Data) => {
      currentData.current = data
      setEditorData(data)
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)

      if (dataSignature(data) === savedDataSignature.current) {
        setDirty(false)
        setMessage("All changes saved.")
        return
      }

      setDirty(true)

      if (statusRef.current === "DRAFT") {
        setMessage("Unsaved changes")
        autosaveTimer.current = setTimeout(() => {
          void savePageData(data, "DRAFT", "Draft autosaved.")
        }, 1200)
      } else {
        setMessage("Changes are not published yet.")
      }
    },
    [savePageData],
  )

  const saveDraft = useCallback(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    void savePageData(
      currentData.current,
      "DRAFT",
      page?.status === "PUBLISHED" ? "Draft saved and page unpublished." : "Draft saved.",
    )
  }, [page?.status, savePageData])

  const publish = (data: Data) => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    void savePageData(data, "PUBLISHED", "Page published.")
  }

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!id) return
    const version = ++requestVersion.current
    setSaving(true)
    setMessage("Saving page settings…")
    try {
      const result = await adminRequest<{ page: AdminPage }>(`/admin/pages/${id}`, {
        method: "POST",
        body: JSON.stringify({
          title: settings.title,
          slug: slugify(settings.slug),
          pageType: settings.pageType,
          seo: {
            title: settings.seoTitle.trim(),
            description: settings.seoDescription.trim(),
          },
        }),
      })
      if (version !== requestVersion.current) return
      setPage((current) => ({
        ...result.page,
        pageData: current?.pageData ?? result.page.pageData,
      }))
      setSettings((current) => ({ ...current, slug: result.page.slug }))
      setMessage("Page settings saved.")
      setSettingsOpen(false)
    } catch (requestError) {
      if (version !== requestVersion.current) return
      setMessage(requestError instanceof Error ? requestError.message : "Could not save page settings")
    } finally {
      if (version === requestVersion.current) setSaving(false)
    }
  }

  const changeStatus = (status: PageStatus) => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    const successMessage = status === "ARCHIVED" ? "Page archived." : "Page restored as a draft."
    void savePageData(currentData.current, status, successMessage)
  }

  const deletePage = async () => {
    if (!id || !page || !window.confirm(`Delete “${page.title}”? This cannot be undone.`)) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    requestVersion.current += 1
    setDeleting(true)
    try {
      await adminRequest(`/admin/pages/${id}`, { method: "DELETE" })
      navigate("/pages")
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "Could not delete page")
      setDeleting(false)
    }
  }

  const openLivePage = useCallback(() => {
    const localHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    const origin = localHost ? "http://localhost:3001" : window.location.origin
    window.open(`${origin}/pages/${page?.slug || settings.slug}`, "_blank", "noopener,noreferrer")
  }, [page?.slug, settings.slug])

  const applySeoSuggestion = useCallback(() => {
    setSettings((current) => ({
      ...current,
      seoTitle: clipAtWord(current.seoTitle || current.title, 60),
      seoDescription:
        current.seoDescription.trim().length >= 70
          ? current.seoDescription.trim()
          : suggestSeoDescription(editorData, current.title),
    }))
    setQualityOpen(false)
    setSettingsOpen(true)
    setMessage("SEO suggestions are ready. Review and save the page settings.")
  }, [editorData])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const command = event.metaKey || event.ctrlKey
      if (command && event.key.toLowerCase() === "s") {
        event.preventDefault()
        saveDraft()
      }
      if (command && event.key === ",") {
        event.preventDefault()
        setSettingsOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [saveDraft])

  useEffect(() => {
    const preventAccidentalExit = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", preventAccidentalExit)
    return () => window.removeEventListener("beforeunload", preventAccidentalExit)
  }, [dirty])

  const qualityReport = useMemo(
    () => inspectPageQuality(editorData, settings),
    [editorData, settings],
  )

  const puckOverrides = useMemo<Partial<Overrides>>(
    () => ({
      components: SmartComponentLibrary,
      componentItem: SmartComponentItem,
      headerActions: ({ children }) => (
        <EditorHeaderActions
          saving={saving}
          published={page?.status === "PUBLISHED"}
          status={page?.status || "DRAFT"}
          dirty={dirty}
          qualityScore={qualityReport.score}
          onSaveDraft={saveDraft}
          onOpenLive={openLivePage}
          onOpenQuality={() => {
            setSettingsOpen(false)
            setQualityOpen((open) => !open)
          }}
        >
          {children}
        </EditorHeaderActions>
      ),
    }),
    [dirty, openLivePage, page?.status, qualityReport.score, saveDraft, saving],
  )

  if (loading) {
    return <Text className="p-6 text-ui-fg-subtle">Loading editor…</Text>
  }

  if (!page) {
    return (
      <div className="p-6">
        <Heading level="h1">Page unavailable</Heading>
        <Text className="mt-2 text-ui-fg-subtle">{message}</Text>
        <Button className="mt-4" variant="secondary" onClick={() => navigate("/pages")}>Back to pages</Button>
      </div>
    )
  }

  return (
    <div className="monereen-page-editor -m-3 flex h-[calc(100vh-56px)] flex-col overflow-hidden">
      <div className="relative z-40 flex min-h-14 items-center justify-between gap-3 border-b border-ui-border-base bg-ui-bg-base px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="transparent" size="small" onClick={() => navigate("/pages")}>
            <ArrowLeftMini /> Pages
          </Button>
          <span className="h-5 w-px bg-ui-border-base" />
          <div className="min-w-0">
            <Heading level="h2" className="truncate">{page.title}</Heading>
            <Text size="xsmall" className="text-ui-fg-subtle">
              /pages/{page.slug}
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {message && <Text size="small" className="hidden text-ui-fg-subtle lg:block">{message}</Text>}
          <Button
            size="small"
            variant={settingsOpen ? "primary" : "secondary"}
            onClick={() => {
              setQualityOpen(false)
              setSettingsOpen((open) => !open)
            }}
          >
            <CogSixTooth /> Settings
          </Button>
        </div>
      </div>

      {settingsOpen && (
        <form
          onSubmit={saveSettings}
          className="absolute right-4 top-[70px] z-40 max-h-[calc(100%-86px)] w-[min(460px,calc(100%-2rem))] overflow-y-auto rounded-lg border border-ui-border-base bg-ui-bg-base p-5 shadow-elevation-flyout"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <Heading level="h2">Page settings</Heading>
              <Text size="small" className="text-ui-fg-subtle">URL, publishing type, and search metadata.</Text>
            </div>
            <Button type="button" size="small" variant="transparent" onClick={() => setSettingsOpen(false)}>Close</Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="editor-page-title">Title</Label>
              <Input
                id="editor-page-title"
                value={settings.title}
                onChange={(event) => setSettings((current) => ({ ...current, title: event.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="editor-page-slug">Slug</Label>
              <Input
                id="editor-page-slug"
                value={settings.slug}
                onChange={(event) => setSettings((current) => ({ ...current, slug: event.target.value }))}
                required
              />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="editor-page-type">Page type</Label>
              <select
                id="editor-page-type"
                value={settings.pageType}
                onChange={(event) => setSettings((current) => ({ ...current, pageType: event.target.value as PageType }))}
                className="txt-compact-small h-8 rounded-md border border-ui-border-base bg-ui-bg-field px-2 outline-none focus:border-ui-border-interactive"
              >
                {pageTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="editor-seo-title">SEO title</Label>
              <Input
                id="editor-seo-title"
                value={settings.seoTitle}
                onChange={(event) => setSettings((current) => ({ ...current, seoTitle: event.target.value }))}
                placeholder={settings.title}
                maxLength={70}
              />
              <Text size="xsmall" className="text-ui-fg-subtle">{settings.seoTitle.length}/70 characters</Text>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <Label htmlFor="editor-seo-description">SEO description</Label>
              <Textarea
                id="editor-seo-description"
                value={settings.seoDescription}
                onChange={(event) => setSettings((current) => ({ ...current, seoDescription: event.target.value }))}
                placeholder="Describe this page for search results"
                maxLength={160}
              />
              <Text size="xsmall" className="text-ui-fg-subtle">{settings.seoDescription.length}/160 characters</Text>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ui-border-base pt-4 md:col-span-2">
              <div className="flex gap-2">
                {page.status === "ARCHIVED" ? (
                  <Button type="button" size="small" variant="secondary" isLoading={saving} onClick={() => changeStatus("DRAFT")}>
                    Restore draft
                  </Button>
                ) : (
                  <Button type="button" size="small" variant="secondary" isLoading={saving} onClick={() => changeStatus("ARCHIVED")}>
                    Archive
                  </Button>
                )}
                <Button type="button" size="small" variant="danger" isLoading={deleting} onClick={() => void deletePage()}>
                  Delete
                </Button>
              </div>
              <Button type="submit" size="small" isLoading={saving} disabled={!settings.title || !slugify(settings.slug)}>
                Save settings
              </Button>
            </div>
          </div>
        </form>
      )}

      {qualityOpen && (
        <QualityPanel
          report={qualityReport}
          onClose={() => setQualityOpen(false)}
          onOpenSettings={() => {
            setQualityOpen(false)
            setSettingsOpen(true)
          }}
          onSuggestSeo={applySeoSuggestion}
        />
      )}

      <div className="relative min-h-0 flex-1">
        <Puck
          key={page.id}
          config={adminPuckConfig}
          data={page.pageData ?? emptyPageData}
          headerTitle={page.title}
          headerPath={`/pages/${page.slug}`}
          onChange={handleChange}
          onPublish={publish}
          overrides={puckOverrides}
          viewports={[
            { width: 390, height: "auto", label: "Mobile", icon: "Smartphone" },
            { width: 768, height: "auto", label: "Tablet", icon: "Tablet" },
            { width: 1280, height: "auto", label: "Desktop", icon: "Monitor" },
            { width: 1440, height: "auto", label: "Wide", icon: "Monitor" },
          ]}
        />
      </div>
    </div>
  )
}

export default PageEditorRoute
