"use client"

import { Code2, Workflow, Network, Fingerprint, Shield } from "lucide-react"

import { SectionHeader } from "./section-header"
import { StaggerGroup, StaggerItem } from "./scroll-reveal"

const rows = [
  {
    label: "LLM platforms",
    sub: "API-first; works with your current model vendor or self-host",
    icon: Code2,
  },
  {
    label: "Agents & orchestration",
    sub: "Middleware-style hooks in your app server or agent framework",
    icon: Workflow,
  },
  {
    label: "Connectors (e.g. MCP-style)",
    sub: "Enforce at the tool boundary and across shared registries you approve",
    icon: Network,
  },
  {
    label: "Identity",
    sub: "SSO, groups, and claims for role- and tenant-aware policy",
    icon: Fingerprint,
  },
  {
    label: "Security operations",
    sub: "Webhooks, SIEM export, and ticket routes for hand-off to IR",
    icon: Shield,
  },
] as const

export function IntegrationsGridSection() {
  return (
    <section
      id="integrations"
      className="to-aegis-mist/10 border-b border-aegis/10 bg-gradient-to-b from-aegis-surface/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Integrations"
          title="Plugs into the stack you already run"
          description="No rip-and-replace. Laventra is designed to sit in the line of fire between identity, data, and model calls."
        />
        <StaggerGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <StaggerItem key={r.label}>
              <div
                className="border-aegis/12 from-white/80 flex h-full gap-3 rounded-2xl border
                bg-gradient-to-b to-aegis-mist/5
                p-4
                shadow-sm
                "
              >
                <r.icon
                  className="text-aegis-ink/75 mt-0.5 h-5 w-5 shrink-0"
                  strokeWidth={1.4}
                />
                <div>
                  <h3 className="text-aegis-ink text-sm font-semibold">
                    {r.label}
                  </h3>
                  <p className="text-aegis-ink/60 mt-1 text-xs leading-relaxed sm:text-sm">
                    {r.sub}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
