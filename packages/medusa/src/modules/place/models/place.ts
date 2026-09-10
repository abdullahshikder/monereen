import { model } from "@medusajs/framework/utils"

export const Place = model.define("place", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  country: model.text().nullable(),
  region: model.text().nullable(),
  description: model.text().nullable(),
  media: model.json().nullable(),
  seo: model.json().nullable(),
})
