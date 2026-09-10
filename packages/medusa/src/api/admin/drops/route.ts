import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: drops } = await query.graph({
    entity: "drop",
    fields: ["*"],
  })

  res.json({ drops })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const dropService = req.scope.resolve("drop")

  const body = req.body as any

  const drop = await dropService.createDrops(body)

  res.json({ drop })
}
