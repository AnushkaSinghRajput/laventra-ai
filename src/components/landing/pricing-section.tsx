"use client"

import { Check } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { trackEvent } from "@/lib/analytics"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "./section-header"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    blurb: "Best for exploration and early prototypes.",
    cta: "Start free",
    featured: false,
    features: ["1 AI app", "Basic risk scoring", "Community support"],
  },
  {
    name: "Pro",
    price: "$149",
    period: "/seat/month",
    blurb: "For scaling teams deploying AI in production.",
    cta: "Upgrade to Pro",
    featured: true,
    features: ["Unlimited AI apps", "Advanced policy engine", "Real-time monitoring", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    blurb: "For global organizations with compliance needs.",
    cta: "Contact Sales",
    featured: false,
    features: ["Private deployment options", "Dedicated success engineer", "Audit and compliance suite"],
  },
] as const

export function PricingSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="pricing" className="border-b border-aegis/12 bg-gradient-to-b from-[#fbfaff] to-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Pricing"
          title="Flexible plans for every growth stage"
          description="Choose the platform tier that fits your AI risk surface and scale with confidence."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.article
              key={tier.name}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={reduceMotion ? { duration: 0.01 } : { delay: i * 0.06, duration: 0.4 }}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              className={cn(
                "rounded-2xl border p-5 shadow-[0_10px_30px_-18px_rgba(111,76,255,0.35)]",
                tier.featured
                  ? "border-aegis/35 bg-gradient-to-b from-[#f4efff] to-white"
                  : "border-aegis/15 bg-white/85"
              )}
            >
              {tier.featured ? (
                <span className="mb-3 inline-flex rounded-full border border-aegis/25 bg-aegis-mist/40 px-2 py-0.5 text-xs text-aegis-ink/80">
                  Most popular
                </span>
              ) : null}
              <h3 className="text-aegis-ink text-xl font-semibold">{tier.name}</h3>
              <p className="text-aegis-ink/60 mt-1 text-sm">{tier.blurb}</p>
              <p className="text-aegis-ink mt-4 text-4xl font-semibold tabular-nums">
                {tier.price}
                <span className="text-aegis-ink/50 ml-1 text-sm font-medium">{tier.period}</span>
              </p>

              <Button
                className={cn(
                  "mt-4 h-10 w-full border border-aegis/20",
                  tier.featured
                    ? "bg-gradient-to-b from-[#c8b6ff] to-[#ece8ff] text-aegis-ink"
                    : "bg-white"
                )}
                variant={tier.featured ? "default" : "outline"}
                onClick={() =>
                  trackEvent("cta_click", {
                    source: "pricing",
                    tier: tier.name,
                    cta: tier.cta,
                  })
                }
              >
                {tier.cta}
              </Button>

              <ul className="mt-4 space-y-2.5 text-sm text-aegis-ink/70">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-aegis-ink/70" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
