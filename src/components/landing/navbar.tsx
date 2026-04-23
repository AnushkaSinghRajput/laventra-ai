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
  const [mobileProductOpen, setMobileProductOpen] = useState(false)
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

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) setMobileProductOpen(false)
  }, [open])

  async function handleLogout() {
    trackEvent("auth_logout", { source: "navbar" })
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined)
    setSessionUser(null)
    window.location.href = "/login"
  }

  const ariaProductExpanded: "true" | "false" = productOpen ? "true" : "false"
  const ariaMobileMenuExpanded: "true" | "false" = open ? "true" : "false"
  const ariaMobileProductExpanded: "true" | "false" = mobileProductOpen ? "true" : "false"

  return (
    <header className="sticky top-0 z-50 w-full [backface-visibility:hidden]">
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-10 h-[2px] bg-gradient-to-r from-[#a78bfa] via-[#c8b6ff] to-[#ede9fe]"
        animate={{ width: `${progress}%` }}
        transition={reduceMotion ? { duration: 0.01 } : { type: "spring", damping: 24, stiffness: 120 }}
        aria-hidden
      />

      <div
        className={cn(
          "border-b border-aegis/10 bg-white/90 backdrop-blur-xl transition-[box-shadow,background-color,border-color] duration-300 supports-[backdrop-filter]:bg-white/75 [-webkit-backdrop-filter:blur(12px)]",
          scrolled &&
            "border-aegis/15 bg-white/95 shadow-[0_8px_32px_-12px_rgba(111,76,255,0.22),0_1px_0_rgba(255,255,255,0.8)_inset]"
        )}
      >
        <div className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:min-h-16 sm:px-6 sm:py-0 lg:px-8">
          <Link
            href="#hero"
            className="flex min-h-11 min-w-0 flex-shrink-0 items-center -ml-1.5 p-1.5 sm:ml-0"
            onClick={() => trackEvent("nav_click", { source: "logo", target: "#hero" })}
          >
            <LaventraLogo priority imageClassName="!h-8 w-auto sm:!h-9" />
          </Link>

          <nav
            className="hidden min-w-0 items-center gap-1 text-[0.9375rem] font-medium text-aegis-ink/75 xl:flex"
            aria-label="Primary"
          >
            <div
              className="relative"
              onMouseEnter={() => {
                setProductOpen(true)
                trackEvent("dropdown_open", { source: "navbar", menu: "product" })
              }}
              onMouseLeave={() => setProductOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  "text-aegis-ink/80 hover:text-aegis-ink inline-flex min-h-10 min-w-10 items-center gap-1 rounded-lg px-3.5 py-2 transition-colors",
                  productOpen && "text-aegis-ink bg-aegis-mist/20"
                )}
                aria-haspopup="true"
                aria-expanded={ariaProductExpanded}
              >
                Product <ChevronDown className="h-4 w-4 shrink-0 opacity-80" />
              </button>
              <AnimatePresence>
                {productOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={reduceMotion ? { duration: 0.01 } : undefined}
                    className="absolute top-[calc(100%+6px)] left-0 w-[min(20rem,92vw)] rounded-2xl border border-aegis/12 bg-white/98 p-2 shadow-[0_20px_60px_-25px_rgba(111,76,255,0.45)] backdrop-blur-md"
                  >
                    {productMenu.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="hover:bg-aegis-mist/40 block rounded-xl p-3 transition-colors"
                        onClick={() =>
                          trackEvent("nav_click", {
                            source: "navbar_dropdown",
                            target: item.href,
                          })
                        }
                      >
                        <div className="flex items-start gap-3">
                          <item.icon className="text-aegis-ink/70 mt-0.5 h-4 w-4 shrink-0" />
                          <div>
                            <p className="text-aegis-ink text-sm font-semibold">{item.title}</p>
                            <p className="text-aegis-ink/55 mt-0.5 text-xs leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="ml-1 flex items-center gap-0.5 lg:gap-1 pl-1 lg:pl-2">
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
                    "group text-aegis-ink/80 hover:text-aegis-ink relative inline-flex min-h-10 items-center rounded-lg px-2.5 py-2 transition-colors sm:px-3",
                    active === l.href.replace("#", "") && "text-aegis-ink"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "from-aegis/45 to-aegis-mist/50 absolute -bottom-px left-2.5 right-2.5 h-0.5 rounded-full bg-gradient-to-r transition-all duration-200 sm:left-3 sm:right-3",
                      active === l.href.replace("#", "")
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                    )}
                  />
                </a>
              ))}
            </div>
          </nav>

          <div className="hidden flex-shrink-0 items-center gap-2.5 pl-1 sm:flex">
            <InteractiveButton
              variant="ghost"
              className="h-10 min-w-[5.5rem] border border-aegis/0 px-3.5 text-aegis-ink/85 transition-colors hover:border-aegis/15 hover:bg-aegis-mist/30"
              onClick={() => {
                trackEvent("cta_click", { source: "navbar", cta: "live_demo" })
                document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Live demo
            </InteractiveButton>
            <InteractiveButton
              className="h-10 min-w-[7.5rem] border border-aegis/20 bg-gradient-to-b from-[#d4c5ff] to-[#c8b6ff] px-4 font-semibold text-aegis-ink shadow-[0_2px_0_0_rgba(255,255,255,0.55)_inset,0_8px_24px_-8px_rgba(111,76,255,0.45)] hover:from-[#dccfff] hover:to-[#d0bbff] hover:shadow-[0_2px_0_0_rgba(255,255,255,0.6)_inset,0_10px_28px_-6px_rgba(111,76,255,0.5)]"
              onClick={() => {
                trackEvent("cta_click", { source: "navbar", cta: "get_started" })
                document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Get started
            </InteractiveButton>
            {sessionUser ? (
              <div className="ml-1.5 flex items-center gap-1.5 border-l border-aegis/10 pl-3.5">
                <a
                  href="/portal"
                  className="text-aegis-ink/80 hover:text-aegis-ink hover:border-aegis/20 hover:bg-aegis-mist/20 inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-aegis/12 px-3.5 text-sm font-medium transition-colors"
                  onClick={() =>
                    trackEvent("nav_click", { source: "navbar", target: "/portal" })
                  }
                >
                  Portal
                </a>
                <button
                  type="button"
                  className="text-aegis-ink/70 hover:text-aegis-ink inline-flex h-10 min-w-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium transition-colors hover:bg-aegis-mist/30"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <a
                href="/login"
                className="text-aegis-ink/85 hover:text-aegis-ink border-aegis/18 hover:border-aegis/30 hover:bg-aegis-mist/20 ml-1.5 inline-flex h-10 min-w-[4.5rem] items-center justify-center rounded-lg border border-dashed bg-white/50 px-3.5 text-sm font-semibold transition-colors"
                onClick={() => trackEvent("cta_click", { source: "navbar", cta: "login" })}
              >
                Log in
              </a>
            )}
          </div>

          <button
            type="button"
            className="text-aegis-ink/80 hover:text-aegis-ink inline-flex h-11 min-w-11 flex-shrink-0 items-center justify-center rounded-xl border border-transparent transition-colors hover:bg-aegis-mist/45 active:bg-aegis-mist/55 sm:h-10 sm:min-w-10 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={ariaMobileMenuExpanded}
            aria-controls="mobile-nav-panel"
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav-panel"
              initial={reduceMotion ? false : { height: 0, opacity: 0.98 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduceMotion ? { height: 0, opacity: 0, transition: { duration: 0.01 } } : { height: 0, opacity: 0 }}
              transition={reduceMotion ? { duration: 0.01 } : { duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="max-h-[min(85dvh,640px)] overflow-y-auto border-t border-aegis/10 bg-white/98 backdrop-blur-md xl:hidden"
            >
              <div className="mx-auto w-full max-w-6xl space-y-1 px-4 py-4 sm:px-6">
                <p className="text-aegis-ink/50 px-1 pb-1 text-[0.7rem] font-semibold tracking-wide uppercase">
                  Navigate
                </p>
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => {
                      setOpen(false)
                      trackEvent("nav_click", { source: "navbar_mobile", target: l.href })
                    }}
                    className={cn(
                      "min-h-12 items-center rounded-xl px-3.5 text-[0.9375rem] font-medium",
                      "flex w-full",
                      active === l.href.replace("#", "")
                        ? "bg-aegis-mist/50 text-aegis-ink"
                        : "text-aegis-ink/80 active:bg-aegis-mist/35"
                    )}
                  >
                    {l.label}
                  </a>
                ))}

                <div className="border-aegis/10 my-2 border-t pt-3">
                  <button
                    type="button"
                    className="text-aegis-ink/80 hover:text-aegis-ink flex min-h-12 w-full items-center justify-between rounded-xl px-3.5 text-left text-[0.9375rem] font-medium transition-colors hover:bg-aegis-mist/30"
                    onClick={() => {
                      setMobileProductOpen((v) => !v)
                      trackEvent("dropdown_open", {
                        source: "navbar_mobile",
                        menu: "product",
                      })
                    }}
                    aria-expanded={ariaMobileProductExpanded}
                  >
                    <span>Product</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        mobileProductOpen && "-rotate-180"
                      )}
                    />
                  </button>
                  {mobileProductOpen ? (
                    <ul className="mt-1 space-y-0.5 pb-1 pl-1" role="list">
                      {productMenu.map((item) => (
                        <li key={item.title}>
                          <a
                            href={item.href}
                            onClick={() => {
                              setOpen(false)
                              trackEvent("nav_click", {
                                source: "navbar_mobile_product",
                                target: item.href,
                              })
                            }}
                            className="hover:bg-aegis-mist/35 flex min-h-[3.25rem] items-start gap-3 rounded-xl px-3 py-2.5"
                          >
                            <item.icon
                              className="text-aegis-ink/65 mt-0.5 h-4 w-4 shrink-0"
                              aria-hidden
                            />
                            <div>
                              <p className="text-aegis-ink text-sm font-semibold">
                                {item.title}
                              </p>
                              <p className="text-aegis-ink/50 mt-0.5 text-xs leading-snug">
                                {item.desc}
                              </p>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="border-aegis/10 space-y-2.5 border-t pt-4">
                  <p className="text-aegis-ink/50 px-1 text-[0.7rem] font-semibold tracking-wide uppercase">
                    Actions
                  </p>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        trackEvent("cta_click", { source: "navbar_mobile", cta: "live_demo" })
                        document
                          .getElementById("dashboard")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="text-aegis-ink/90 border-aegis/20 hover:border-aegis/30 hover:bg-aegis-mist/30 flex min-h-12 w-full items-center justify-center rounded-xl border bg-white/80 px-4 text-sm font-semibold transition-colors"
                    >
                      Live demo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        trackEvent("cta_click", { source: "navbar_mobile", cta: "get_started" })
                        document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="from-[#d4c5ff] to-[#c8b6ff] hover:from-[#ddcdff] hover:to-[#cfbdff] flex min-h-12 w-full items-center justify-center rounded-xl border border-aegis/25 bg-gradient-to-b text-sm font-semibold text-aegis-ink shadow-[0_1px_0_0_rgba(255,255,255,0.55)_inset,0_8px_22px_-10px_rgba(111,76,255,0.4)]"
                    >
                      Get started
                    </button>
                  </div>
                  {sessionUser ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      <a
                        href="/portal"
                        onClick={() => {
                          setOpen(false)
                          trackEvent("nav_click", {
                            source: "navbar_mobile",
                            target: "/portal",
                          })
                        }}
                        className="text-aegis-ink/90 border-aegis/18 hover:border-aegis/25 hover:bg-aegis-mist/25 flex min-h-12 items-center justify-center rounded-xl border bg-white/90 px-3 text-sm font-semibold"
                      >
                        Portal
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false)
                          void handleLogout()
                        }}
                        className="text-aegis-ink/80 hover:text-aegis-ink hover:bg-aegis-mist/30 flex min-h-12 items-center justify-center gap-2 rounded-xl border border-transparent text-sm font-semibold"
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </button>
                    </div>
                  ) : (
                    <a
                      href="/login"
                      onClick={() => {
                        setOpen(false)
                        trackEvent("cta_click", { source: "navbar_mobile", cta: "login" })
                      }}
                      className="text-aegis-ink/90 border-aegis/20 hover:border-aegis/30 hover:bg-aegis-mist/20 flex min-h-12 w-full items-center justify-center rounded-xl border border-dashed bg-white/70 px-4 text-sm font-bold"
                    >
                      Log in
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
