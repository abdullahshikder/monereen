import { model } from "@medusajs/framework/utils"

export const HomepageExperience = model.define("homepage_experience", {
  id: model.id().primaryKey(),
  name: model.text(),
  dropId: model.text().nullable(),
  pageData: model.json().nullable(),
  themeId: model.text().nullable(),
  status: model.enum(["DRAFT", "REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: model.dateTime().nullable(),
})
