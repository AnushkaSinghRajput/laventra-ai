import Image from "next/image"
import { cn } from "@/lib/utils"
import { site } from "@/lib/site-config"

type LaventraLogoProps = {
  className?: string
  imageClassName?: string
  priority?: boolean
}

/**
 * Logomark from brand assets: shield + L + sparkles + ring (laser/lavender grade).
 */
export function LaventraLogo({
  className,
  imageClassName,
  priority = false,
}: LaventraLogoProps) {
  return (
    <div
      className={cn(
        "relative rounded-md bg-white px-1.5 py-1",
        className
      )}
    >
      <Image
        src="/brand/logo-laventra.png"
        alt={`${site.nameWithSuffix} logo`}
        width={200}
        height={56}
        className={cn("h-10 w-auto sm:h-11", imageClassName)}
        priority={priority}
      />
    </div>
  )
}

