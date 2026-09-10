import { Button, Input, Text } from "@medusajs/ui"
import type { Config } from "@measured/puck"
import { puckConfig } from "@monereen/page-builder"
import { useEffect, useRef, useState, type DragEvent } from "react"
import { adminRequest } from "./pages"
import { RichTextField } from "./rich-text-field"

interface UploadedFile {
  id: string
  url: string
  filename?: string
  mimeType?: string
  size?: number
}

interface CatalogPrice {
  amount: number
  currency_code: string
}

interface CatalogProduct {
  id: string
  title: string
  handle: string
  description?: string | null
  thumbnail?: string | null
  images?: Array<{ url: string }> | null
  variants?: Array<{ prices?: CatalogPrice[] | null }> | null
}

interface ProductCard {
  name: string
  price: string
  image: string
  href: string
}

interface MediaUploadProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
  accept: string
  kind: "image" | "media"
  onFileColor?: (color: string) => void
}

interface GalleryFrameValue {
  src?: string
  mobileSrc?: string
  alt?: string
  chapter?: string
  caption?: string
  color?: string
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_MEDIA_BYTES = 50 * 1024 * 1024
const IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
])

const catalogCache = new Map<string, CatalogProduct>()

const isVideoUrl = (url: string) => /\.(mp4|webm)(?:\?|$)/i.test(url)
const isImageUrl = (url: string) => /\.(avif|gif|jpe?g|png|webp)(?:\?|$)/i.test(url)

const dominantImageColor = async (file: File) => {
  try {
    const bitmap = await createImageBitmap(file)
    const canvas = document.createElement("canvas")
    canvas.width = 32
    canvas.height = 32
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return "#2d2925"
    context.drawImage(bitmap, 0, 0, 32, 32)
    bitmap.close()

    const pixels = context.getImageData(0, 0, 32, 32).data
    const buckets = new Map<string, { count: number; red: number; green: number; blue: number }>()
    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index]
      const green = pixels[index + 1]
      const blue = pixels[index + 2]
      const alpha = pixels[index + 3]
      const brightness = (red + green + blue) / 3
      if (alpha < 180 || brightness < 12 || brightness > 248) continue
      const key = `${red >> 4}-${green >> 4}-${blue >> 4}`
      const bucket = buckets.get(key) || { count: 0, red: 0, green: 0, blue: 0 }
      bucket.count += 1
      bucket.red += red
      bucket.green += green
      bucket.blue += blue
      buckets.set(key, bucket)
    }

    const dominant = [...buckets.values()].sort((left, right) => right.count - left.count)[0]
    if (!dominant) return "#2d2925"
    const toHex = (value: number) => Math.round(value).toString(16).padStart(2, "0")
    return `#${toHex(dominant.red / dominant.count)}${toHex(dominant.green / dominant.count)}${toHex(dominant.blue / dominant.count)}`
  } catch {
    return "#2d2925"
  }
}

const formatCatalogPrice = (product: CatalogProduct) => {
  const prices = product.variants?.flatMap((variant) => variant.prices || []) || []
  const price = prices.find((item) => item.currency_code === "usd") || prices[0]
  if (!price) return ""

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: price.currency_code.toUpperCase(),
    }).format(price.amount)
  } catch {
    return `${price.amount} ${price.currency_code.toUpperCase()}`
  }
}

const toProductCard = (product: CatalogProduct): ProductCard => ({
  name: product.title,
  price: formatCatalogPrice(product),
  image: product.thumbnail || product.images?.[0]?.url || "",
  href: `/products/${product.handle}`,
})

const loadCatalogProducts = async (query = "") => {
  const params = new URLSearchParams({ limit: "20" })
  params.append("status[]", "published")
  if (query.trim()) params.set("q", query.trim())
  const result = await adminRequest<{ products: CatalogProduct[] }>(
    `/admin/products?${params.toString()}`,
  )
  result.products.forEach((product) => catalogCache.set(product.handle, product))
  return result.products
}

const getCatalogProduct = async (handle: string) => {
  const cached = catalogCache.get(handle)
  if (cached) return cached

  const params = new URLSearchParams({ limit: "1", handle })
  const result = await adminRequest<{ products: CatalogProduct[] }>(
    `/admin/products?${params.toString()}`,
  )
  const product = result.products[0]
  if (product) catalogCache.set(product.handle, product)
  return product
}

