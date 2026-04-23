"use client"

import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type InteractiveButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary" | "ghost"
}

type Ripple = {
  id: number
  x: number
  y: number
  size: number
}

export function InteractiveButton({
  className,
  onClick,
  children,
  variant = "default",
  ...props
}: InteractiveButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const reduceMotion = useReducedMotion()

  function spawnRipple(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const size = Math.max(rect.width, rect.height)
    const id = Date.now() + Math.random()
    setRipples((prev) => [...prev, { id, x, y, size }])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 500)
  }

  return (
    <button
      className={cn(
        buttonVariants({ variant }),
        "relative overflow-hidden",
        className
      )}
      onClick={(e) => {
        spawnRipple(e)
        onClick?.(e)
      }}
      {...props}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/60 animate-[ripple_500ms_ease-out]"
          style={{
            left: r.x - r.size / 2,
            top: r.y - r.size / 2,
            width: r.size,
            height: r.size,
          }}
        />
      ))}
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
    </button>
  )
}
