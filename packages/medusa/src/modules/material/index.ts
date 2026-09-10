import { Module } from "@medusajs/framework/utils"
import MaterialModuleService from "./service"

export const MATERIAL_MODULE = "material"

export default Module(MATERIAL_MODULE, {
  service: MaterialModuleService,
})
