import { model } from "@medusajs/framework/utils"

export const PageAsset = model.define("page_asset", {
  id: model.id().primaryKey(),
  fileId: model.text().unique(),
  url: model.text(),
  filename: model.text(),
  mimeType: model.text(),
  size: model.number(),
})
