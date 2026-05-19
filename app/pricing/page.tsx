import PricingCards from "@/components/pricing-cards"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Тарифы
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AI-автоматизация продаж и поддержки для бизнеса любого масштаба
          </p>
          <p className="text-muted-foreground/70 text-sm mt-2">
            Трафик: $0.005 за сообщение от агента
          </p>
        </div>
        <PricingCards />
      </div>
    </main>
  )
}
