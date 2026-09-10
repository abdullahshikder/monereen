import { redirect } from "next/navigation"

export default function BuilderPage() {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  redirect(`${backendUrl}/app/pages`)
}
