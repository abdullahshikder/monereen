import { verifyCloudflareAccess } from "./cloudflare-access"
import { authenticate, defineMiddlewares } from "@medusajs/framework/http"

import { rateLimit, ipKeyGenerator } from "express-rate-limit"

// X-Real-IP is overwritten by our localhost Nginx proxy. Never trust a
// client-supplied forwarding header on a directly connected request.
const adminLoginLimiter = rateLimit({
  windowMs: 60_000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const peer = req.socket.remoteAddress || "127.0.0.1"
    const isLocal = ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(peer)
    const forwarded = req.headers["x-real-ip"]
    return ipKeyGenerator(isLocal && typeof forwarded === "string" ? forwarded : peer)
  },
  message: { message: "Too many sign-in attempts. Please try again in a minute." },
})

const authenticateAdmin = authenticate("user", ["session", "bearer", "api-key"])

export default defineMiddlewares([
  { matcher: "/app*", middlewares: [verifyCloudflareAccess] },
  { matcher: "/admin*", middlewares: [verifyCloudflareAccess] },
  { matcher: "/auth/user/*", middlewares: [verifyCloudflareAccess, adminLoginLimiter] },
  {
    matcher: "/admin/pages*",
    middlewares: [authenticateAdmin],
  },
  {
    matcher: "/admin/page-media",
    middlewares: [authenticateAdmin],
  },
])
