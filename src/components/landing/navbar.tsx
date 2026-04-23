"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ChevronDown,
  LayoutDashboard,
  Shield,
  Sparkles,
  Menu,
  X,
  LogOut,
} from "lucide-react"

import { LaventraLogo } from "@/components/brand/laventra-logo"
import { trackEvent } from "@/lib/analytics"
import { InteractiveButton } from "@/components/ui/interactive-button"
import { navLinks } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const productMenu = [
  {
    href: "#simulation",
    title: "Live AI Simulation",
    desc: "Test prompts and view policy decisions",
    icon: Sparkles,
  },
  {
    href: "#features",
    title: "Guardrail Features",
    desc: "Injection defense, leakage prevention, policy engine",
    icon: Shield,
  },
  {
    href: "#dashboard",
    title: "Safety Dashboard",
    desc: "Monitor logs, risk trends, and decisions",
    icon: LayoutDashboard,
  },
] as const

type SessionUser = {
  id: string
  email: string
  name: string
  role: "admin" | "member"
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("hero")
  const [progress, setProgress] = useState(0)
  const [productOpen, setProductOpen] = useState(false)
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const reduceMotion = useReducedMotion()

  const sectionIds = useMemo(() => navLinks.map((l) => l.href.replace("#", "")), [])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8)
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id)
        }
      },
      { threshold: [0.2, 0.4, 0.65], rootMargin: "-20% 0px -55% 0px" }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [sectionIds])

  useEffect(() => {
    let cancelled = false
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session")
        const data = (await res.json()) as {
          authenticated?: boolean
          user?: SessionUser
        }
        if (!cancelled && data.authenticated && data.user) {
          setSessionUser(data.user)
        }
      } catch {
        // Keep guest mode.
      }
    }
    void loadSession()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    trackEvent("auth_logout", { source: "navbar" })
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined)
    setSessionUser(null)
    window.location.href = "/login"
  }

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        className="pointer-events-none absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[#a78bfa] via-[#c8b6ff] to-[#ede9fe]"
        animate={{ width: `${progress}%` }}
        transition={reduceMotion ? { duration: 0.01 } : { type: "spring", damping: 24, stiffness: 120 }}
      />

      <div
        className={cn(
          "border-b border-transparent transition-colors duration-300",
          scrolled &&
            "border-aegis/15 bg-white/88 shadow-[0_10px_30px_-14px_rgba(111,76,255,0.28)] backdrop-blur-xl"
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="#hero" className="flex items-center" onClick={() => trackEvent("nav_click", { source: "logo", target: "#hero" })}>
            <LaventraLogo priority imageClassName="!h-8 w-auto sm:!h-9" />
          </Link>

          <nav className="hidden items-center gap-4 text-sm xl:flex">
            <div
              className="relative"
              onMouseEnter={() => {
                setProductOpen(true)
                trackEvent("dropdown_open", { source: "navbar", menu: "product" })
              }}
              onMouseLeave={() => setProductOpen(false)}
            >
              <button
                className={cn(
                  "text-aegis-ink/75 hover:text-aegis-ink inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors",
                  productOpen && "text-aegis-ink"
                )}
              >
                Product <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {productOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={reduceMotion ? { duration: 0.01 } : undefined}
                    className="absolute top-[115%] left-0 w-[320px] rounded-2xl border border-aegis/15 bg-white/95 p-2 shadow-[0_20px_60px_-25px_rgba(111,76,255,0.45)] backdrop-blur"
                  >
                    {productMenu.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="hover:bg-aegis-mist/35 block rounded-xl p-3 transition-colors"
                        onClick={() =>
                          trackEvent("nav_click", {
                            source: "navbar_dropdown",
                            target: item.href,
                          })
                        }
                      >
                        <div className="flex items-start gap-2.5">
                          <item.icon className="mt-0.5 h-4 w-4 text-aegis-ink/70" />
                          <div>
                            <p className="text-aegis-ink text-sm font-medium">{item.title}</p>
                            <p className="text-aegis-ink/55 mt-0.5 text-xs">{item.desc}</p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() =>
                  trackEvent("nav_click", {
                    source: "navbar",
                    target: l.href,
                  })
                }
                className={cn(
                  "group text-aegis-ink/70 hover:text-aegis-ink relative rounded-md px-1.5 py-1 transition-colors",
                  active === l.href.replace("#", "") && "text-aegis-ink"
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-[#a78bfa] to-[#ede9fe] transition-all",
                    active === l.href.replace("#", "") ? "w-full" : "w-0 group-hover:w-full"
                  )}
                />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <InteractiveButton
              variant="ghost"
              className="h-9 text-aegis-ink/80"
              onClick={() => {
                trackEvent("cta_click", { source: "navbar", cta: "live_demo" })
                document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Live Demo
            </InteractiveButton>
            <InteractiveButton
              className="h-9 border border-aegis/25 bg-gradient-to-b from-[#c8b6ff] to-[#ece8ff] text-aegis-ink shadow-[0_12px_30px_-16px_rgba(111,76,255,0.55)]"
              onClick={() => {
                trackEvent("cta_click", { source: "navbar", cta: "get_started" })
                document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Get Started
            </InteractiveButton>
            {sessionUser ? (
              <>
                <a
                  href="/portal"
                  className="text-aegis-ink/75 hover:text-aegis-ink rounded-lg border border-aegis/20 px-3 py-1.5 text-sm transition-colors"
                  onClick={() =>
                    trackEvent("nav_click", { source: "navbar", target: "/portal" })
                  }
                >
                  Portal
                </a>
                <button
                  type="button"
                  className="text-aegis-ink/65 hover:text-aegis-ink inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="h-9 rounded-lg border border-aegis/25 px-3 text-sm text-aegis-ink/80 inline-flex items-center hover:bg-aegis-mist/25 transition-colors"
                onClick={() =>
                  trackEvent("cta_click", { source: "navbar", cta: "login" })
                }
              >
                Login
              </a>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-aegis-ink/80 transition hover:bg-aegis-mist/40 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduceMotion ? { duration: 0.01 } : undefined}
              className="overflow-hidden border-t border-aegis/10 bg-white/95 xl:hidden"
            >
              <div className="flex flex-col gap-0.5 px-4 py-3">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => {
                      setOpen(false)
                      trackEvent("nav_click", { source: "navbar_mobile", target: l.href })
                    }}
                    className={cn(
                      "rounded-lg px-2 py-2.5 text-sm",
                      active === l.href.replace("#", "")
                        ? "bg-aegis-mist/45 text-aegis-ink"
                        : "text-aegis-ink/80"
                    )}
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="/login"
                  onClick={() => {
                    setOpen(false)
                    trackEvent("cta_click", { source: "navbar_mobile", cta: "login" })
                  }}
                  className="text-aegis-ink/80 rounded-lg px-2 py-2.5 text-sm"
                >
                  Login
                </a>
                {sessionUser ? (
                  <a
                    href="/portal"
                    onClick={() => {
                      setOpen(false)
                      trackEvent("nav_click", {
                        source: "navbar_mobile",
                        target: "/portal",
                      })
                    }}
                    className="text-aegis-ink/80 rounded-lg px-2 py-2.5 text-sm"
                  >
                    Portal
                  </a>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
