import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_COOKIE_NAME } from "@/lib/auth-constants"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value
  const hasSession = Boolean(token)

  if (pathname.startsWith("/portal") && !hasSession) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/portal", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/portal/:path*"],
}
