import { Module } from "@medusajs/framework/utils"
import MakerModuleService from "./service"

export const MAKER_MODULE = "maker"

export default Module(MAKER_MODULE, {
  service: MakerModuleService,
})
