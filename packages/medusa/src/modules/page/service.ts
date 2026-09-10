import { MedusaService } from "@medusajs/framework/utils"
import { Page } from "./models/page"
import { PageAsset } from "./models/page-asset"

class PageModuleService extends MedusaService({ Page, PageAsset }) {}

export default PageModuleService
