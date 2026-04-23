"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { AlertTriangle, ShieldCheck, ShieldX } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader } from "./section-header"
import { cn } from "@/lib/utils"

const baseBars = [46, 60, 42, 72, 55, 88, 48, 70, 61, 84, 58, 76]
const incidents = [
  { type: "safe", text: "Approved: knowledge retrieval for support bot" },
  { type: "warning", text: "Warning: prompt requests privileged context" },
  { type: "blocked", text: "Blocked: attempt to exfiltrate customer PII" },
  { type: "safe", text: "Approved: analytics summary with safe output" },
] as const

function CountUp({ value, suffix = "", reduceMotion = false }: { value: number; suffix?: string; reduceMotion?: boolean | null }) {
  const [current, setCurrent] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (reduceMotion) {
      setCurrent(value)
      return
    }

    let frame = 0
    const duration = 26
    const step = value / duration
    const id = window.setInterval(() => {
      frame += 1
      setCurrent((prev) => {
        const next = prev + step
        return next >= value || frame >= duration ? value : next
      })
      if (frame >= duration) {
        window.clearInterval(id)
      }
    }, 22)
    return () => window.clearInterval(id)
  }, [value, reduceMotion])

  return (
    <span className="tabular-nums">{Math.round(current).toLocaleString()}{suffix}</span>
  )
}

function SkeletonPreview() {
  return (
    <div className="rounded-2xl border border-aegis/15 bg-white/80 p-5">
      <div className="h-4 w-40 animate-pulse rounded bg-aegis-mist/45" />
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-aegis-mist/30" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2 h-40 animate-pulse rounded-xl bg-aegis-mist/30" />
        <div className="lg:col-span-3 h-40 animate-pulse rounded-xl bg-aegis-mist/30" />
      </div>
    </div>
  )
}

export function DashboardPreviewSection() {
  const [windowType, setWindowType] = useState<"24h" | "7d" | "30d">("7d")
  const [loading, setLoading] = useState(true)
  const [incidentIdx, setIncidentIdx] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 950)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const id = window.setInterval(
      () => setIncidentIdx((prev) => (prev + 1) % incidents.length),
      2400
    )
    return () => window.clearInterval(id)
  }, [reduceMotion])

  const model = useMemo(() => {
    const multiplier = windowType === "24h" ? 0.22 : windowType === "30d" ? 4.2 : 1
    const requests = Math.round(286000 * multiplier)
    const riskPct = windowType === "24h" ? 0.38 : windowType === "30d" ? 0.28 : 0.34
    const blocked = Math.round(requests * riskPct * 0.18)
    const bars = baseBars.map((v) => Math.min(96, Math.round(v * (windowType === "30d" ? 1.18 : 1))))
    return { requests, riskPct, blocked, bars }
  }, [windowType])

  const incident = incidents[incidentIdx]

  return (
    <section id="dashboard" className="border-b border-aegis/12 bg-gradient-to-b from-[#fbfaff] to-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Dashboard preview"
          title="Command center for AI safety operations"
          description="Track risk trends, decision logs, and policy outcomes from one clean operational view."
        />

        <div className="mt-12">
          {loading ? (
            <SkeletonPreview />
          ) : (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0.01 } : undefined}
              className="glass-card rounded-2xl border border-aegis/18 p-4 sm:p-5"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-aegis-ink/50 text-xs font-semibold tracking-widest uppercase">
                  Live Laventra Console
                </p>
                <div className="flex gap-1.5">
                  {(["24h", "7d", "30d"] as const).map((w) => (
                    <Button
                      key={w}
                      size="sm"
                      variant={windowType === w ? "secondary" : "ghost"}
                      className="h-7 text-xs"
                      onClick={() => {
                        setWindowType(w)
                        trackEvent("tab_switch", { section: "dashboard", tab: w })
                      }}
                    >
                      {w}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <Metric title="Requests analyzed" value={<CountUp value={model.requests} reduceMotion={Boolean(reduceMotion)} />} />
                <Metric title="Risk flagged" value={`${(model.riskPct * 100).toFixed(2)}%`} />
                <Metric title="Blocked actions" value={<CountUp value={model.blocked} reduceMotion={Boolean(reduceMotion)} />} />
              </div>

              <div className="grid gap-4 lg:grid-cols-5">
                <Card className="border-aegis/12 bg-white/80 lg:col-span-2">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm text-aegis-ink/80">Risk trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <svg viewBox="0 0 120 40" className="h-20 w-full">
                      <motion.path
                        initial={reduceMotion ? false : { pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={reduceMotion ? { duration: 0.01 } : { duration: 0.9 }}
                        d="M0,31 C15,6 25,37 43,18 C62,-2 76,18 91,10 C103,4 111,8 120,3"
                        fill="none"
                        stroke="var(--aegis-lavender)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </CardContent>
                </Card>

                <Card className="border-aegis/12 bg-white/80 lg:col-span-3">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-sm text-aegis-ink/80">Decision volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-32 items-end justify-between gap-1 rounded-xl border border-aegis/10 bg-aegis-mist/8 px-2 pb-1 pt-3">
                      {model.bars.map((h, i) => (
                        <motion.span
                          key={`${h}-${i}`}
                          initial={reduceMotion ? false : { height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={reduceMotion ? { duration: 0.01 } : { delay: i * 0.02, duration: 0.35 }}
                          className="w-full max-w-[7%] rounded-t bg-gradient-to-t from-[#a78bfa] to-[#e8e2ff]"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-4 rounded-xl border border-aegis/12 bg-white/85 p-3">
                <p className="text-aegis-ink/45 mb-2 text-xs uppercase tracking-widest">Live decision log</p>
                <div className="flex items-center gap-2">
                  {incident.type === "safe" ? (
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  ) : incident.type === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <ShieldX className="h-4 w-4 text-rose-500" />
                  )}
                  <p className="text-aegis-ink/70 text-sm">{incident.text}</p>
                  <span
                    className={cn(
                      "ml-auto rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase",
                      incident.type === "safe"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : incident.type === "warning"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                    )}
                  >
                    {incident.type}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

function Metric({
  title,
  value,
}: {
  title: string
  value: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-aegis/12 bg-white/85 p-3">
      <p className="text-aegis-ink/50 text-xs">{title}</p>
      <p className="text-aegis-ink mt-1 text-xl font-semibold">{value}</p>
    </div>
  )
}
