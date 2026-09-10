import { MedusaService } from "@medusajs/framework/utils"
import { Story } from "./models/story"

class StoryModuleService extends MedusaService({ Story }) {}

export default StoryModuleService
