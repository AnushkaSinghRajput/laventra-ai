"use client"

import { useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { AlertTriangle, CheckCircle2, ShieldBan, Sparkles } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { InteractiveButton } from "@/components/ui/interactive-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionHeader } from "./section-header"
import { ScrollReveal } from "./scroll-reveal"
import { cn } from "@/lib/utils"

type Verdict = "safe" | "risky" | "blocked"

function analyzePrompt(prompt: string) {
  const p = prompt.toLowerCase()
  const blockedTerms = ["ignore previous", "bypass", "export all", "secret key"]
  const riskyTerms = ["customer data", "password", "token", "admin", "confidential"]

  const blockedMatch = blockedTerms.some((t) => p.includes(t))
  const riskyCount = riskyTerms.filter((t) => p.includes(t)).length

  if (blockedMatch) {
    return {
      verdict: "blocked" as Verdict,
      risk: 93,
      decision: "Blocked",
      explanation:
        "This prompt attempts policy override behavior and potential secret exfiltration. Guardrails prevented execution and logged the event for review.",
    }
  }
  if (riskyCount > 0) {
    return {
      verdict: "risky" as Verdict,
      risk: Math.min(74, 38 + riskyCount * 13),
      decision: "Approved with Warning",
      explanation:
        "Potential sensitive intent detected. Response is allowed with redaction and stricter output policy enforcement.",
    }
  }
  return {
    verdict: "safe" as Verdict,
    risk: 12,
    decision: "Approved",
    explanation:
      "Prompt is within policy boundaries. No injection patterns or high-risk data access signals detected.",
  }
}

export function LiveSimulationSection() {
  const [prompt, setPrompt] = useState("Summarize latest user feedback without exposing personal data")
  const [submittedPrompt, setSubmittedPrompt] = useState(prompt)
  const reduceMotion = useReducedMotion()

  const result = useMemo(() => analyzePrompt(submittedPrompt), [submittedPrompt])

  function onSimulate() {
    const text = prompt.trim() || "Generate safe output"
    setSubmittedPrompt(text)
    const outcome = analyzePrompt(text)
    trackEvent("simulation_run", {
      verdict: outcome.verdict,
      risk: outcome.risk,
      promptLength: text.length,
    })
  }

  return (
    <section id="simulation" className="border-b border-aegis/12 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Live AI Simulation"
          title="Test prompts against runtime guardrails"
          description="Try any prompt and instantly view risk score, final decision, and explainable enforcement output."
        />

        <ScrollReveal className="mt-12 grid gap-6 lg:grid-cols-5">
          <div className="glass-card border-aegis/15 rounded-2xl border p-5 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-aegis/80" />
              <p className="text-aegis-ink text-sm font-medium">Prompt Playground</p>
            </div>
            <Label htmlFor="prompt" className="text-aegis-ink/70 text-xs uppercase tracking-wider">
              Enter AI prompt
            </Label>
            <Input
              id="prompt"
              className="mt-2 h-11 border-aegis/20 bg-white"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask model to run any enterprise task..."
            />
            <InteractiveButton
              className="mt-4 h-10 w-full border border-aegis/20 bg-gradient-to-b from-[#c8b6ff] to-[#ece8ff] text-aegis-ink"
              onClick={onSimulate}
            >
              Simulate decision
            </InteractiveButton>
            <p className="text-aegis-ink/45 mt-3 text-xs">
              Mock logic for demo purposes. Production mode uses policy engine + contextual risk classifiers.
            </p>
          </div>

          <div className="glass-card border-aegis/15 rounded-2xl border p-5 lg:col-span-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-aegis/12 bg-white/85 p-4">
                <p className="text-aegis-ink/55 text-xs uppercase tracking-wide">Risk score</p>
                <div className="mt-3 flex items-end gap-2">
                  <motion.p
                    key={result.risk}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-aegis-ink text-3xl font-semibold tabular-nums"
                  >
                    {result.risk}
                  </motion.p>
                  <span className="text-aegis-ink/55 mb-1 text-sm">/100</span>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-aegis-mist/45">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      result.verdict === "blocked"
                        ? "bg-gradient-to-r from-rose-500 to-red-400"
                        : result.verdict === "risky"
                          ? "bg-gradient-to-r from-amber-400 to-orange-400"
                          : "bg-gradient-to-r from-emerald-500 to-green-400"
                    )}
                    initial={reduceMotion ? false : { width: 0 }}
                    animate={{ width: `${result.risk}%` }}
                    transition={reduceMotion ? { duration: 0.1 } : { duration: 0.7, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-aegis/12 bg-white/85 p-4">
                <p className="text-aegis-ink/55 text-xs uppercase tracking-wide">Decision</p>
                <div className="mt-3 flex items-center gap-2">
                  {result.verdict === "blocked" ? (
                    <ShieldBan className="h-5 w-5 text-rose-500" />
                  ) : result.verdict === "risky" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  )}
                  <motion.p key={result.decision} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} className="text-aegis-ink text-lg font-semibold">
                    {result.decision}
                  </motion.p>
                </div>
                <span
                  className={cn(
                    "mt-3 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                    result.verdict === "blocked"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : result.verdict === "risky"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  )}
                >
                  {result.verdict.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-aegis/12 bg-white/85 p-4">
              <p className="text-aegis-ink/55 text-xs uppercase tracking-wide">Explanation</p>
              <motion.p
                key={result.explanation}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-aegis-ink/70 mt-2 text-sm leading-relaxed"
              >
                {result.explanation}
              </motion.p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
