"use client"

import { SectionHeader } from "./section-header"
import { StaggerGroup, StaggerItem } from "./scroll-reveal"

const quotes = [
  {
    name: "Jordan Miles",
    role: "Head of Product Security, Northline Systems",
    quote:
      "We went from ad hoc scripts to a single place where policy, review, and telemetry meet. Laventra made our first agent rollout defensible in front of legal and infra.",
  },
  {
    name: "Rina Okonkwo",
    role: "CTO, Quarry Labs (Series B)",
    quote:
      "The scoring layer is the unlock—our on-call is not reading every long trace. We route by risk, ship fixes faster, and sleep a little more.",
  },
  {
    name: "Devin Hale",
    role: "Founding engineer, Siltworks",
    quote:
      "SDK felt boring in the best way. Same config in local dev and prod, and the dashboard makes regression testing on prompts actually tractable.",
  },
] as const

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="border-b border-aegis/10 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Teams"
          title="What operators are saying"
          description="Laventra is in early access with product and security partners who need velocity without giving up defensibility."
        />
        <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <StaggerItem key={q.name}>
              <figure
                className="border-aegis/15 to-aegis-mist/5 flex h-full flex-col justify-between rounded-2xl border
                bg-gradient-to-b from-white/90 p-6
                shadow-sm
                "
              >
                <blockquote className="text-aegis-ink/80 text-sm leading-relaxed">
                  <span className="text-aegis/50 font-serif text-2xl leading-none">
                    &ldquo;
                  </span>
                  {q.quote}
                  <span className="text-aegis/50 font-serif text-2xl leading-none">
                    &rdquo;
                  </span>
                </blockquote>
                <figcaption className="mt-6">
                  <div className="text-aegis-ink flex items-center gap-3 text-sm">
                    <span
                      className="from-aegis/25 to-aegis-mist/30 flex h-9 w-9 items-center justify-center
                      rounded-full border border-aegis/20
                      bg-gradient-to-br
                      text-xs
                      font-semibold
                    "
                    >
                      {q.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <p className="font-medium">{q.name}</p>
                      <p className="text-aegis-ink/50 text-xs">{q.role}</p>
                    </div>
                  </div>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
