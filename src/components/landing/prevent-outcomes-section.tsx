"use client"

import { SectionHeader } from "./section-header"
import { StaggerGroup, StaggerItem } from "./scroll-reveal"

const columns = [
  {
    title: "Security risk",
    bullets: [
      "Direct and indirect prompt attacks, including tool-steering and indirect injection via documents",
      "Unexpected tool and connector use (APIs, browsers, data stores) outside least-privilege",
      "Cross-tenant mix-ups, role confusion, and privilege hops in shared infrastructure",
    ],
  },
  {
    title: "Brand and safety risk",
    bullets: [
      "Jailbreaks, refusal bypass, and tone drift in customer chat or email surfaces",
      "Toxic, harassing, or off-brand phrasing in generated content",
      "Deceptive nudges that push users to unsafe actions (finance, health, children)",
    ],
  },
  {
    title: "Compliance risk",
    bullets: [
      "PII, healthcare, and payment data handled in ways that break policy or law",
      "Data minimization, retention, and redaction policies not honored end to end",
      "Missing, inconsistent evidence for internal control programs and outside audits",
    ],
  },
  {
    title: "Identity and over-permission",
    bullets: [
      "Agent or bot identities that can be confused with humans or other roles",
      "Escalation of tool scope when the model requests more than the user is entitled to",
      "Hidden paths to exfiltration through retrieval, side channels, and long memory",
    ],
  },
] as const

export function PreventOutcomesSection() {
  return (
    <section
      id="prevent"
      className="border-b border-aegis/10 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Coverage"
          title="What Laventra helps you prevent"
          description="Outcomes we map to the questions security, GRC, and product leaders already ask—so the roadmap lines up with what your board can understand."
        />
        <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-2">
          {columns.map((col) => (
            <StaggerItem key={col.title}>
              <div
                className="border-aegis/15 to-aegis-mist/5 h-full rounded-2xl border
                bg-gradient-to-b from-white/90
                p-5 shadow-sm
                sm:p-6
                "
              >
                <h3 className="text-aegis-ink text-base font-semibold">
                  {col.title}
                </h3>
                <ul className="text-aegis-ink/70 mt-3 list-disc space-y-2.5 pl-4 text-sm leading-relaxed">
                  {col.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
