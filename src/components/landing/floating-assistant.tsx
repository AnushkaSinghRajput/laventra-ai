"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Bot, Send, X, Loader2 } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { Input } from "@/components/ui/input"
import { InteractiveButton } from "@/components/ui/interactive-button"

type Msg = { role: "user" | "assistant"; text: string }

function assistantReply(input: string) {
  const q = input.toLowerCase()
  if (q.includes("risk") || q.includes("score")) {
    return "Laventra scores AI interactions using policy confidence, data sensitivity, and behavior context. You can tune thresholds per environment."
  }
  if (q.includes("injection") || q.includes("jailbreak")) {
    return "Prompt injection defenses inspect override patterns, hidden instructions, and tool-steering attempts, then block or sanitize response paths."
  }
  if (q.includes("demo") || q.includes("start")) {
    return "Great choice. Start with the Live AI Simulation section, then connect your first model endpoint in under 10 minutes."
  }
  return "I can help with setup, policy design, and simulation walkthrough. Ask me about risk scoring, prompt injection, or deployment best practices."
}

export function FloatingAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi, I am Laventra Copilot. Ask anything about AI guardrails.",
    },
  ])
  const reduceMotion = useReducedMotion()

  async function sendMessage() {
    const text = input.trim()
    if (!text || typing) return
    setMessages((prev) => [...prev, { role: "user", text }])
    setInput("")
    setTyping(true)
    trackEvent("assistant_message_sent", { length: text.length })

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: assistantReply(text) }])
      setTyping(false)
    }, reduceMotion ? 80 : 900)
  }

  return (
    <>
      <motion.button
        aria-label="Open AI assistant"
        onClick={() => {
          setOpen(true)
          trackEvent("assistant_open", { source: "floating_button" })
        }}
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-2xl border border-aegis/30 bg-gradient-to-b from-[#c8b6ff] to-[#ece8ff] text-aegis-ink shadow-[0_20px_40px_-18px_rgba(111,76,255,0.65)]"
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      >
        <Bot className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={reduceMotion ? { duration: 0.01 } : undefined}
              className="fixed inset-0 z-50 bg-black/25 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              transition={reduceMotion ? { duration: 0.01 } : undefined}
              className="fixed right-5 bottom-24 z-50 w-[min(92vw,380px)] rounded-2xl border border-aegis/20 bg-white/95 p-4 shadow-[0_35px_70px_-30px_rgba(111,76,255,0.5)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-aegis-ink text-sm font-semibold">Laventra Copilot</p>
                  <p className="text-aegis-ink/50 text-xs">Mock GenAI assistant</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 text-aegis-ink/65 hover:bg-aegis-mist/35"
                  aria-label="Close assistant"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[260px] space-y-2 overflow-y-auto rounded-xl border border-aegis/12 bg-[#fcfbff] p-3">
                {messages.map((m, i) => (
                  <div
                    key={`${m.role}-${i}`}
                    className={m.role === "user" ? "text-right" : "text-left"}
                  >
                    <span
                      className={`inline-block max-w-[92%] rounded-2xl px-3 py-2 text-sm ${
                        m.role === "user"
                          ? "bg-gradient-to-b from-[#c8b6ff] to-[#ece8ff] text-aegis-ink"
                          : "border border-aegis/12 bg-white text-aegis-ink/80"
                      }`}
                    >
                      {m.text}
                    </span>
                  </div>
                ))}
                {typing ? (
                  <div className="text-left">
                    <span className="inline-flex items-center gap-1 rounded-2xl border border-aegis/12 bg-white px-3 py-2 text-sm text-aegis-ink/70">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> thinking...
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="mt-3 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about AI safety..."
                  className="h-10 border-aegis/20"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <InteractiveButton
                  className="h-10 border border-aegis/20 bg-gradient-to-b from-[#c8b6ff] to-[#ece8ff] px-3 text-aegis-ink"
                  onClick={sendMessage}
                >
                  <Send className="h-4 w-4" />
                </InteractiveButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
