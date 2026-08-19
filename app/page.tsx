import { ArrowRight, CheckCircle2 } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { ZeroTouchSection } from "@/components/zero-touch-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { ComparisonSection } from "@/components/comparison-section"
import { IntegrationsSection } from "@/components/integrations-section"
import { CalculatorSection } from "@/components/calculator-section"
import { ScrollReveal } from "@/components/scroll-reveal"

const demoSubject = encodeURIComponent("Запись на демо")
const demoBody = encodeURIComponent("Здравствуйте, покажите, что умеют ваши AI-агенты.")
const demoMailto = `mailto:info@lumitera.ru?subject=${demoSubject}&body=${demoBody}`

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background px-2 pb-6 sm:px-4 lg:px-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <ScrollReveal>
          <HeroSection />
        </ScrollReveal>
        
        <ScrollReveal delay={80}>
          <ZeroTouchSection />
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <HowItWorksSection />
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <ComparisonSection />
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <IntegrationsSection />
        </ScrollReveal>
        <ScrollReveal delay={80}>
          <CalculatorSection />
        </ScrollReveal>

        {/* CTA БЛОК */}
        <ScrollReveal delay={80}>
        <div className="px-4 py-12 md:px-10 lg:px-16">
          <div className="relative rounded-3xl border border-border/70 bg-card/80 p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Готовы протестировать AI-менеджера?
              </h2>
              
              <div className="mt-8 flex justify-center gap-12 lg:gap-16">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-400" />
                  <p className="text-base font-medium text-white whitespace-nowrap">1000 ответов AI бесплатно</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-400" />
                  <p className="text-base font-medium text-white whitespace-nowrap">Никаких обязательств</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-400" />
                  <p className="text-base font-medium text-white whitespace-nowrap">Индивидуальная настройка</p>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href={demoMailto}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-blue-500 bg-blue-500/10 px-8 py-3.5 text-base font-semibold text-blue-400 shadow-lg shadow-blue-500/20 transition hover:bg-blue-500/20"
                >
                  Попробовать бесплатно
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={demoMailto}
                  className="flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-border/70 bg-background/50 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-background/80"
                >
                  Записаться на демо
                </a>
              </div>
              
              <p className="mt-8 text-sm text-muted-foreground">
                Остались вопросы? Напишите нам:{" "}
                <a href="mailto:info@lumitera.ru" className="text-blue-400 hover:underline">
                  info@lumitera.ru
                </a>
              </p>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </main>
  )
}