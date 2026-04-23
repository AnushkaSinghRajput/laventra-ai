import Link from "next/link"

import { LaventraLogo } from "@/components/brand/laventra-logo"
import { site, navLinks } from "@/lib/site-config"

function IconX({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
function IconGitHub({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.59.67.5A10.01 10.01 0 0 0 22 12c0-5.523-4.477-10-10-10z"
      />
    </svg>
  )
}
function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const product = [
  { href: "#features", label: "Features" },
  { href: "#dashboard", label: "Console" },
  { href: "#simulation", label: "Simulation" },
  { href: "#demo", label: "Book demo" },
] as const

const company = [
  { href: "/login", label: "Login" },
  { href: "/portal", label: "Portal" },
  { href: "#", label: "Security" },
] as const

const social = [
  { href: "https://x.com", label: "X", icon: IconX },
  { href: "https://github.com", label: "GitHub", icon: IconGitHub },
  { href: "https://linkedin.com", label: "LinkedIn", icon: IconLinkedIn },
] as const

export function FooterSection() {
  return (
    <footer
      className="from-aegis-surface/30 to-aegis-mist/20 border-t border-aegis/10
      bg-gradient-to-b
      "
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <LaventraLogo
              className="mb-3"
              imageClassName="!h-9 w-auto"
            />
            <p className="text-aegis-ink/60 mt-1 text-xs font-medium tracking-widest uppercase">
              {site.tagline}
            </p>
            <p className="text-aegis-ink/60 mt-2 text-sm leading-relaxed">
              Runtime guardrails and monitoring for agents, RAG, and tools in
              production.
            </p>
            <div className="mt-4 flex gap-3">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="border-aegis/15 to-aegis-mist/20 flex h-9 w-9
                  items-center justify-center rounded-lg border
                  bg-gradient-to-b
                  from-white/80
                  text-aegis-ink/60 transition-colors
                  hover:text-aegis-ink
                "
                  aria-label={s.label}
                  rel="noreferrer"
                  target="_blank"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-aegis-ink/40 mb-3 text-xs font-semibold tracking-widest uppercase">
              Product
            </p>
            <ul className="text-aegis-ink/70 space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-aegis-ink transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-aegis-ink/40 mb-3 text-xs font-semibold tracking-widest uppercase">
              Quick links
            </p>
            <ul className="text-aegis-ink/70 space-y-2 text-sm">
              {product.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-aegis-ink transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-aegis-ink/40 mb-3 text-xs font-semibold tracking-widest uppercase">
              Company
            </p>
            <ul className="text-aegis-ink/70 space-y-2 text-sm">
              {company.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-aegis-ink transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="text-aegis-ink/45 mt-12 flex flex-col gap-2 border-t border-aegis/10
          pt-8 text-sm sm:flex-row sm:items-center sm:justify-between
        "
        >
          <p>
            © {new Date().getFullYear()} {site.nameWithSuffix}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              className="hover:text-aegis-ink transition-colors"
              href="#"
            >
              Privacy
            </Link>
            <Link
              className="hover:text-aegis-ink transition-colors"
              href="#"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
