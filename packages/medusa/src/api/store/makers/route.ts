import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: makers } = await query.graph({
    entity: "maker",
    fields: ["*"],
  })

  res.json({ makers })
}
