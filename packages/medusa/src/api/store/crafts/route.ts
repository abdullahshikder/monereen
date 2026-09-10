import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: crafts } = await query.graph({
    entity: "craft",
    fields: ["*"],
  })

  res.json({ crafts })
}
