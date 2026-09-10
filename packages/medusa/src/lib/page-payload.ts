import { MedusaError } from "@medusajs/framework/utils"

const PAGE_TYPES = [
  "STANDARD",
  "HOMEPAGE",
  "DROP_LANDING",
  "STORY",
  "LOOKBOOK",
  "CUSTOM",
] as const

const PAGE_STATUSES = [
  "DRAFT",
  "REVIEW",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
] as const

type JsonObject = Record<string, unknown>
type PageType = (typeof PAGE_TYPES)[number]
type PageStatus = (typeof PAGE_STATUSES)[number]

function isPageType(value: string): value is PageType {
  return PAGE_TYPES.includes(value as PageType)
}

function isPageStatus(value: string): value is PageStatus {
  return PAGE_STATUSES.includes(value as PageStatus)
}

function invalid(message: string): never {
  throw new MedusaError(MedusaError.Types.INVALID_DATA, message)
}

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function requiredString(body: JsonObject, key: string): string {
  const value = body[key]
  if (typeof value !== "string" || !value.trim()) {
    invalid(`${key} is required`)
  }
  return value.trim()
}

function optionalString(body: JsonObject, key: string): string | null | undefined {
  const value = body[key]
  if (value === undefined) return undefined
  if (value === null || value === "") return null
  if (typeof value !== "string") invalid(`${key} must be a string`)
  return value.trim()
}

function pageData(value: unknown): JsonObject | null | undefined {
  if (value === undefined || value === null) return value
  if (!isObject(value) || !Array.isArray(value.content) || !isObject(value.root)) {
    invalid("pageData must contain a content array and root object")
  }
  return value
}

export function parseCreatePage(bodyValue: unknown) {
  if (!isObject(bodyValue)) invalid("A page payload is required")

  const title = requiredString(bodyValue, "title")
  const slug = requiredString(bodyValue, "slug").toLowerCase()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    invalid("slug must contain lowercase letters, numbers, and single hyphens")
  }

  const requestedType = optionalString(bodyValue, "pageType") ?? "STANDARD"
  if (!isPageType(requestedType)) invalid("pageType is invalid")

  return {
    title,
    slug,
    pageType: requestedType,
    pageData: pageData(bodyValue.pageData) ?? { content: [], root: {} },
    themeId: optionalString(bodyValue, "themeId") ?? null,
    status: "DRAFT" as const,
    seo: isObject(bodyValue.seo) ? bodyValue.seo : null,
  }
}

export function parseUpdatePage(bodyValue: unknown) {
  if (!isObject(bodyValue)) invalid("A page payload is required")

  const update: JsonObject = {}
  if (bodyValue.title !== undefined) update.title = requiredString(bodyValue, "title")
  if (bodyValue.slug !== undefined) {
    const slug = requiredString(bodyValue, "slug").toLowerCase()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      invalid("slug must contain lowercase letters, numbers, and single hyphens")
    }
    update.slug = slug
  }
  if (bodyValue.pageType !== undefined) {
    const requestedType = requiredString(bodyValue, "pageType")
    if (!isPageType(requestedType)) invalid("pageType is invalid")
    update.pageType = requestedType
  }
  if (bodyValue.pageData !== undefined) update.pageData = pageData(bodyValue.pageData)
  if (bodyValue.themeId !== undefined) update.themeId = optionalString(bodyValue, "themeId")
  if (bodyValue.seo !== undefined) {
    if (bodyValue.seo !== null && !isObject(bodyValue.seo)) invalid("seo must be an object")
    update.seo = bodyValue.seo
  }
  if (bodyValue.status !== undefined) {
    const status = requiredString(bodyValue, "status")
    if (!isPageStatus(status)) invalid("status is invalid")
    update.status = status
    update.publishedAt = status === "PUBLISHED" ? new Date() : null
  }

  if (!Object.keys(update).length) invalid("No page fields were provided")
  return update
}