interface CatalogPickerProps {
  value: string[]
  onChange: (value: string[]) => void
  readOnly?: boolean
  multiple?: boolean
}

const CatalogPicker = ({
  value,
  onChange,
  readOnly,
  multiple = false,
}: CatalogPickerProps) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    let active = true
    const timer = window.setTimeout(() => {
      setLoading(true)
      setError("")
      void loadCatalogProducts(query)
        .then((items) => {
          if (active) setProducts(items)
        })
        .catch((loadError) => {
          if (active) {
            setError(loadError instanceof Error ? loadError.message : "Could not load products")
          }
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, 250)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [open, query])

  const selectProduct = (product: CatalogProduct) => {
    catalogCache.set(product.handle, product)
    if (multiple) {
      if (!value.includes(product.handle) && value.length < 12) {
        onChange([...value, product.handle])
      }
    } else {
      onChange([product.handle])
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-col gap-1">
          {value.map((handle) => (
            <div key={handle} className="flex items-center justify-between rounded-md border border-ui-border-base bg-ui-bg-subtle px-2 py-1.5">
              <Text size="xsmall" weight="plus" className="truncate">{handle}</Text>
              {!readOnly && (
                <Button
                  type="button"
                  size="small"
                  variant="transparent"
                  onClick={() => onChange(value.filter((item) => item !== handle))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        size="small"
        variant="secondary"
        disabled={readOnly || (multiple && value.length >= 12)}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Close catalog" : multiple ? "Add products from catalog" : "Choose from catalog"}
      </Button>
      {open && (
        <div className="flex flex-col gap-2 rounded-md border border-ui-border-base bg-ui-bg-base p-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            autoFocus
          />
          {loading && <Text size="xsmall" className="text-ui-fg-subtle">Loading products…</Text>}
          {error && <Text size="xsmall" className="text-ui-fg-error">{error}</Text>}
          {!loading && !error && products.length === 0 && (
            <Text size="xsmall" className="text-ui-fg-subtle">No published products found.</Text>
          )}
          <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto">
            {products.map((product) => {
              const selected = value.includes(product.handle)
              const image = product.thumbnail || product.images?.[0]?.url
              return (
                <button
                  key={product.id}
                  type="button"
                  disabled={selected}
                  onClick={() => selectProduct(product)}
                  className="overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-subtle text-left disabled:opacity-50"
                >
                  <div className="aspect-square bg-ui-bg-component">
                    {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="p-2">
                    <Text size="xsmall" weight="plus" className="line-clamp-2">{product.title}</Text>
                    <Text size="xsmall" className="text-ui-fg-subtle">{formatCatalogPrice(product) || "No price"}</Text>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const MediaUpload = ({ value, onChange, readOnly, accept, kind, onFileColor }: MediaUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [libraryFiles, setLibraryFiles] = useState<UploadedFile[]>([])

  const loadLibrary = async () => {
    setLibraryLoading(true)
    setError("")
    try {
      const result = await adminRequest<{ files: UploadedFile[] }>("/admin/page-media")
      setLibraryFiles(
        result.files.filter((file) =>
          kind === "media"
            ? isImageUrl(file.url) || isVideoUrl(file.url)
            : isImageUrl(file.url),
        ),
      )
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load media")
    } finally {
      setLibraryLoading(false)
    }
  }

  useEffect(() => {
    if (libraryOpen && libraryFiles.length === 0) void loadLibrary()
  }, [libraryOpen])

  const upload = async (file?: File) => {
    if (!file) return
    const isImage = IMAGE_TYPES.has(file.type)
    const isVideo = file.type === "video/mp4" || file.type === "video/webm"
    if (!isImage && (kind === "image" || !isVideo)) {
      setError(kind === "image" ? "Choose an image file." : "Choose an image, MP4, or WebM file.")
      return
    }

    const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_MEDIA_BYTES
    if (file.size > maxBytes) {
      setError(`File must be smaller than ${maxBytes / 1024 / 1024} MB.`)
      return
    }

    const formData = new FormData()
    formData.append("files", file)
    const colorPromise = isImage ? dominantImageColor(file) : Promise.resolve("")
    setUploading(true)
    setError("")
    try {
      const result = await adminRequest<{ files: UploadedFile[] }>("/admin/uploads", {
        method: "POST",
        body: formData,
      })
      const uploaded = result.files[0]
      if (!uploaded?.url) throw new Error("Medusa did not return a file URL")
      onChange(uploaded.url)
      const matchedColor = await colorPromise
      if (matchedColor) onFileColor?.(matchedColor)
      try {
        const result = await adminRequest<{ asset: UploadedFile }>("/admin/page-media", {
          method: "POST",
          body: JSON.stringify({
            fileId: uploaded.id,
            url: uploaded.url,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
          }),
        })
        setLibraryFiles((files) => [
          result.asset,
          ...files.filter((item) => item.id !== result.asset.id),
        ])
      } catch (registerError) {
        setError(
          registerError instanceof Error
            ? `Upload succeeded, but the library could not index it: ${registerError.message}`
            : "Upload succeeded, but the library could not index it.",
        )
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (!readOnly && !uploading) void upload(event.dataTransfer.files[0])
  }

  const showsVideo = kind === "media" && isVideoUrl(value)

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-subtle">
          {showsVideo ? (
            <video src={value} className="max-h-40 w-full object-cover" controls muted />
          ) : (
            <img src={value} alt="Selected upload" className="max-h-40 w-full object-cover" />
          )}
        </div>
      )}
      <Input
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste a URL or upload below"
        disabled={readOnly || uploading}
      />
      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="flex items-center justify-between gap-2 rounded-md border border-dashed border-ui-border-strong bg-ui-bg-subtle p-3"
      >
        <Text size="xsmall" className="text-ui-fg-subtle">
          Drop a file here
        </Text>
        <div className="flex gap-2">
          {value && (
            <Button type="button" size="small" variant="transparent" disabled={readOnly || uploading} onClick={() => onChange("")}>
              Remove
            </Button>
          )}
          <Button type="button" size="small" variant="secondary" isLoading={uploading} disabled={readOnly} onClick={() => inputRef.current?.click()}>
            Choose file
          </Button>
        </div>
      </div>
      <Button
        type="button"
        size="small"
        variant="secondary"
        disabled={readOnly}
        onClick={() => setLibraryOpen((current) => !current)}
      >
        {libraryOpen ? "Close media library" : "Browse media library"}
      </Button>
      {libraryOpen && (
        <div className="rounded-md border border-ui-border-base bg-ui-bg-base p-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <Text size="xsmall" className="text-ui-fg-subtle">Recent uploads</Text>
            <Button type="button" size="small" variant="transparent" isLoading={libraryLoading} onClick={() => void loadLibrary()}>
              Refresh
            </Button>
          </div>
          {!libraryLoading && libraryFiles.length === 0 && (
            <Text size="xsmall" className="text-ui-fg-subtle">No compatible uploads yet.</Text>
          )}
          <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto">
            {libraryFiles.map((file) => (
              <button
                key={file.id}
                type="button"
                title={file.url}
                onClick={() => {
                  onChange(file.url)
                  setLibraryOpen(false)
                }}
                className={`aspect-square overflow-hidden rounded-md border bg-ui-bg-subtle ${value === file.url ? "border-ui-border-interactive" : "border-ui-border-base"}`}
              >
                {isVideoUrl(file.url) ? (
                  <video src={file.url} className="h-full w-full object-cover" muted />
                ) : (
                  <img src={file.url} alt="" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        disabled={readOnly || uploading}
        onChange={(event) => void upload(event.target.files?.[0])}
      />
      {error && <Text size="xsmall" className="text-ui-fg-error">{error}</Text>}
    </div>
  )
}

const createUploadField = (label: string, kind: "image" | "media" = "image") => ({
  type: "custom" as const,
  label,
  render: ({
    value,
    onChange,
    readOnly,
  }: {
    value: string
    onChange: (value: string) => void
    readOnly?: boolean
  }) => (
    <MediaUpload
      value={value || ""}
      onChange={onChange}
      readOnly={readOnly}
      kind={kind}
      accept={kind === "image" ? "image/avif,image/gif,image/jpeg,image/png,image/webp" : "image/avif,image/gif,image/jpeg,image/png,image/webp,video/mp4,video/webm"}
    />
  ),
})

const createRichTextField = (label: string) => ({
  type: "custom" as const,
  label,
  render: ({
    value,
    onChange,
    readOnly,
  }: {
    value: string
    onChange: (value: string) => void
    readOnly?: boolean
  }) => (
    <RichTextField value={value || ""} onChange={onChange} readOnly={readOnly} />
  ),
})

const GalleryFramesField = ({
  value,
  onChange,
  readOnly,
}: {
  value: GalleryFrameValue[]
  onChange: (value: GalleryFrameValue[]) => void
  readOnly?: boolean
}) => {
  const bulkInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const frames = Array.isArray(value) ? value : []

  const updateFrame = (index: number, patch: Partial<GalleryFrameValue>) => {
    onChange(frames.map((frame, frameIndex) => frameIndex === index ? { ...frame, ...patch } : frame))
  }

  const moveFrame = (index: number, direction: number) => {
    const destination = index + direction
    if (destination < 0 || destination >= frames.length) return
    const next = [...frames]
    const [frame] = next.splice(index, 1)
    next.splice(destination, 0, frame)
    onChange(next)
  }

  const uploadMany = async (fileList: FileList | null) => {
    const room = Math.max(0, 60 - frames.length)
    const files = Array.from(fileList || []).slice(0, room)
    if (!files.length) return
    const invalid = files.find((file) => !IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_BYTES)
    if (invalid) {
      setError(`${invalid.name} must be a supported image smaller than 10 MB.`)
      return
    }

    setUploading(true)
    setError("")
    try {
      const [colors, uploadResult] = await Promise.all([
        Promise.all(files.map(dominantImageColor)),
        (async () => {
          const formData = new FormData()
          files.forEach((file) => formData.append("files", file))
          return adminRequest<{ files: UploadedFile[] }>("/admin/uploads", { method: "POST", body: formData })
        })(),
      ])
      const additions = uploadResult.files.map((uploaded, index) => ({
        src: uploaded.url,
        mobileSrc: "",
        alt: files[index]?.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") || "",
        chapter: "Collection",
        caption: "",
        color: colors[index] || "#2d2925",
      }))
      onChange([...frames, ...additions])

      const registrations = uploadResult.files.map((uploaded, index) =>
        adminRequest<{ asset: UploadedFile }>("/admin/page-media", {
          method: "POST",
          body: JSON.stringify({
            fileId: uploaded.id,
            url: uploaded.url,
            filename: files[index]?.name,
            mimeType: files[index]?.type,
            size: files[index]?.size,
          }),
        }),
      )
      const results = await Promise.allSettled(registrations)
      if (results.some((result) => result.status === "rejected")) {
        setError("Images were added, but some could not be indexed in the media library.")
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Bulk upload failed")
    } finally {
      setUploading(false)
      if (bulkInputRef.current) bulkInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" size="small" variant="secondary" isLoading={uploading} disabled={readOnly || frames.length >= 60} onClick={() => bulkInputRef.current?.click()}>
          Upload multiple
        </Button>
        <Button type="button" size="small" variant="secondary" disabled={readOnly || frames.length >= 60} onClick={() => onChange([...frames, { src: "", mobileSrc: "", alt: "", chapter: "Collection", caption: "", color: "#2d2925" }])}>
          Add empty frame
        </Button>
      </div>
      <Text size="xsmall" className="text-ui-fg-subtle">{frames.length}/60 frames · colors are matched automatically on upload</Text>
      <input ref={bulkInputRef} type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" multiple hidden disabled={readOnly || uploading} onChange={(event) => void uploadMany(event.target.files)} />

      <div className="flex max-h-[55vh] flex-col gap-2 overflow-y-auto pr-1">
        {frames.map((frame, index) => (
          <details key={`${frame.src || "empty"}-${index}`} className="rounded-md border border-ui-border-base bg-ui-bg-base" open={index === 0 && frames.length <= 3}>
            <summary className="flex cursor-pointer list-none items-center gap-2 p-2">
              <span className="flex h-10 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-ui-bg-subtle text-ui-fg-muted">
                {frame.src ? <img src={frame.src} alt="" className="h-full w-full object-cover" /> : index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <Text size="xsmall" weight="plus" className="truncate">{frame.chapter || `Frame ${index + 1}`}</Text>
                <Text size="xsmall" className="truncate text-ui-fg-subtle">{frame.alt || "Needs image and alt text"}</Text>
              </span>
              <span className="h-5 w-5 rounded-full border border-ui-border-base" style={{ backgroundColor: /^#[0-9a-f]{6}$/i.test(frame.color || "") ? frame.color : "#2d2925" }} />
            </summary>
            <div className="flex flex-col gap-3 border-t border-ui-border-base p-3">
              <div className="grid grid-cols-3 gap-2">
                <Button type="button" size="small" variant="transparent" disabled={readOnly || index === 0} onClick={() => moveFrame(index, -1)}>Move up</Button>
                <Button type="button" size="small" variant="transparent" disabled={readOnly || index === frames.length - 1} onClick={() => moveFrame(index, 1)}>Move down</Button>
                <Button type="button" size="small" variant="danger" disabled={readOnly} onClick={() => onChange(frames.filter((_, frameIndex) => frameIndex !== index))}>Remove</Button>
              </div>
              <div className="flex flex-col gap-1"><Text size="xsmall" weight="plus">Desktop image</Text><MediaUpload value={frame.src || ""} onChange={(src) => updateFrame(index, { src })} onFileColor={(color) => updateFrame(index, { color })} readOnly={readOnly} kind="image" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" /></div>
              <div className="flex flex-col gap-1"><Text size="xsmall" weight="plus">Mobile image</Text><MediaUpload value={frame.mobileSrc || ""} onChange={(mobileSrc) => updateFrame(index, { mobileSrc })} readOnly={readOnly} kind="image" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" /></div>
              <div className="flex flex-col gap-1"><Text size="xsmall" weight="plus">Chapter or collection</Text><Input value={frame.chapter || ""} disabled={readOnly} onChange={(event) => updateFrame(index, { chapter: event.target.value })} /></div>
              <div className="flex flex-col gap-1"><Text size="xsmall" weight="plus">Alternative text</Text><Input value={frame.alt || ""} disabled={readOnly} onChange={(event) => updateFrame(index, { alt: event.target.value })} /></div>
              <div className="flex flex-col gap-1"><Text size="xsmall" weight="plus">Caption</Text><Input value={frame.caption || ""} disabled={readOnly} onChange={(event) => updateFrame(index, { caption: event.target.value })} /></div>
              <div className="flex flex-col gap-1">
                <Text size="xsmall" weight="plus">Matched background color</Text>
                <div className="flex items-center gap-2">
                  <input type="color" value={/^#[0-9a-f]{6}$/i.test(frame.color || "") ? frame.color : "#2d2925"} disabled={readOnly} onChange={(event) => updateFrame(index, { color: event.target.value })} className="h-8 w-10 cursor-pointer rounded-md border border-ui-border-base bg-ui-bg-field p-1" />
                  <Input value={frame.color || ""} disabled={readOnly} placeholder="#2d2925" onChange={(event) => updateFrame(index, { color: event.target.value })} />
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
      {error && <Text size="xsmall" className="text-ui-fg-error">{error}</Text>}
    </div>
  )
}

const createGalleryFramesField = () => ({
  type: "custom" as const,
  label: "Frames",
  render: ({ value, onChange, readOnly }: { value: GalleryFrameValue[]; onChange: (value: GalleryFrameValue[]) => void; readOnly?: boolean }) => (
    <GalleryFramesField value={value || []} onChange={onChange} readOnly={readOnly} />
  ),
})

const withUploadField = (componentName: string, fieldName: string, label: string, kind: "image" | "media" = "image") => {
  const component = puckConfig.components[componentName]
  return {
    ...component,
    fields: {
      ...component.fields,
      [fieldName]: createUploadField(label, kind),
    },
  }
}

const createCatalogField = (label: string, multiple = false) => ({
  type: "custom" as const,
  label,
  render: ({
    value,
    onChange,
    readOnly,
  }: {
    value: string | string[]
    onChange: (value: string | string[]) => void
    readOnly?: boolean
  }) => (
    <CatalogPicker
      value={Array.isArray(value) ? value : value ? [value] : []}
      onChange={(handles) => onChange(multiple ? handles : handles[0] || "")}
      readOnly={readOnly}
      multiple={multiple}
    />
  ),
})

const productGrid = puckConfig.components.ProductGrid
const productsField = productGrid.fields?.products
if (!productsField || productsField.type !== "array") {
  throw new Error("ProductGrid products must be configured as an array field")
}
const productsWithUpload = {
  ...productsField,
  arrayFields: {
    ...productsField.arrayFields,
    image: createUploadField("Image"),
  },
}

const immersiveGallery = puckConfig.components.ImmersiveGallery

const featuredProduct = withUploadField("FeaturedProduct", "image", "Product image")
const fullscreenHero = withUploadField("FullscreenHero", "media", "Desktop image or video", "media")
const fullBleedImage = withUploadField("FullBleedImage", "src", "Desktop image")
const imageText = withUploadField("ImageText", "image", "Desktop image")
const storyFeature = withUploadField("StoryFeature", "image", "Desktop story image")

const resolveFeaturedProduct = async (
  data: { props: Record<string, unknown> },
  params: { changed: Partial<Record<PropertyKey, boolean>> },
) => {
  if (!params.changed.productId) return { props: {} }
  const handle = String(data.props.productId || "")
  if (!handle) {
    return {
      props: { productName: "", description: "", image: "", mobileImage: "", price: "" },
    }
  }
  const product = await getCatalogProduct(handle)
  if (!product) return { props: {} }

  return {
    props: {
      productName: product.title,
      description: product.description || "",
      image: product.thumbnail || product.images?.[0]?.url || "",
      mobileImage: "",
      price: formatCatalogPrice(product),
    },
  }
}

const resolveProductGrid = async (
  data: { props: Record<string, unknown> },
  params: { changed: Partial<Record<PropertyKey, boolean>> },
) => {
  // A custom Puck field can update only its own value. Keep catalog handles in
  // catalogProducts, then project them into the editable cards the block renders.
  if (!params.changed.catalogProducts) return { props: {} }
  const handles = Array.isArray(data.props.catalogProducts)
    ? data.props.catalogProducts.map(String)
    : []
  const products = await Promise.all(handles.map(getCatalogProduct))
  return { props: { products: products.filter(Boolean).map((product) => toProductCard(product!)) } }
}

export const adminPuckConfig: Config = {
  ...puckConfig,
  components: {
    ...puckConfig.components,
    ImmersiveGallery: {
      ...immersiveGallery,
      fields: {
        ...immersiveGallery.fields,
        frames: createGalleryFramesField(),
      },
    },
    FullscreenHero: {
      ...fullscreenHero,
      fields: {
        ...fullscreenHero.fields,
        mobileMedia: createUploadField("Mobile image or video", "media"),
      },
    },
    EditorialText: {
      ...puckConfig.components.EditorialText,
      fields: {
        ...puckConfig.components.EditorialText.fields,
        body: createRichTextField("Body"),
      },
    },
    FullBleedImage: {
      ...fullBleedImage,
      fields: {
        ...fullBleedImage.fields,
        mobileSrc: createUploadField("Mobile image"),
      },
    },
    ImageText: {
      ...imageText,
      fields: {
        ...imageText.fields,
        mobileImage: createUploadField("Mobile image"),
        body: createRichTextField("Body"),
      },
    },
    FeaturedProduct: {
      ...featuredProduct,
      fields: {
        ...featuredProduct.fields,
        productId: createCatalogField("Catalog product"),
        mobileImage: createUploadField("Mobile product image"),
        description: createRichTextField("Description"),
      },
      resolveData: resolveFeaturedProduct,
    },
    ProductGrid: {
      ...productGrid,
      fields: {
        ...productGrid.fields,
        catalogProducts: createCatalogField("Catalog products", true),
        products: productsWithUpload,
      },
      resolveData: resolveProductGrid,
    },
    StoryFeature: {
      ...storyFeature,
      fields: {
        ...storyFeature.fields,
        mobileImage: createUploadField("Mobile story image"),
      },
    },
    Newsletter: {
      ...puckConfig.components.Newsletter,
      fields: {
        ...puckConfig.components.Newsletter.fields,
        body: createRichTextField("Supporting text"),
      },
    },
    CTA: {
      ...puckConfig.components.CTA,
      fields: {
        ...puckConfig.components.CTA.fields,
        body: createRichTextField("Supporting text"),
      },
    },
    Section: {
      ...puckConfig.components.Section,
      fields: {
        ...puckConfig.components.Section.fields,
        backgroundImage: createUploadField("Background image"),
        mobileBackgroundImage: createUploadField("Mobile background image"),
      },
    },
  },
}
