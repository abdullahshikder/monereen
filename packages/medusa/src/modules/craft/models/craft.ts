import { model } from "@medusajs/framework/utils"

export const Craft = model.define("craft", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  summary: model.text().nullable(),
  history: model.text().nullable(),
  process: model.text().nullable(),
  origin: model.text().nullable(),
  heroMedia: model.text().nullable(),
  gallery: model.json().nullable(),
  videos: model.json().nullable(),
  seo: model.json().nullable(),
})
