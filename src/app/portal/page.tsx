import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ShieldCheck, Activity, FileSearch } from "lucide-react"

import { LogoutButton } from "@/components/auth/logout-button"
import { verifySessionToken } from "@/lib/auth"
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants"

export default async function PortalPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const user = verifySessionToken(token)

  if (!user) {
    redirect("/login?next=/portal")
  }

  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#faf8ff] to-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-aegis/15 bg-white/90 p-5 shadow-sm">
          <div>
            <p className="text-aegis-ink/55 text-xs font-medium tracking-widest uppercase">
              Laventra Secure Portal
            </p>
            <h1 className="text-aegis-ink mt-1 text-2xl font-semibold">
              Welcome, {user.name}
            </h1>
            <p className="text-aegis-ink/65 text-sm">
              Signed in as {user.email}
            </p>
          </div>
          <LogoutButton />
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Policy Status",
              body: "All active guardrails are healthy across connected AI apps.",
              icon: ShieldCheck,
            },
            {
              title: "Live Decisions",
              body: "1,024 monitored decisions in the past hour with zero critical bypasses.",
              icon: Activity,
            },
            {
              title: "Audit Trail",
              body: "Decision logs are ready for compliance export and review.",
              icon: FileSearch,
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-aegis/15 bg-white p-5 shadow-[0_8px_25px_-18px_rgba(111,76,255,0.4)]"
            >
              <card.icon className="text-aegis-ink/75 h-5 w-5" />
              <h2 className="text-aegis-ink mt-3 text-lg font-semibold">{card.title}</h2>
              <p className="text-aegis-ink/65 mt-2 text-sm leading-relaxed">{card.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
