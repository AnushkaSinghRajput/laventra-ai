import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { verifySessionToken } from "@/lib/auth"
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const user = verifySessionToken(token)

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }

  return NextResponse.json({ authenticated: true, user }, { status: 200 })
}
