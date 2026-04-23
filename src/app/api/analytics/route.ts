import { NextResponse } from "next/server"

type Payload = {
  event?: string
  props?: Record<string, unknown>
  path?: string
  ts?: string
  sessionId?: string
}

export async function POST(request: Request) {
  let body: Payload
  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: "Invalid analytics payload" }, { status: 400 })
  }

  if (!body?.event || typeof body.event !== "string") {
    return NextResponse.json({ error: "Missing event name" }, { status: 400 })
  }

  // Replace with real sink (PostHog, Segment, Mixpanel, internal pipeline)
  console.log("[analytics]", {
    event: body.event,
    path: body.path,
    ts: body.ts,
    sessionId: body.sessionId,
    props: body.props ?? {},
  })

  return NextResponse.json({ ok: true })
}
