import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: stories } = await query.graph({
    entity: "story",
    fields: ["*"],
  })

  res.json({ stories })
}
