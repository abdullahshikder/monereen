import { model } from "@medusajs/framework/utils"

export const Story = model.define("story", {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text().unique(),
  subtitle: model.text().nullable(),
  excerpt: model.text().nullable(),
  heroMedia: model.text().nullable(),
  status: model.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  pageData: model.json().nullable(),
  seo: model.json().nullable(),
  publishedAt: model.dateTime().nullable(),
})
