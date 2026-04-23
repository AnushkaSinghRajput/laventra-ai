"use client"

import { motion } from "framer-motion"
import { PlugZap, SlidersHorizontal, Radar } from "lucide-react"

import { SectionHeader } from "./section-header"

const steps = [
  {
    step: "01",
    title: "Connect AI system",
    body: "Route prompts and model outputs through Laventra SDK or gateway in a few lines of code.",
    icon: PlugZap,
  },
  {
    step: "02",
    title: "Define guardrails",
    body: "Create policy rules, response boundaries, and escalation logic based on your risk model.",
    icon: SlidersHorizontal,
  },
  {
    step: "03",
    title: "Monitor + control",
    body: "Track decisions in real time and enforce automated action paths with explainable outcomes.",
    icon: Radar,
  },
] as const

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b border-aegis/12 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="Three-step AI protection workflow"
          description="From first integration to production reliability, Laventra keeps safety controls consistently in the loop."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="glass-card h-full rounded-2xl border border-aegis/15 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-aegis/70 font-mono text-sm">{step.step}</span>
                  <span className="inline-flex rounded-lg border border-aegis/15 bg-white/70 p-2">
                    <step.icon className="h-4 w-4 text-aegis-ink" />
                  </span>
                </div>
                <h3 className="text-aegis-ink mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="text-aegis-ink/65 mt-2 text-sm leading-relaxed">{step.body}</p>
              </motion.div>

              {i < steps.length - 1 ? (
                <motion.div
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="absolute top-1/2 -right-3 hidden h-[2px] w-6 origin-left bg-gradient-to-r from-aegis/70 to-aegis-mist/50 lg:block"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
