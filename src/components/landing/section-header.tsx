import { cn } from "@/lib/utils"
import { ScrollReveal } from "./scroll-reveal"

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  description: string
  className?: string
  align?: "center" | "left"
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <ScrollReveal
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="text-aegis-ink/60 mb-2 text-sm font-medium tracking-widest uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-aegis-ink text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p
        className={cn(
          "text-aegis-ink/65 mt-3 text-base leading-relaxed sm:text-lg",
          align === "center" && "mx-auto"
        )}
      >
        {description}
      </p>
    </ScrollReveal>
  )
}
