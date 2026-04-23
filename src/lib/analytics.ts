export type AnalyticsProps = Record<string, string | number | boolean | null>

type AnalyticsPayload = {
  event: string
  props?: AnalyticsProps
  path: string
  ts: string
  sessionId: string
}

declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

function getSessionId() {
  if (typeof window === "undefined") return "server"
  const key = "laventra_session_id"
  const existing = window.sessionStorage.getItem(key)
  if (existing) return existing
  const next = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  window.sessionStorage.setItem(key, next)
  return next
}

export function trackEvent(event: string, props?: AnalyticsProps) {
  if (typeof window === "undefined") return

  const payload: AnalyticsPayload = {
    event,
    props,
    path: window.location.pathname,
    ts: new Date().toISOString(),
    sessionId: getSessionId(),
  }

  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(payload)

  const body = JSON.stringify(payload)

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" })
      navigator.sendBeacon("/api/analytics", blob)
      return
    }
  } catch {
    // fallback below
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined)
}
