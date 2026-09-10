import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { parseCreatePage } from "../../../lib/page-payload"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: pages } = await query.graph({
    entity: "page",
    fields: ["*"],
  })

  res.json({ pages })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pageService = req.scope.resolve("page")
  const page = await pageService.createPages(parseCreatePage(req.body))
  res.status(201).json({ page })
}
