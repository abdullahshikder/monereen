import { Module } from "@medusajs/framework/utils"
import HomepageExperienceModuleService from "./service"

export const HOMEPAGE_EXPERIENCE_MODULE = "homepageExperience"

export default Module(HOMEPAGE_EXPERIENCE_MODULE, {
  service: HomepageExperienceModuleService,
})
