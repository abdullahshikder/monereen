import { Module } from "@medusajs/framework/utils"
import NavigationConfigModuleService from "./service"

export const NAVIGATION_CONFIG_MODULE = "navigationConfig"

export default Module(NAVIGATION_CONFIG_MODULE, {
  service: NavigationConfigModuleService,
})
