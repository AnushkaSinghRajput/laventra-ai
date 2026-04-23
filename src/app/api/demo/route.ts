import { NextResponse } from "next/server"
import { randomBytes } from "node:crypto"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Body must be an object" },
      { status: 400 }
    )
  }

  const { email, name, company, note } = body as Record<string, unknown>
  const emailStr = typeof email === "string" ? email.trim() : ""

  if (!emailStr) {
    return NextResponse.json(
      { error: "Work email is required" },
      { status: 400 }
    )
  }
  if (!EMAIL_RE.test(emailStr)) {
    return NextResponse.json(
      { error: "Please enter a valid work email" },
      { status: 400 }
    )
  }

  // Simulate a short server-side pipeline (validation, queue, etc.)
  await new Promise((r) => setTimeout(r, 450))

  const reference = `AM-${randomBytes(4).toString("hex").toUpperCase()}`

  // In production, persist to CRM, queue, or DB. Here we just acknowledge.
  console.log("[api/demo] Laventra demo request", {
    reference,
    email: emailStr,
    name: typeof name === "string" ? name : "",
    company: typeof company === "string" ? company : "",
    note: typeof note === "string" ? note.slice(0, 2000) : "",
  })

  return NextResponse.json({ ok: true, reference })
}
