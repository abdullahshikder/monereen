import { model } from "@medusajs/framework/utils"

export const CampaignTheme = model.define("campaign_theme", {
  id: model.id().primaryKey(),
  name: model.text(),
  backgroundColor: model.text().nullable(),
  foregroundColor: model.text().nullable(),
  accentColor: model.text().nullable(),
  mutedColor: model.text().nullable(),
  headingFontToken: model.text().nullable(),
  bodyFontToken: model.text().nullable(),
  navigationTheme: model.text().nullable(),
  logoVariant: model.text().nullable(),
  productCardVariant: model.text().nullable(),
  buttonVariant: model.text().nullable(),
  defaultSectionSpacing: model.text().nullable(),
  pageTransition: model.text().nullable(),
  cursorVariant: model.text().nullable(),
})
