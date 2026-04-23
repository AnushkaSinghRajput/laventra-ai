"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InteractiveButton } from "@/components/ui/interactive-button"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/portal"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    trackEvent("auth_login_attempt", { emailDomain: email.split("@")[1] || "unknown" })

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        const msg = data.error || "Unable to sign in"
        setError(msg)
        trackEvent("auth_login_result", { status: "error", reason: msg })
        return
      }

      trackEvent("auth_login_result", { status: "success" })
      router.replace(next)
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
      trackEvent("auth_login_result", { status: "network_error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="grid min-h-dvh lg:grid-cols-2">
        <section className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md rounded-2xl border border-aegis/15 bg-white p-6 shadow-[0_20px_50px_-35px_rgba(111,76,255,0.5)] sm:p-8">
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-aegis/25 bg-aegis-mist/35">
                <Shield className="h-4 w-4 text-aegis-ink" />
              </span>
              <div>
                <p className="text-aegis-ink text-base font-semibold">Laventra AI</p>
                <p className="text-aegis-ink/55 text-xs">Secure Access</p>
              </div>
            </div>

            <h1 className="text-aegis-ink text-3xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-aegis-ink/65 mt-2 text-sm">
              Enter your credentials to access the Laventra secure portal.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email" className="text-aegis-ink/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 h-10 border-aegis/20"
                  placeholder="admin@laventra.ai"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-aegis-ink/80">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 border-aegis/20 pr-10"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-aegis-ink/60 hover:bg-aegis-mist/35"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error ? <p className="text-sm text-rose-600">{error}</p> : null}

              <InteractiveButton
                type="submit"
                disabled={loading}
                className="h-10 w-full border border-aegis/25 bg-gradient-to-b from-[#c8b6ff] to-[#ece8ff] text-aegis-ink"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </InteractiveButton>
            </form>

            <p className="text-aegis-ink/45 mt-4 text-xs">
              Demo credentials: <span className="font-medium">admin@laventra.ai</span> /
              <span className="font-medium"> Laventra@123</span>
            </p>

            <Link href="/" className="text-aegis-ink/65 mt-6 inline-block text-sm hover:text-aegis-ink">
              ← Back to website
            </Link>
          </div>
        </section>

        <section className="from-aegis-mist/45 relative hidden overflow-hidden border-l border-aegis/10 bg-gradient-to-br to-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(167,139,250,0.24),transparent_35%)]" />
          <div className="relative mx-auto flex h-full max-w-xl flex-col justify-center px-10">
            <p className="text-aegis-ink/55 text-xs font-medium tracking-widest uppercase">
              Trusted AI Safety Layer
            </p>
            <h2 className="text-aegis-ink mt-4 text-4xl leading-tight font-semibold">
              Protect every AI interaction with policy-aware access and runtime security.
            </h2>
            <p className="text-aegis-ink/65 mt-4 text-base leading-relaxed">
              Laventra helps teams secure sensitive workflows, monitor model behavior,
              and prove compliance with clear decision trails.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
