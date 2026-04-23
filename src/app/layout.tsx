import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google"

import { site } from "@/lib/site-config"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nameWithSuffix} | AI guardrails & agent safety`,
    template: `%s | ${site.nameWithSuffix}`,
  },
  description: site.description,
  keywords: [
    "AI safety",
    "LLM guardrails",
    "AI agents",
    "prompt injection",
    "AI compliance",
    "Laventra",
    "Laventra AI",
  ],
  authors: [{ name: "Laventra AI" }],
  creator: "Laventra AI",
  icons: {
    icon: "/brand/logo-laventra.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.nameWithSuffix,
    title: `${site.nameWithSuffix} | AI guardrails`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nameWithSuffix} | AI guardrails`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-jakarta),ui-sans-serif,system-ui] antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
