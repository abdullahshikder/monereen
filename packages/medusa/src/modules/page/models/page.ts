import { model } from "@medusajs/framework/utils"

export const Page = model.define("page", {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text().unique(),
  pageType: model.enum(["STANDARD", "HOMEPAGE", "DROP_LANDING", "STORY", "LOOKBOOK", "CUSTOM"]).default("STANDARD"),
  pageData: model.json().nullable(),
  themeId: model.text().nullable(),
  status: model.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seo: model.json().nullable(),
  publishedAt: model.dateTime().nullable(),
})
