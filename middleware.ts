import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login"
  const hasUserCookie = request.cookies.has("user")

  // For the root path, redirect to dashboard if logged in, otherwise to login
  if (path === "/") {
    return hasUserCookie
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is not logged in and trying to access a protected route
  if (!hasUserCookie && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is logged in and trying to access login page
  if (hasUserCookie && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // For all other cases, just continue
  return NextResponse.next()
}

// Only apply middleware to these specific paths to avoid unnecessary redirects
export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard",
    "/dashboard/users",
    "/dashboard/events",
    "/dashboard/content",
    "/dashboard/feedback",
    "/dashboard/ministry",
    "/dashboard/notifications",
  ],
}

