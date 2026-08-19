"use client"

import { useState, useEffect } from "react"
import PricingCards from "@/components/pricing-cards-v2"
import { Info } from "lucide-react"

export default function PricingPage() {
  const [messagePrice, setMessagePrice] = useState("0,55")
  const [currencyRate, setCurrencyRate] = useState("")

  useEffect(() => {
    fetch("/api/currency-rate")
      .then(res => res.json())
      .then(data => {
        if (data.messagePrice) {
          setMessagePrice(data.messagePrice.toString().replace(".", ","))
        }
        if (data.rate) {
          setCurrencyRate(data.rate.toString())
        }
      })
      .catch(() => {})
  }, [])

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
          <p className="text-muted-foreground/70 text-sm mt-2 flex items-center justify-center gap-1.5">
            Трафик: {messagePrice} ₽ за сообщение от агента
            <span className="relative group inline-flex items-center">
              <Info className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                Цена на трафик динамическая и зависит от курса {currencyRate ? `${currencyRate} ₽/$` : "$/₽"}
              </span>
            </span>
          </p>
        </div>
        <PricingCards />
      </div>
    </main>
  )
}
