import { Module } from "@medusajs/framework/utils"
import PlaceModuleService from "./service"

export const PLACE_MODULE = "place"

export default Module(PLACE_MODULE, {
  service: PlaceModuleService,
})
