import { NextResponse } from "next/server"

import {
  createSessionToken,
  validateCredentials,
} from "@/lib/auth"
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
  }

  const { email, password } = body as Record<string, unknown>
  const emailStr = typeof email === "string" ? email : ""
  const passwordStr = typeof password === "string" ? password : ""

  if (!emailStr || !passwordStr) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  const user = validateCredentials(emailStr, passwordStr)
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    )
  }

  const token = createSessionToken(user)
  const response = NextResponse.json({ ok: true, user })

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return response
}
