import { model } from "@medusajs/framework/utils"

export const Material = model.define("material", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  summary: model.text().nullable(),
  description: model.text().nullable(),
  origin: model.text().nullable(),
  media: model.json().nullable(),
  seo: model.json().nullable(),
})
