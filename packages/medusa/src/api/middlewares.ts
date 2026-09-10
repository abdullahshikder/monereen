import { authenticate, defineMiddlewares } from "@medusajs/framework/http"

const authenticateAdmin = authenticate("user", ["session", "bearer", "api-key"])

export default defineMiddlewares([
  {
    matcher: "/admin/pages*",
    middlewares: [authenticateAdmin],
  },
  {
    matcher: "/admin/page-media",
    middlewares: [authenticateAdmin],
  },
])
