export default function Loading() {
  return (
    <div
      className="from-aegis-surface/40 to-white flex min-h-dvh
      flex-col items-center justify-center bg-gradient-to-b
    "
    >
      <div className="flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full
          border border-aegis/20 bg-aegis/80
        "
        />
        <p className="text-aegis-ink/60 text-sm font-medium">Loading Laventra…</p>
      </div>
      <div
        className="mt-4 h-1.5 w-32 overflow-hidden rounded-full
        border border-aegis/15
        bg-aegis-mist/30
        "
        role="status"
        aria-label="Loading"
      >
        <div
          className="h-full
          w-1/3
          origin-left
          bg-gradient-to-r
          from-aegis/80
          to-aegis-mist/50
          animate-pulse
        "
        />
      </div>
    </div>
  )
}
