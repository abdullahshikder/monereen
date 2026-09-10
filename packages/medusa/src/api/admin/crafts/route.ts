import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: crafts } = await query.graph({
    entity: "craft",
    fields: ["*"],
  })

  res.json({ crafts })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const craftService = req.scope.resolve("craft")

  const body = req.body as any

  const craft = await craftService.createCrafts(body)

  res.json({ craft })
}
