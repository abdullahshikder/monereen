import Medusa from "@medusajs/js-sdk"

let sdk: Medusa | null = null

export function getMedusa() {
  if (!sdk) {
    sdk = new Medusa({
      baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
      publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    })
  }
  return sdk
}
