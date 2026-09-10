import { MedusaService } from "@medusajs/framework/utils"
import { Material } from "./models/material"

class MaterialModuleService extends MedusaService({ Material }) {}

export default MaterialModuleService
