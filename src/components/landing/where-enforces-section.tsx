"use client"

import { Filter, BookOpen, Wrench, Type, ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { SectionHeader } from "./section-header"
import { StaggerGroup, StaggerItem } from "./scroll-reveal"

const surfaces = [
  {
    title: "Prompt boundary",
    body: "Ingress filtering, injection and smuggling defenses, and policy-aware rewrite, block, or hand-off before a model is invoked.",
    icon: Filter,
  },
  {
    title: "Retrieval boundary (RAG)",
    body: "Score and filter chunks and sources; require citations; redact or escalate on suspicious or poisoned inputs.",
    icon: BookOpen,
  },
  {
    title: "Tool boundary (agents, MCP, APIs)",
    body: "Pre-approve or deny tool calls, constrain domains and side effects, and keep least privilege stable under agent loops.",
    icon: Wrench,
  },
  {
    title: "Output boundary",
    body: "Tone, disclosure, region, and safety classifiers on the way out—so customer-visible text matches your standards.",
    icon: Type,
  },
  {
    title: "Multimodal",
    body: "Consistent policy behavior across text, image, and audio, including cross-modal steps that can hide intent.",
    icon: ImageIcon,
  },
] as const

export function WhereEnforcesSection() {
  return (
    <section
      id="enforce"
      className="border-b border-aegis/10 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Runtime"
          title="Where Laventra enforces"
          description="Guardrails sit in-line at each hop—so you are not only prompting harder; you are constraining the full agent loop."
        />
        <StaggerGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {surfaces.map((s) => (
            <StaggerItem
              key={s.title}
              className={s.title.startsWith("Multimodal") ? "lg:col-span-3" : ""}
            >
              <div
                className={cn(
                  s.title.startsWith("Multimodal")
                    ? "from-aegis-mist/5 border-aegis/20 flex h-full items-start gap-4 rounded-2xl border bg-gradient-to-b to-white/90 p-5 shadow-sm sm:p-6"
                    : "from-aegis-mist/5 border-aegis/15 h-full rounded-2xl border bg-gradient-to-b to-white/80 p-5 transition-transform duration-300 hover:-translate-y-0.5 sm:p-6"
                )}
              >
                <s.icon
                  className="text-aegis-ink/80 mt-0.5 h-6 w-6 shrink-0"
                  strokeWidth={1.4}
                />
                <div>
                  <h3 className="text-aegis-ink text-base font-semibold">
                    {s.title}
                  </h3>
                  <p className="text-aegis-ink/70 mt-2 text-sm leading-relaxed">
                    {s.body}
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
