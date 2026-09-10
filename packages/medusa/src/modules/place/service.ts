import { MedusaService } from "@medusajs/framework/utils"
import { Place } from "./models/place"

class PlaceModuleService extends MedusaService({ Place }) {}

export default PlaceModuleService
