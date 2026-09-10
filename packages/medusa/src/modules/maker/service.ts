import { MedusaService } from "@medusajs/framework/utils"
import { Maker } from "./models/maker"

class MakerModuleService extends MedusaService({ Maker }) {}

export default MakerModuleService
