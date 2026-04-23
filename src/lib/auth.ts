import { createHmac, timingSafeEqual } from "node:crypto"

export type AuthUser = {
  id: string
  email: string
  name: string
  role: "admin" | "member"
}

type SessionPayload = {
  sub: string
  email: string
  name: string
  role: AuthUser["role"]
  exp: number
}

function b64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function fromB64url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/")
  const pad = normalized.length % 4
  const padded = pad ? normalized + "=".repeat(4 - pad) : normalized
  return Buffer.from(padded, "base64")
}

function getAuthSecret() {
  return process.env.AUTH_SECRET || "laventra-dev-secret-change-me"
}

function sign(data: string, secret: string) {
  return b64url(createHmac("sha256", secret).update(data).digest())
}

function getConfiguredUsers(): Array<AuthUser & { password: string }> {
  const adminEmail = process.env.AUTH_ADMIN_EMAIL || "admin@laventra.ai"
  const adminPassword = process.env.AUTH_ADMIN_PASSWORD || "Laventra@123"

  return [
    {
      id: "u_admin",
      email: adminEmail.toLowerCase(),
      name: "Laventra Admin",
      role: "admin",
      password: adminPassword,
    },
  ]
}

export function validateCredentials(email: string, password: string): AuthUser | null {
  const normalized = email.trim().toLowerCase()
  const user = getConfiguredUsers().find(
    (u) => u.email === normalized && u.password === password
  )
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

export function createSessionToken(user: AuthUser, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  }

  const body = b64url(JSON.stringify(payload))
  const secret = getAuthSecret()
  const signature = sign(body, secret)
  return `${body}.${signature}`
}

export function verifySessionToken(token: string | undefined | null): AuthUser | null {
  if (!token) return null

  const [body, signature] = token.split(".")
  if (!body || !signature) return null

  const secret = getAuthSecret()
  const expected = sign(body, secret)

  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expected)
  if (sigBuf.length !== expectedBuf.length) return null
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null

  try {
    const payload = JSON.parse(fromB64url(body).toString("utf8")) as SessionPayload
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    }
  } catch {
    return null
  }
}
