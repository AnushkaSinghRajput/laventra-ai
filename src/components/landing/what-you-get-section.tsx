"use client"

import { LifeBuoy, FileCheck2, LineChart } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SectionHeader } from "./section-header"
import { StaggerGroup, StaggerItem } from "./scroll-reveal"

const cards = [
  {
    title: "Review and response",
    body: "Triage with full context: policy hit, user session, and tool stack so on-call is not reading raw model dumps when minutes matter.",
    icon: LifeBuoy,
  },
  {
    title: "Audit-ready evidence",
    body: "Each decision can carry policy version, rule id, and a short reason string—exportable to your log stack and control frameworks.",
    icon: FileCheck2,
  },
  {
    title: "Continuous improvement",
    body: "Drill into false positives, tune classes, and roll out changes to staging first—so safety gets sharper as models and products evolve.",
    icon: LineChart,
  },
] as const

export function WhatYouGetSection() {
  return (
    <section
      id="value"
      className="to-aegis-mist/10 border-b border-aegis/10 bg-gradient-to-b from-aegis-surface/40 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What you get"
          title="Decisions you can stand behind"
          description="Every enforcement path is designed to be legible: enough detail for fast response, not so much that storage and privacy become a second problem."
        />
        <StaggerGroup className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <StaggerItem key={c.title}>
              <Card
                className="border-aegis/15 to-aegis-mist/5 from-white/90 h-full border
                bg-gradient-to-b
                transition-shadow
                duration-300
                hover:shadow-md
                "
              >
                <CardHeader>
                  <c.icon
                    className="text-aegis-ink/80 mb-1 h-8 w-8"
                    strokeWidth={1.35}
                  />
                  <CardTitle className="text-aegis-ink text-lg">
                    {c.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-aegis-ink/65 text-sm leading-relaxed">
                    {c.body}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <p className="text-aegis-ink/50 mx-auto mt-8 max-w-2xl text-center text-sm">
          <a
            className="text-aegis-ink/80 font-medium underline-offset-2 hover:underline"
            href="#demo"
          >
            Talk to our team
          </a>{" "}
          for a product walkthrough mapped to your architecture.
        </p>
      </div>
    </section>
  )
}
