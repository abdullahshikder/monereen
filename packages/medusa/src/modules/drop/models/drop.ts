import { model } from "@medusajs/framework/utils"

export const Drop = model.define("drop", {
  id: model.id().primaryKey(),
  name: model.text(),
  slug: model.text().unique(),
  subtitle: model.text().nullable(),
  description: model.text().nullable(),
  status: model.enum(["DRAFT", "UPCOMING", "LIVE", "ARCHIVED"]).default("DRAFT"),
  launchAt: model.dateTime().nullable(),
  endAt: model.dateTime().nullable(),
  commerceCollectionId: model.text().nullable(),
  homepageTakeover: model.boolean().default(false),
  homepageExperienceId: model.text().nullable(),
  campaignThemeId: model.text().nullable(),
  navigationMode: model.enum(["DEFAULT", "CAMPAIGN", "CUSTOM"]).default("DEFAULT"),
  navigationConfigId: model.text().nullable(),
  announcement: model.text().nullable(),
  seo: model.json().nullable(),
  publishedAt: model.dateTime().nullable(),
})
