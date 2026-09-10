import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { parseUpdatePage } from "../../../../lib/page-payload"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")
  const { data: [page] } = await query.graph({
    entity: "page",
    fields: ["*"],
    filters: { id: req.params.id },
  })

  if (!page) {
    return res.status(404).json({ message: "Page not found" })
  }

  res.json({ page })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pageService = req.scope.resolve("page")
  const page = await pageService.updatePages({
    id: req.params.id,
    ...parseUpdatePage(req.body),
  })

  res.json({ page })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const pageService = req.scope.resolve("page")
  await pageService.deletePages(req.params.id)
  res.status(200).json({ id: req.params.id, deleted: true })
}
