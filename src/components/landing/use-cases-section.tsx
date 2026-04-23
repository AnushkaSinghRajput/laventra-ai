"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Building2, Rocket, Code2 } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "./section-header"
import { cn } from "@/lib/utils"

const tabs = [
  {
    id: "enterprise",
    label: "Enterprises",
    icon: Building2,
    title: "Govern AI safely across global operations",
    points: [
      "Role and region-based policy controls",
      "Audit-friendly logs for compliance teams",
      "Unified monitoring across all AI products",
    ],
  },
  {
    id: "startup",
    label: "AI Startups",
    icon: Rocket,
    title: "Move faster without security debt",
    points: [
      "Drop-in guardrails for rapid product iteration",
      "Instant insights on risky model behavior",
      "Automated policy checks for investor-grade trust",
    ],
  },
  {
    id: "developer",
    label: "Developers",
    icon: Code2,
    title: "Ship reliable AI experiences with confidence",
    points: [
      "Simple APIs and SDK-driven integrations",
      "Mock + live policy testing in development",
      "Explainable decisions for debugging and QA",
    ],
  },
] as const

export function UseCasesSection() {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("enterprise")
  const current = tabs.find((t) => t.id === active) ?? tabs[0]
  const reduceMotion = useReducedMotion()

  return (
    <section id="use-cases" className="border-b border-aegis/12 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Use cases"
          title="Tailored workflows for every AI team"
          description="Laventra adapts to your operating model, from startup velocity to enterprise governance."
        />

        <div className="mt-12 rounded-2xl border border-aegis/15 bg-white/85 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <Button
                key={t.id}
                variant={active === t.id ? "secondary" : "ghost"}
                className={cn(
                  "h-9 rounded-xl border border-transparent",
                  active === t.id && "border-aegis/25 bg-aegis-mist/45"
                )}
                onClick={() => {
                  setActive(t.id)
                  trackEvent("tab_switch", { section: "use_cases", tab: t.id })
                }}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </Button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22 }}
              className="rounded-xl border border-aegis/12 bg-gradient-to-b from-[#faf8ff] to-white p-5"
            >
              <h3 className="text-aegis-ink text-xl font-semibold">{current.title}</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-aegis-ink/70">
                {current.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-aegis/70" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
