import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: materials } = await query.graph({
    entity: "material",
    fields: ["*"],
  })

  res.json({ materials })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const materialService = req.scope.resolve("material")

  const body = req.body as any

  const material = await materialService.createMaterials(body)

  res.json({ material })
}
