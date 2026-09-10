import { Module } from "@medusajs/framework/utils"
import CampaignThemeModuleService from "./service"

export const CAMPAIGN_THEME_MODULE = "campaignTheme"

export default Module(CAMPAIGN_THEME_MODULE, {
  service: CampaignThemeModuleService,
})
