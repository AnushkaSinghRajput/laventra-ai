"use client"

import { useEffect, useMemo, useState } from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react"

import { InteractiveButton } from "@/components/ui/interactive-button"
import { trackEvent } from "@/lib/analytics"
import { site } from "@/lib/site-config"

const rotatingWords = [
  "monitoring model behavior",
  "blocking prompt injection",
  "preventing data leakage",
  "explaining AI decisions",
] as const

export function HeroSection() {
  const [idx, setIdx] = useState(0)
  const [typed, setTyped] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const reduceMotion = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 130, damping: 18 })
  const sy = useSpring(my, { stiffness: 130, damping: 18 })
  const tx = useTransform(sx, [-1, 1], [-16, 16])
  const ty = useTransform(sy, [-1, 1], [-12, 12])

  const currentWord = rotatingWords[idx]

  useEffect(() => {
    if (reduceMotion) {
      setTyped(rotatingWords[0])
      return
    }
    const base = deleting ? 45 : 80
    const timer = window.setTimeout(() => {
      if (!deleting && typed.length < currentWord.length) {
        setTyped(currentWord.slice(0, typed.length + 1))
      } else if (!deleting && typed.length === currentWord.length) {
        window.setTimeout(() => setDeleting(true), 900)
      } else if (deleting && typed.length > 0) {
        setTyped(currentWord.slice(0, typed.length - 1))
      } else {
        setDeleting(false)
        setIdx((prev) => (prev + 1) % rotatingWords.length)
      }
    }, base)

    return () => window.clearTimeout(timer)
  }, [typed, deleting, currentWord, reduceMotion])

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: `${(i * 17) % 100}%`,
        y: `${(i * 29) % 100}%`,
        d: 6 + (i % 5),
      })),
    []
  )

  return (
    <section
      id="hero"
      onMouseMove={(e) => {
        if (reduceMotion) return
        const bounds = e.currentTarget.getBoundingClientRect()
        const rx = (e.clientX - bounds.left) / bounds.width
        const ry = (e.clientY - bounds.top) / bounds.height
        mx.set((rx - 0.5) * 2)
        my.set((ry - 0.5) * 2)
      }}
      className="relative overflow-hidden border-b border-aegis/15"
    >
      <HeroBackground particles={particles} reducedMotion={Boolean(reduceMotion)} />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pt-20 pb-16 sm:px-6 sm:pt-24 lg:flex-row lg:items-center lg:gap-14 lg:pt-28 lg:pb-20">
        <div className="max-w-2xl flex-1">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-aegis-ink/55 mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {site.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-aegis-ink text-4xl leading-tight font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            Control, Monitor &amp; Secure AI Systems in Real Time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="text-aegis-ink/70 mt-6 text-lg leading-relaxed sm:text-xl"
          >
            Laventra AI keeps enterprise AI interactions safe through runtime
            guardrails, intelligent risk analysis, and explainable policy
            decisions across every workflow.
          </motion.p>

          <p className="text-aegis-ink/70 mt-4 text-sm sm:text-base">
            Live status: <span className="font-semibold text-aegis-ink">{typed}</span>
            <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-aegis/70 align-middle" />
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <InteractiveButton
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="h-11 border border-aegis/25 bg-gradient-to-b from-[#c8b6ff] to-[#e8e2ff] px-5 text-[#111827] shadow-[0_12px_35px_-12px_rgba(120,90,220,0.6)] transition-all hover:scale-[1.02]"
              onClick={() => {
                trackEvent("cta_click", {
                  source: "hero",
                  cta: "get_started",
                })
                document.getElementById("simulation")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </InteractiveButton>
            <InteractiveButton
              variant="outline"
              className="h-11 border-aegis/25 bg-white/70 px-5 text-aegis-ink backdrop-blur hover:scale-[1.02]"
              onClick={() => {
                trackEvent("cta_click", {
                  source: "hero",
                  cta: "live_demo",
                })
                document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <PlayCircle className="h-4 w-4" /> Live Demo
            </InteractiveButton>
          </motion.div>
        </div>

        <motion.div
          style={reduceMotion ? undefined : { x: tx, y: ty }}
          className="relative w-full max-w-md flex-1"
          animate={reduceMotion ? { scale: 1 } : { scale: isHovering ? 1.01 : 1 }}
        >
          <div className="glass-card border-aegis/30 relative overflow-hidden rounded-3xl border p-6 shadow-[0_30px_80px_-28px_rgba(111,76,255,0.38)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(167,139,250,0.24),transparent_35%)]" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-aegis-ink/60 text-xs font-medium tracking-widest uppercase">
                  AI Safety Pulse
                </p>
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                  Online
                </span>
              </div>
              <div className="rounded-2xl border border-aegis/15 bg-white/75 p-4">
                <p className="text-aegis-ink/60 text-xs">Guardrail decisions / sec</p>
                <p className="text-aegis-ink mt-1 text-3xl font-semibold tabular-nums">1,284</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-aegis-mist/35">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] to-[#c8b6ff]"
                    initial={reduceMotion ? false : { width: "35%" }}
                    animate={reduceMotion ? { width: "68%" } : { width: ["35%", "68%", "54%", "74%"] }}
                    transition={
                      reduceMotion
                        ? { duration: 0.2 }
                        : { repeat: Infinity, duration: 5.2, ease: "easeInOut" }
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Prompt attacks blocked", "98.7%"],
                  ["Data leakage prevented", "99.2%"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-aegis/15 bg-white/70 p-3">
                    <p className="text-aegis-ink/55 text-xs">{k}</p>
                    <p className="text-aegis-ink mt-1 text-lg font-semibold">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function HeroBackground({
  particles,
  reducedMotion,
}: {
  particles: Array<{ id: number; x: string; y: string; d: number }>
  reducedMotion: boolean
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(120deg,rgba(237,233,254,0.55),rgba(255,255,255,0.95),rgba(224,216,255,0.45))]"
        animate={
          reducedMotion
            ? { backgroundPosition: "0% 0%" }
            : { backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }
        }
        transition={reducedMotion ? { duration: 0.1 } : { duration: 18, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute -top-28 right-[-8%] h-[420px] w-[420px] rounded-full bg-[#c8b6ff]/35 blur-3xl"
        animate={reducedMotion ? { scale: 1, opacity: 0.52 } : { scale: [1, 1.16, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={reducedMotion ? { duration: 0.1 } : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-120px] left-[-6%] h-[320px] w-[320px] rounded-full bg-[#a78bfa]/30 blur-3xl"
        animate={reducedMotion ? { scale: 1, opacity: 0.42 } : { scale: [1.08, 1, 1.08], opacity: [0.55, 0.35, 0.55] }}
        transition={reducedMotion ? { duration: 0.1 } : { duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      {!reducedMotion
        ? particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#a78bfa]/65"
              style={{ left: p.x, top: p.y }}
              animate={{ y: [0, -12, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut" }}
            />
          ))
        : null}
    </div>
  )
}
