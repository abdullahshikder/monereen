import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: pages } = await query.graph({
    entity: "page",
    fields: ["*"],
    filters: { status: "PUBLISHED" },
  })

  res.json({ pages })
}
