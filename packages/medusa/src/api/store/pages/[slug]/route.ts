import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")
  const { data: [page] } = await query.graph({
    entity: "page",
    fields: ["*"],
    filters: { slug: req.params.slug, status: "PUBLISHED" },
  })

  if (!page) {
    return res.status(404).json({ message: "Page not found" })
  }

  res.json({ page })
}
