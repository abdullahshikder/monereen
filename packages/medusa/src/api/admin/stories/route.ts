import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: stories } = await query.graph({
    entity: "story",
    fields: ["*"],
  })

  res.json({ stories })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const storyService = req.scope.resolve("story")

  const body = req.body as any

  const story = await storyService.createStories(body)

  res.json({ story })
}
