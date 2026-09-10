import { model } from "@medusajs/framework/utils"

export const Maker = model.define("maker", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  portrait: model.text().nullable(),
  shortBio: model.text().nullable(),
  longBio: model.text().nullable(),
  location: model.text().nullable(),
  gallery: model.json().nullable(),
  videos: model.json().nullable(),
  seo: model.json().nullable(),
})
