import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: places } = await query.graph({
    entity: "place",
    fields: ["*"],
  })

  res.json({ places })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const placeService = req.scope.resolve("place")

  const body = req.body as any

  const place = await placeService.createPlaces(body)

  res.json({ place })
}
