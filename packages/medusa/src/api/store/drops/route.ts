import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const dropService = req.scope.resolve("drop")

  const query = req.scope.resolve("query")

  const { data: drops } = await query.graph({
    entity: "drop",
    fields: ["*"],
  })

  res.json({ drops })
}
