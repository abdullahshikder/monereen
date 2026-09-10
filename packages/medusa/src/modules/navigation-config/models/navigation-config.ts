import { model } from "@medusajs/framework/utils"

export const NavigationConfig = model.define("navigation_config", {
  id: model.id().primaryKey(),
  name: model.text(),
  mode: model.enum(["DEFAULT", "CAMPAIGN", "CUSTOM"]).default("DEFAULT"),
  items: model.json().nullable(),
})
