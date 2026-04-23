"use client"

import { buttonVariants } from "@/components/ui/button"
import { SectionHeader } from "./section-header"
import { ScrollReveal } from "./scroll-reveal"

export function ComplementsWorkflowSection() {
  return (
    <section
      id="complements"
      className="to-aegis-mist/15 border-b border-aegis/10 bg-gradient-to-b from-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Complements your program"
          title="Pair with evaluation and red-team cycles"
          description="Stress-test policies and model updates in lower environments, then lock the same rules in Laventra for production so findings do not live in a slide deck."
        />
        <ScrollReveal className="mt-6">
          <a
            href="#dashboard"
            className={buttonVariants({
              variant: "outline",
              className: "border-aegis/25 h-9 border bg-white/80",
            })}
          >
            See how the console lines up
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
