"use client"

import { motion } from "framer-motion"
import { ShieldAlert, LockKeyhole, LineChart, Scale, Activity } from "lucide-react"

import { SectionHeader } from "./section-header"

const features = [
  {
    title: "Prompt Injection Defense",
    body: "Detect and neutralize jailbreak patterns and instruction hijacking before they mutate downstream tool actions.",
    icon: ShieldAlert,
  },
  {
    title: "Data Leakage Protection",
    body: "Policy-aware redaction across input, retrieval context, and output response channels in real time.",
    icon: LockKeyhole,
  },
  {
    title: "AI Risk Scoring",
    body: "Continuously compute severity with model behavior, user context, and policy confidence signals.",
    icon: LineChart,
  },
  {
    title: "Policy Engine",
    body: "Author and deploy fine-grained enforcement policies by role, tenant, geography, and workload class.",
    icon: Scale,
  },
  {
    title: "Real-time Monitoring",
    body: "Observe every AI decision with an explainable trail to support rapid incident response and audits.",
    icon: Activity,
  },
] as const

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-aegis/12 bg-gradient-to-b from-[#fbfaff] to-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Core features"
          title="Enterprise-grade AI safety primitives"
          description="Purpose-built controls to keep every AI interaction resilient, transparent, and compliant at scale."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="group rounded-2xl border border-aegis/15 bg-white/80 p-5 shadow-[0_8px_25px_-14px_rgba(111,76,255,0.35)] backdrop-blur-sm transition-all"
            >
              <div className="mb-4 inline-flex rounded-xl border border-aegis/20 bg-gradient-to-b from-aegis-mist/45 to-white p-2.5 shadow-sm transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5 text-aegis-ink" strokeWidth={1.6} />
              </div>
              <h3 className="text-aegis-ink text-lg font-semibold">{f.title}</h3>
              <p className="text-aegis-ink/65 mt-2 text-sm leading-relaxed">{f.body}</p>
              <span className="mt-4 block h-px w-0 bg-gradient-to-r from-aegis to-transparent transition-all duration-300 group-hover:w-full" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
