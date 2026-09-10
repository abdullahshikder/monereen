import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const team = process.env.CLOUDFLARE_ACCESS_TEAM_DOMAIN
const audience = process.env.CLOUDFLARE_ACCESS_AUD
if (Boolean(team) !== Boolean(audience)) {
  throw new Error("Configure both CLOUDFLARE_ACCESS_TEAM_DOMAIN and CLOUDFLARE_ACCESS_AUD")
}
if (team && !/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(team)) {
  throw new Error("CLOUDFLARE_ACCESS_TEAM_DOMAIN must be your team.cloudflareaccess.com hostname")
}

const loadJose = () => import("jose")
type Jose = Awaited<ReturnType<typeof loadJose>>
let keySet: ReturnType<Jose["createRemoteJWKSet"]> | undefined

export async function verifyCloudflareAccess(
  req: MedusaRequest,
  res: MedusaResponse,
  next: () => void,
) {
  // The public site remains available before Access is provisioned. Once the
  // application is configured, protected routes require a signed Access JWT.
  if (!team || !audience) return next()
  const token = req.headers["cf-access-jwt-assertion"]
  if (typeof token !== "string") {
    return res.status(401).json({ message: "Cloudflare Access authentication required" })
  }
  try {
    const { createRemoteJWKSet, jwtVerify } = await loadJose()
    keySet ??= createRemoteJWKSet(new URL(`https://${team}/cdn-cgi/access/certs`))
    await jwtVerify(token, keySet, { issuer: `https://${team}`, audience, algorithms: ["RS256"] })
  } catch {
    return res.status(401).json({ message: "Invalid or expired Cloudflare Access authentication" })
  }
  return next()
}
