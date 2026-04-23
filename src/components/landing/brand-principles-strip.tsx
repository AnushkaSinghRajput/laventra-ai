"use client"

import { Shield, Sparkles, Orbit, BadgeCheck } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  { label: "Built for safety", sub: "Protection at the core", icon: Shield },
  { label: "Powered by AI", sub: "Context-aware analysis", icon: Sparkles },
  { label: "Real-time guardrails", sub: "Sub-second response", icon: Orbit },
  { label: "Enterprise ready", sub: "SSO, audit, regions", icon: BadgeCheck },
] as const

export function BrandPrinciplesStrip() {
  return (
    <section
      aria-label="Laventra product principles"
      className="border-b border-aegis/10 bg-white/90"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-aegis/15">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="from-aegis-mist/5 flex min-h-[84px] flex-1 items-start gap-3 border-b border-aegis/10 bg-gradient-to-b to-white/50 py-4 sm:border-b-0 sm:px-4 sm:py-5
              first:sm:pl-0
              last:border-b-0
              sm:last:pr-0
              "
            >
              <it.icon
                className="text-aegis-ink/60 mt-0.5 h-5 w-5 shrink-0"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-aegis-ink text-sm font-medium">{it.label}</p>
                <p className="text-aegis-ink/55 mt-0.5 text-xs">{it.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
