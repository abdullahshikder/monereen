import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: makers } = await query.graph({
    entity: "maker",
    fields: ["*"],
  })

  res.json({ makers })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const makerService = req.scope.resolve("maker")

  const body = req.body as any

  const maker = await makerService.createMakers(body)

  res.json({ maker })
}
