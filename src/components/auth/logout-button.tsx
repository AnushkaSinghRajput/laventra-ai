"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { InteractiveButton } from "@/components/ui/interactive-button"

export function LogoutButton() {
  const router = useRouter()

  async function logout() {
    trackEvent("auth_logout", { source: "portal" })
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined)
    router.replace("/login")
    router.refresh()
  }

  return (
    <InteractiveButton
      variant="outline"
      className="h-9 border-aegis/20"
      onClick={logout}
    >
      <LogOut className="h-4 w-4" /> Logout
    </InteractiveButton>
  )
}
