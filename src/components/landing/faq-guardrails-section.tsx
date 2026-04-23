"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeader } from "./section-header"

const faq = [
  {
    id: "agentic",
    q: "Do you cover agentic failures beyond prompt injection?",
    a: "Yes. We think about tool misuse, goal hijack, runaway loops, and chains that cross RAG, tools, and long-lived memory. Policies can act at each step, not only on the last token.",
  },
  {
    id: "mcp",
    q: "How do you think about third-party tool and registry risk?",
    a: "You can require approved registries, block categories of tools or arguments, and enforce in-line on connector calls so a model cannot quietly widen scope at runtime.",
  },
  {
    id: "identity",
    q: "Is enforcement identity-aware?",
    a: "When you pass role, tenant, or entitlements, rules can differ by user and environment—so the same model stack can meet different bars for staff vs. customers vs. partners.",
  },
  {
    id: "poisoning",
    q: "What about retrieval and memory abuse?",
    a: "We support constraints and escalation on unusual sources, high-risk chunk patterns, and long-horizon memory that does not match policy—without turning every request into a manual review.",
  },
  {
    id: "multimodal",
    q: "Is multimodality in scope on day one?",
    a: "Policies can apply to text, image, and audio with shared categories where it makes sense, and separate controls where modalities differ (for example, smuggled instructions in files).",
  },
  {
    id: "audit",
    q: "What does audit-ready mean in Laventra?",
    a: "You can carry policy and decision identifiers in logs, export in formats your SIEM and GRC tools already accept, and keep a trail that is explainable without exposing full prompts where you should not.",
  },
] as const

export function FaqGuardrailsSection() {
  return (
    <section
      id="faq"
      className="border-b border-aegis/10 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="High-level answers for technical and GRC readers. We are happy to go deeper on a short architecture call."
        />
        <Accordion
          className="mt-10 w-full"
          multiple
          defaultValue={["agentic", "mcp", "identity"]}
        >
          {faq.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-aegis/12 border-b"
            >
              <AccordionTrigger className="text-aegis-ink py-3 text-left text-sm font-medium hover:no-underline sm:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-aegis-ink/70 text-sm leading-relaxed">
                  {item.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
