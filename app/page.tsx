import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function Home() {
  // Check if user is logged in from cookies
  const cookieStore = cookies()
  const hasUserCookie = cookieStore.has("user")

  // Redirect to dashboard if logged in, otherwise to login
  if (hasUserCookie) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}

