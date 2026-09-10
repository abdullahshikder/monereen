import { Module } from "@medusajs/framework/utils"
import CraftModuleService from "./service"

export const CRAFT_MODULE = "craft"

export default Module(CRAFT_MODULE, {
  service: CraftModuleService,
})
