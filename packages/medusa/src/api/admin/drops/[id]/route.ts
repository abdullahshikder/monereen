import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")
  const id = req.params.id

  const { data: [drop] } = await query.graph({
    entity: "drop",
    fields: ["*"],
    filters: { id },
  })

  if (!drop) {
    return res.status(404).json({ message: "Drop not found" })
  }

  res.json({ drop })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const dropService = req.scope.resolve("drop")
  const id = req.params.id
  const body = req.body as any

  const drop = await dropService.updateDrops({ ...body, id })

  res.json({ drop })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const dropService = req.scope.resolve("drop")
  const id = req.params.id

  await dropService.deleteDrops(id)

  res.status(200).json({ message: "Drop deleted" })
}
