import { DashboardPreviewSection } from "@/components/landing/dashboard-preview-section"
import { DemoFormSection } from "@/components/landing/demo-form-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { FloatingAssistant } from "@/components/landing/floating-assistant"
import { FooterSection } from "@/components/landing/footer-section"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { LiveSimulationSection } from "@/components/landing/live-simulation-section"
import { Navbar } from "@/components/landing/navbar"
import { UseCasesSection } from "@/components/landing/use-cases-section"

export default function Home() {
  return (
    <div className="min-h-dvh bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <LiveSimulationSection />
        <FeaturesSection />
        <HowItWorksSection />
        <DashboardPreviewSection />
        <UseCasesSection />
        <DemoFormSection />
      </main>
      <FooterSection />
      <FloatingAssistant />
    </div>
  )
}
