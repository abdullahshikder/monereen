import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

const LIBRARY_LIMIT = 60

interface RegisterPageAssetBody {
  fileId: string
  url: string
  filename: string
  mimeType: string
  size: number
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const pageService = req.scope.resolve("page")
  const [files, count] = await pageService.listAndCountPageAssets(
    {},
    {
      take: LIBRARY_LIMIT,
      order: { created_at: "DESC" },
    },
  )

  res.json({ files, count })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const pageService = req.scope.resolve("page")
  const fileService = req.scope.resolve(Modules.FILE)
  const body = req.body as RegisterPageAssetBody

  if (
    !body?.fileId ||
    !body.url ||
    !body.filename ||
    !body.mimeType ||
    body.filename.length > 255 ||
    body.url.length > 2048 ||
    !Number.isFinite(body.size) ||
    body.size < 0
  ) {
    return res.status(400).json({ message: "Invalid page asset metadata" })
  }

  const file = await fileService.retrieveFile(body.fileId)
  if (file.url !== body.url) {
    return res.status(400).json({ message: "The file URL does not match the uploaded file" })
  }

  const existing = await pageService.listPageAssets({ fileId: body.fileId })
  const asset = existing[0]
    ? await pageService.updatePageAssets({ id: existing[0].id, ...body })
    : await pageService.createPageAssets(body)

  res.status(existing[0] ? 200 : 201).json({ asset })
}
