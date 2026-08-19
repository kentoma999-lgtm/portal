"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { CreditCard, Wallet, RefreshCw, MessageSquare, Phone, Info } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const MINUTE_PRICE = 2.5

export default function AccountPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [messagePrice, setMessagePrice] = useState(0.55)
  const [trafficAmount, setTrafficAmount] = useState(2000)
  const [telephonyAmount, setTelephonyAmount] = useState(0)
  const [balanceMessages, setBalanceMessages] = useState<number>(user?.balance_messages || 0)
  const [balanceMinutes, setBalanceMinutes] = useState<number>(user?.balance_minutes || 0)
  const [totalMessages, setTotalMessages] = useState<number>(user?.total_messages || 0)
  const [totalMinutes, setTotalMinutes] = useState<number>(user?.total_minutes || 0)
  const [isPaying, setIsPaying] = useState(false)

  // Проверка платежа при возврате из ЮKassa
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentId = params.get('paymentId')
    if (paymentId && user?.key) {
      fetch('/api/payment/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'succeeded') {
          window.history.replaceState({}, '', '/account')
          // Обновить данные из /api/portal
          fetch('/api/portal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: user.key })
          })
          .then(res => res.json())
          .then(portalData => {
            localStorage.setItem('clientData', JSON.stringify(portalData))
            window.location.reload()
          })
        }
      })
      .catch(() => {})
    }
  }, [user?.key])

  useEffect(() => {
    fetch("/api/currency-rate")
      .then(res => res.json())
      .then(data => {
        if (data) {
          const tariffLower = (user?.tariff || "").toLowerCase()
          if (tariffLower === "старт" || tariffLower === "start") {
            setMessagePrice(data.messagePriceStart || data.messagePrice)
          } else if (tariffLower === "рост" || tariffLower === "growth") {
            setMessagePrice(data.messagePriceGrowth || data.messagePrice)
          } else {
            setMessagePrice(data.messagePriceSystem || data.messagePrice)
          }
        }
      })
      .catch(() => {})
  }, [user?.tariff])

  useEffect(() => {
    if (!user?.key) return

    const fetchPortalBalance = async () => {
      try {
        const response = await fetch("/api/portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: user.key }),
        })
        if (!response.ok) throw new Error("Portal API request failed")
        const data = await response.json()
        if (typeof data.balance_messages === "number") setBalanceMessages(data.balance_messages)
        if (typeof data.balance_minutes === "number") setBalanceMinutes(data.balance_minutes)
        if (typeof data.total_messages === "number") setTotalMessages(data.total_messages)
        if (typeof data.total_minutes === "number") setTotalMinutes(data.total_minutes)
      } catch (error) {
        console.error("Failed to load portal balance", error)
      }
    }

    fetchPortalBalance()
  }, [user?.key])

  const clientName = user?.name || "Клиент"
  const clientCompany = user?.company || ""
  const tariff = user?.tariff || ""
  const modules = user?.modules || ""

  useEffect(() => {
    if (tariff === "Старт") {
      setTrafficAmount(4000)
    }
  }, [tariff])

  const tariffPrices: Record<string, string> = {
    "Старт": "5 000 ₽/мес",
    "Рост": "10 000 ₽/мес",
    "Система": "20 000 ₽/мес",
    "AI Support": "19 000 ₽/мес",
    "Телефония": "оплата по факту",
  }

  const tariffPlan = tariff && tariffPrices[tariff] ? tariff : "Рост"
  const tariffPrice = tariffPrices[tariffPlan]
  const tariffDisplay = `${tariffPlan} — ${tariffPrice}`

  const formatExpiryDate = (dateStr: string): string => {
    if (!dateStr) return "Не указано"
    try {
      const parts = dateStr.split('.')
      if (parts.length === 3) {
        const date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
        }
      }
      const date = new Date(dateStr)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
      }
      return "Не указано"
    } catch {
      return "Не указано"
    }
  }

  const subscriptionExpiryDate = formatExpiryDate(
    (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('clientData') || '{}'))?.subscription_expires_at || 
    user?.subscription_expires_at || ""
  )

  const usedMessages = Math.max(0, totalMessages - balanceMessages)
  const usedMinutes = Math.max(0, totalMinutes - balanceMinutes)

  const trafficRemainingPercent = totalMessages > 0 ? Math.max(0, (balanceMessages / totalMessages) * 100) : 0
  const telephonyRemainingPercent = totalMinutes > 0 ? Math.max(0, (balanceMinutes / totalMinutes) * 100) : 0

  const trafficCostRub = trafficAmount * messagePrice
  const telephonyCostRub = telephonyAmount * MINUTE_PRICE
  const totalRub = trafficCostRub + telephonyCostRub

  const handlePaySubscription = async () => {
    setIsPaying(true)
    try {
      const amount = parseInt(tariffPrice.replace(/[^0-9]/g, ''))
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, key: user?.key, type: 'subscription' })
      })
      const data = await response.json()
      if (data.confirmation?.confirmation_url) {
        window.location.href = data.confirmation.confirmation_url
      } else {
        alert('Ошибка при создании платежа')
      }
    } catch (error) {
      alert('Ошибка при создании платежа')
    } finally {
      setIsPaying(false)
    }
  }

  const handlePayTraffic = async () => {
    setIsPaying(true)
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalRub, key: user?.key, type: 'traffic' })
      })
      const data = await response.json()
      if (data.confirmation?.confirmation_url) {
        window.location.href = data.confirmation.confirmation_url
      } else {
        alert('Ошибка при создании платежа')
      }
    } catch (error) {
      alert('Ошибка при создании платежа')
    } finally {
      setIsPaying(false)
    }
  }

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
                <span className="text-xs text-muted-foreground">{modules}</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
                  <p className="text-sm text-muted-foreground">Следующее списание: {subscriptionExpiryDate}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Button 
                    variant="default"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handlePaySubscription}
                    disabled={isPaying}
                  >
                    {isPaying ? "Загрузка..." : `Оплатить ${tariffPrice}`}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-border/50 hover:bg-[rgba(59,130,246,0.15)] hover:text-[#60a5fa]"
                    onClick={() => router.push("/pricing")}
                  >
                    Изменить тариф
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Баланс и трафик
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Трафик (сообщения)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    остаток <span className="text-foreground font-medium">{balanceMessages.toFixed(0)} сообщений</span> · использовано <span className="text-foreground font-medium">{Math.max(0, usedMessages).toLocaleString()}</span> сообщений
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
                  <span>{totalMessages.toLocaleString()} сообщений</span>
                </div>
              </div>

              <div className="space-y-3 opacity-50 pointer-events-none relative">
                <div className="absolute -top-2 right-0 z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-black px-1.5 py-0.5 rounded-full">
                    Скоро
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-foreground">Телефония (минуты)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    остаток <span className="text-foreground font-medium">{balanceMinutes.toFixed(0)} минут</span> · использовано <span className="text-foreground font-medium">{Math.max(0, usedMinutes).toLocaleString()}</span> минут
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
                  <span>{totalMinutes.toLocaleString()} минут</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Пополнить баланс
                <span className="relative group inline-flex items-center">
                  <Info className="w-3.5 h-3.5 text-muted-foreground/50 cursor-help ml-1" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                    Цена на трафик динамическая и зависит от курса $/₽
                  </span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Трафик</span>
                </div>
                <Slider
                  value={[trafficAmount]}
                  onValueChange={(value) => setTrafficAmount(value[0])}
                  min={tariff === "Старт" ? 4000 : 2000}
                  max={100000}
                  step={1000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{tariff === "Старт" ? "4 000" : "2 000"}</span>
                  <span className="text-muted-foreground">100 000 сообщений</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-foreground">
                    <span className="font-semibold">{trafficAmount.toLocaleString()}</span> сообщений = <span className="font-semibold">{trafficCostRub.toFixed(0)} ₽</span>
                  </p>
                </div>
              </div>

              <div className="space-y-4 opacity-50 pointer-events-none relative">
                <div className="absolute -top-2 right-0 z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-black px-1.5 py-0.5 rounded-full">
                    Скоро
                  </span>
                </div>
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
                  disabled
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">0</span>
                  <span className="text-muted-foreground">10 000 минут</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                  <p className="text-foreground">
                    <span className="font-semibold">{telephonyAmount.toLocaleString()}</span> минут = <span className="font-semibold">{telephonyCostRub.toFixed(0)} ₽</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium text-foreground">Итого:</span>
                  <span className="text-xl font-bold text-foreground">
                    {totalRub.toFixed(0)} ₽
                  </span>
                </div>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={totalRub === 0 || isPaying}
                  onClick={handlePayTraffic}
                >
                  {isPaying ? "Загрузка..." : "Оплатить"}
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </main>
  )
}