"use client"

import { useState } from "react"
import { Loader2, Send, CheckCircle2 } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SectionHeader } from "./section-header"
import { ScrollReveal } from "./scroll-reveal"
import { cn } from "@/lib/utils"

export function DemoFormSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle")
  const [message, setMessage] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      email: String(fd.get("email") || "").trim(),
      name: String(fd.get("name") || "").trim(),
      company: String(fd.get("company") || "").trim(),
      note: String(fd.get("note") || "").trim(),
    }

    trackEvent("form_submit", {
      form: "demo_request",
      hasCompany: Boolean(payload.company),
      hasNote: Boolean(payload.note),
    })

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        reference?: string
      }
      if (!res.ok) {
        setStatus("err")
        setMessage(data.error || "Could not send. Try again.")
        trackEvent("form_submit_result", { form: "demo_request", status: "error" })
        return
      }
      setStatus("ok")
      setMessage(
        data.reference
          ? `Request received. Reference: ${data.reference}`
          : "Thanks—we will be in touch shortly."
      )
      trackEvent("form_submit_result", {
        form: "demo_request",
        status: "success",
      })
      form.reset()
    } catch {
      setStatus("err")
      setMessage("Network error. Check your connection and try again.")
      trackEvent("form_submit_result", { form: "demo_request", status: "network_error" })
    }
  }

  return (
    <section
      id="demo"
      className="from-aegis-mist/30 border-b border-aegis/10 bg-gradient-to-b to-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div
          className="from-aegis-mist/20 border-aegis/12 mx-auto mb-12 max-w-2xl rounded-2xl border
          bg-gradient-to-b
          to-white/90
          p-6
          text-center
          shadow-sm
          sm:p-8
          "
        >
          <h2 className="text-aegis-ink text-2xl font-semibold tracking-tight sm:text-3xl">
            Ship agents with controls you can show your security team.
          </h2>
          <p className="text-aegis-ink/65 mt-2 text-sm sm:text-base">
            Start a sandbox, or go straight to a product conversation—we will
            keep it concrete.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href="#hero"
              className={buttonVariants({
                className:
                  "from-aegis/90 to-aegis-mist/30 h-9 border border-aegis/20 bg-gradient-to-b",
              })}
              onClick={() => trackEvent("cta_click", { source: "demo_banner", cta: "get_started" })}
            >
              Get started
            </a>
            <a
              href="mailto:hello@laventra.ai"
              className={buttonVariants({
                variant: "outline",
                className: cn("border-aegis/25 h-9"),
              })}
              onClick={() => trackEvent("cta_click", { source: "demo_banner", cta: "contact_sales" })}
            >
              Contact sales
            </a>
          </div>
        </div>
        <SectionHeader
          eyebrow="Get access"
          title="Book time with Laventra"
          description="Tell us how you run models and tools today. We will follow up with a focused walkthrough on your stack—not a generic deck."
        />
        <ScrollReveal className="mx-auto mt-12 max-w-xl" delay={0.08}>
          <form
            onSubmit={onSubmit}
            className="border-aegis/15 to-aegis-mist/5 relative overflow-hidden rounded-2xl border
            from-white/90
            bg-gradient-to-b p-6
            shadow-[0_20px_50px_-28px_rgba(80,50,200,0.2)]
            backdrop-blur
            sm:p-8
            "
          >
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full
              bg-aegis/20 blur-3xl
            "
            />
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="text-aegis-ink/80"
                >
                  Work email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="mt-1.5 h-10 border-aegis/20"
                  placeholder="you@company.com"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-aegis-ink/80"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    className="mt-1.5 h-10 border-aegis/20"
                    placeholder="Avery Chen"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="company"
                    className="text-aegis-ink/80"
                  >
                    Company
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    className="mt-1.5 h-10 border-aegis/20"
                    placeholder="Acme AI"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="note"
                  className="text-aegis-ink/80"
                >
                  Context (optional)
                </Label>
                <Textarea
                  id="note"
                  name="note"
                  rows={3}
                  className="border-aegis/20 mt-1.5 min-h-[88px]"
                  placeholder="e.g. Anthropic in prod, internal RAG, SOC2 in flight…"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                disabled={status === "loading"}
                className="from-aegis/90 to-aegis-mist/30 text-aegis-ink hover:to-aegis/20 h-10
                min-w-[160px] border
                border-aegis/20 bg-gradient-to-b shadow-sm
                "
              >
                {status === "loading" ? (
                  <Loader2 className="text-aegis-ink h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send request
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </Button>
              {status === "ok" ? (
                <p
                  className="text-aegis-ink/80 flex items-center gap-2 text-sm
                  data-[ok=true]:text-aegis-ink/90
                "
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {message}
                </p>
              ) : status === "err" ? (
                <p className="text-sm text-red-600">{message}</p>
              ) : null}
            </div>
            <p className="text-aegis-ink/45 mt-4 text-xs">
              By submitting, you agree to be contacted about Laventra AI. We
              will not sell your data. Demo requests are for evaluation only.
            </p>
          </form>
        </ScrollReveal>
      </div>
    </section>
  )
}
