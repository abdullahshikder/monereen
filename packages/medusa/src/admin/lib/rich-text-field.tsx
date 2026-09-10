import { Image, Link, ListBullet } from "@medusajs/icons"
import { Button, Input, Text } from "@medusajs/ui"
import TiptapImage from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { adminRequest } from "./pages"

interface RichTextFieldProps {
  value: string
  onChange: (value: string) => void
  readOnly?: boolean
}

const allowedUrl = (value: string) => {
  const url = value.trim()
  if (!url) return ""
  if (url.startsWith("/") || url.startsWith("#")) return url
  try {
    const parsed = new URL(url)
    return ["http:", "https:", "mailto:"].includes(parsed.protocol) ? url : ""
  } catch {
    return ""
  }
}

const editorContent = (value: string) => {
  if (!value || /<[a-z][\s\S]*>/i.test(value)) return value || ""
  // Pages created before rich text stored raw copy, so preserve their paragraphs on first edit.
  const escapeHtml = (text: string) => text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replaceAll("\n", "<br>")}</p>`)
    .join("")
}

export const RichTextField = ({ value, onChange, readOnly }: RichTextFieldProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkValue, setLinkValue] = useState("")
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { enableClickSelection: true, openOnClick: false },
      }),
      TiptapImage.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder: "Write something…" }),
    ],
    content: editorContent(value),
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-text-input min-h-40 px-3 py-2 text-sm leading-6 text-ui-fg-base outline-none",
        "aria-label": "Rich text content",
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.isEmpty ? "" : currentEditor.getHTML()),
  })

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    editor.setEditable(!readOnly)
  }, [editor, readOnly])

  useEffect(() => {
    if (!editor || editor.isDestroyed || editor.isFocused) return
    const nextValue = editorContent(value)
    const currentValue = editor.isEmpty ? "" : editor.getHTML()
    if (currentValue !== nextValue) editor.commands.setContent(nextValue, { emitUpdate: false })
  }, [editor, value])

  const openLinkEditor = () => {
    if (!editor) return
    setLinkValue(editor.getAttributes("link").href || "")
    setLinkOpen(true)
    setError("")
  }

  const applyLink = () => {
    if (!editor) return
    const url = allowedUrl(linkValue)
    if (!url) {
      setError("Enter a valid web, email, page, or anchor link.")
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    setLinkOpen(false)
    setLinkValue("")
    setError("")
  }

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run()
    setLinkOpen(false)
    setLinkValue("")
    setError("")
  }

  const insertImage = async (file?: File) => {
    if (!file || !editor) return
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setError("Choose an image smaller than 10 MB.")
      return
    }
    const formData = new FormData()
    formData.append("files", file)
    setUploadingImage(true)
    setError("")
    try {
      const result = await adminRequest<{ files: Array<{ id: string; url: string }> }>("/admin/uploads", {
        method: "POST",
        body: formData,
      })
      const uploaded = result.files[0]
      if (!uploaded?.url) throw new Error("Medusa did not return an image URL")
      editor.chain().focus().setImage({ src: uploaded.url, alt: file.name }).run()
      void adminRequest("/admin/page-media", {
        method: "POST",
        body: JSON.stringify({
          fileId: uploaded.id,
          url: uploaded.url,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        }),
      }).catch(() => undefined)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload image")
    } finally {
      setUploadingImage(false)
      if (imageInputRef.current) imageInputRef.current.value = ""
    }
  }

  const toolbarButton = (
    label: string,
    action: () => void,
    icon: ReactNode,
    active = false,
    disabled = false,
  ) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={readOnly || disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={action}
      className={`flex h-7 min-w-7 items-center justify-center rounded px-1.5 text-ui-fg-subtle hover:bg-ui-bg-base-hover hover:text-ui-fg-base disabled:opacity-50 ${active ? "bg-ui-bg-base-pressed text-ui-fg-base" : ""}`}
    >
      {icon}
    </button>
  )

  const currentStyle = editor?.isActive("heading", { level: 2 })
    ? "h2"
    : editor?.isActive("heading", { level: 3 })
      ? "h3"
      : editor?.isActive("blockquote")
        ? "blockquote"
        : "p"

  return (
    <div className="overflow-hidden rounded-md border border-ui-border-base bg-ui-bg-field shadow-borders-base">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-ui-border-base bg-ui-bg-subtle p-1">
        <select
          aria-label="Text style"
          disabled={readOnly || !editor}
          value={currentStyle}
          onMouseDown={(event) => event.stopPropagation()}
          onChange={(event) => {
            const style = event.target.value
            const chain = editor?.chain().focus()
            if (style === "h2") chain?.setHeading({ level: 2 }).run()
            else if (style === "h3") chain?.setHeading({ level: 3 }).run()
            else if (style === "blockquote") chain?.setBlockquote().run()
            else chain?.setParagraph().run()
          }}
          className="txt-compact-small h-7 rounded border-0 bg-transparent px-1.5 text-ui-fg-subtle outline-none hover:bg-ui-bg-base-hover"
        >
          <option value="p">Body</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
        </select>
        <span className="mx-1 h-4 w-px bg-ui-border-base" />
        {toolbarButton("Bold", () => editor?.chain().focus().toggleBold().run(), <strong>B</strong>, Boolean(editor?.isActive("bold")))}
        {toolbarButton("Italic", () => editor?.chain().focus().toggleItalic().run(), <em>I</em>, Boolean(editor?.isActive("italic")))}
        {toolbarButton("Bullet list", () => editor?.chain().focus().toggleBulletList().run(), <ListBullet />, Boolean(editor?.isActive("bulletList")))}
        {toolbarButton("Numbered list", () => editor?.chain().focus().toggleOrderedList().run(), <span className="font-mono text-xs">1.</span>, Boolean(editor?.isActive("orderedList")))}
        {toolbarButton("Add link", openLinkEditor, <Link />, Boolean(editor?.isActive("link")))}
        {toolbarButton(uploadingImage ? "Uploading image" : "Upload inline image", () => imageInputRef.current?.click(), <Image />, false, uploadingImage)}
      </div>
      {linkOpen && (
        <div className="flex items-center gap-2 border-b border-ui-border-base bg-ui-bg-base p-2">
          <Input
            value={linkValue}
            onChange={(event) => setLinkValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault()
                applyLink()
              }
              if (event.key === "Escape") setLinkOpen(false)
            }}
            placeholder="https://, /page, #section, or mailto:"
            aria-label="Link URL"
            autoFocus
          />
          <Button type="button" size="small" onClick={applyLink}>Apply</Button>
          {editor?.isActive("link") && <Button type="button" size="small" variant="transparent" onClick={removeLink}>Remove</Button>}
          <Button type="button" size="small" variant="transparent" onClick={() => setLinkOpen(false)}>Cancel</Button>
        </div>
      )}
      <EditorContent editor={editor} className="rich-text-editor" />
      <div className="border-t border-ui-border-base bg-ui-bg-subtle px-3 py-1.5">
        <Text size="xsmall" className={error ? "text-ui-fg-error" : "text-ui-fg-muted"}>
          {error || "Headings, lists, links, and inline image uploads are supported."}
        </Text>
      </div>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        hidden
        disabled={readOnly || uploadingImage}
        onChange={(event) => void insertImage(event.target.files?.[0])}
      />
    </div>
  )
}
