"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { CreditCard, Wallet, RefreshCw, MessageSquare, Phone } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

// Pricing
const MESSAGE_PRICE = 0.005 // $0.005 per message
const MINUTE_PRICE = 0.025  // $0.025 per minute

// Initial balances for progress calculation (will be configurable)
const INITIAL_MESSAGES = 50000
const INITIAL_MINUTES = 5000

export default function AccountPage() {
  const { user } = useAuth()
  const [usdRate, setUsdRate] = useState<number>(90)
  const [rateUpdated, setRateUpdated] = useState<string>("")
  const [isLoadingRate, setIsLoadingRate] = useState(true)
  
  const [trafficAmount, setTrafficAmount] = useState(0)
  const [telephonyAmount, setTelephonyAmount] = useState(0)

  useEffect(() => {
    const fetchRate = async () => {
      setIsLoadingRate(true)
      try {
        const response = await fetch("/api/currency-rate")
        const data = await response.json()
        if (data.rate) {
          setUsdRate(data.rate)
          setRateUpdated(data.updated || new Date().toLocaleTimeString("ru-RU"))
        }
      } catch {
        setUsdRate(90)
        setRateUpdated("fallback")
      } finally {
        setIsLoadingRate(false)
      }
    }
    fetchRate()
  }, [])

  // Use data from Google Sheets via auth context
  const balanceMessages = user?.balance_messages || 0
  const balanceMinutes = user?.balance_minutes || 0
  const clientName = user?.name || "Клиент"
  const clientCompany = user?.company || ""
  const tariff = user?.tariff || ""
  const modules = user?.modules || ""

  const tariffPrices: Record<string, string> = {
    "Старт": "$50/мес",
    "Рост": "$150/мес",
    "Система": "$450/мес",
    "AI Support": "$190/мес",
    "Телефония": "оплата по факту",
  }

  // TODO: тариф и стоимость будут браться из API
  const tariffPlan = tariff && tariffPrices[tariff] ? tariff : "Рост"
  const tariffPrice = tariffPrices[tariffPlan]
  const tariffDisplay = `${tariffPlan} — ${tariffPrice}`

  // Calculate used amounts based on remaining balance
  const usedMessages = INITIAL_MESSAGES - Math.round(balanceMessages / MESSAGE_PRICE)
  const usedMinutes = INITIAL_MINUTES - Math.round(balanceMinutes / MINUTE_PRICE)
  
  const trafficRemainingPercent = Math.max(0, (balanceMessages / (INITIAL_MESSAGES * MESSAGE_PRICE)) * 100)
  const telephonyRemainingPercent = Math.max(0, (balanceMinutes / (INITIAL_MINUTES * MINUTE_PRICE)) * 100)

  const trafficCostUsd = trafficAmount * MESSAGE_PRICE
  const telephonyCostUsd = telephonyAmount * MINUTE_PRICE
  const totalUsd = trafficCostUsd + telephonyCostUsd
  const totalRub = totalUsd * usdRate

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Личный кабинет</h1>
              <p className="text-muted-foreground">
                {clientName}{clientCompany && ` · ${clientCompany}`}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-sm px-3 py-1">
                {tariff}
              </Badge>
              {modules && (
                <span className="text-xs text-muted-foreground">
                  {modules}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Подписка и оплата */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Подписка и оплата
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30">
                <div>
                  <p className="font-semibold text-foreground">Тариф {tariffDisplay}</p>
                  <p className="text-sm text-muted-foreground">Следующее списание: 15 июня 2024</p>
                </div>
                <Button variant="outline" className="border-border/50">
                  Изменить тариф
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Баланс и трафик */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Баланс и трафик
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Трафик (сообщения) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Трафик (сообщения)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    остаток <span className="text-foreground font-medium">${balanceMessages.toFixed(2)}</span> · использовано <span className="text-foreground font-medium">{Math.max(0, usedMessages).toLocaleString()}</span> сообщений
                  </span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min(100, trafficRemainingPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{INITIAL_MESSAGES.toLocaleString()} сообщений</span>
                </div>
              </div>

              {/* Телефония (минуты) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-foreground">Телефония (минуты)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    остаток <span className="text-foreground font-medium">${balanceMinutes.toFixed(2)}</span> · использовано <span className="text-foreground font-medium">{Math.max(0, usedMinutes).toLocaleString()}</span> минут
                  </span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, telephonyRemainingPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>{INITIAL_MINUTES.toLocaleString()} минут</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Пополнить баланс */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Пополнить баланс
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Ползунок трафика */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Трафик</span>
                </div>
                <Slider
                  value={[trafficAmount]}
                  onValueChange={(value) => setTrafficAmount(value[0])}
                  max={100000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">0</span>
                  <span className="text-muted-foreground">100 000 сообщений</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-foreground">
                    <span className="font-semibold">{trafficAmount.toLocaleString()}</span> сообщений = <span className="font-semibold">${trafficCostUsd.toFixed(2)}</span> = <span className="font-semibold">{(trafficCostUsd * usdRate).toFixed(0)} ₽</span>
                  </p>
                </div>
              </div>

              {/* Ползунок телефонии */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-foreground">Телефония</span>
                </div>
                <Slider
                  value={[telephonyAmount]}
                  onValueChange={(value) => setTelephonyAmount(value[0])}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">0</span>
                  <span className="text-muted-foreground">10 000 минут</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-foreground">
                    <span className="font-semibold">{telephonyAmount.toLocaleString()}</span> минут = <span className="font-semibold">${telephonyCostUsd.toFixed(2)}</span> = <span className="font-semibold">{(telephonyCostUsd * usdRate).toFixed(0)} ₽</span>
                  </p>
                </div>
              </div>

              {/* Итого */}
              <div className="pt-4 border-t border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-foreground">Итого:</span>
                  <span className="text-xl font-bold text-foreground">
                    ${totalUsd.toFixed(2)} = {totalRub.toFixed(0)} ₽
                  </span>
                </div>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={totalUsd === 0}
                >
                  Оплатить
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Курс USD/RUB */}
          <Card className="bg-card border-border/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Курс USD/RUB:</span>
                  {isLoadingRate ? (
                    <span className="text-sm text-muted-foreground">Загрузка...</span>
                  ) : (
                    <span className="font-medium text-foreground">{usdRate.toFixed(2)} ₽</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {rateUpdated === "fallback" ? "fallback курс" : `обновлено: ${rateUpdated}`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
