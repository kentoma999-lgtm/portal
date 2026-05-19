"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, Download, DollarSign, Handshake } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

type Period = "today" | "7days" | "30days" | "all"

// Mock KPI data по периодам - будет заменено на реальные данные
const MOCK_KPI: Record<Period, {
  leads: { value: string; change: string; trend: "up" | "down" }
  deals: { value: string; change: string; trend: "up" | "down" }
  conversion: { value: string; change: string; trend: "up" | "down" }
  revenue: { value: string; change: string; trend: "up" | "down" }
}> = {
  today: {
    leads: { value: "47", change: "+12%", trend: "up" },
    deals: { value: "8", change: "+33%", trend: "up" },
    conversion: { value: "17.0%", change: "-1.2%", trend: "down" },
    revenue: { value: "$4,250", change: "+28%", trend: "up" },
  },
  "7days": {
    leads: { value: "312", change: "+18%", trend: "up" },
    deals: { value: "54", change: "+24%", trend: "up" },
    conversion: { value: "17.3%", change: "+0.8%", trend: "up" },
    revenue: { value: "$28,400", change: "+15%", trend: "up" },
  },
  "30days": {
    leads: { value: "1,284", change: "+22%", trend: "up" },
    deals: { value: "218", change: "+31%", trend: "up" },
    conversion: { value: "17.0%", change: "-0.5%", trend: "down" },
    revenue: { value: "$124,800", change: "+19%", trend: "up" },
  },
  all: {
    leads: { value: "8,492", change: "+156%", trend: "up" },
    deals: { value: "1,847", change: "+142%", trend: "up" },
    conversion: { value: "21.7%", change: "+4.2%", trend: "up" },
    revenue: { value: "$892,400", change: "+128%", trend: "up" },
  },
}

const PERIOD_LABELS: Record<Period, string> = {
  today: "Сегодня",
  "7days": "7 дней",
  "30days": "30 дней",
  all: "Всё время",
}

const PERIOD_COMPARE: Record<Period, string> = {
  today: "vs вчера",
  "7days": "vs пред. неделя",
  "30days": "vs пред. месяц",
  all: "vs пред. год",
}

const CHART_TITLES = [
  "Ключевые показатели",
  "Воронка продаж",
  "Динамика обращений",
  "По источникам",
  "По приоритетам",
  "По тону клиента",
  "По категориям",
  "Активность по времени",
  "Топ сделок",
  "Конверсии",
]

export default function DashboardPage() {
  const { user, refreshData } = useAuth()
  const [period, setPeriod] = useState<Period>("7days")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(() => 
    new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
  )

  const data = MOCK_KPI[period]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshData()
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdate(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }))
    }, 2000)
  }

  const stats = [
    {
      title: "Всего лидов",
      value: data.leads.value,
      change: data.leads.change,
      trend: data.leads.trend,
      icon: Users,
    },
    {
      title: "Сделок закрыто",
      value: data.deals.value,
      change: data.deals.change,
      trend: data.deals.trend,
      icon: Handshake,
    },
    {
      title: "Конверсия в сделку",
      value: data.conversion.value,
      change: data.conversion.change,
      trend: data.conversion.trend,
      icon: TrendingUp,
    },
    {
      title: "Выручка",
      value: data.revenue.value,
      change: data.revenue.change,
      trend: data.revenue.trend,
      icon: DollarSign,
    },
  ]

  // Get chart URLs from user data
  const chartUrls = user ? [
    user.chart_1,
    user.chart_2,
    user.chart_3,
    user.chart_4,
    user.chart_5,
    user.chart_6,
    user.chart_7,
    user.chart_8,
    user.chart_9,
    user.chart_10,
  ] : []

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Дашборд</h1>
            <p className="text-sm text-muted-foreground">
              Последнее обновление: {lastUpdate}
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            className="border-border/50 gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Обновление..." : "Обновить данные"}
          </Button>
        </div>

        {/* Period Switcher */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
              className={period === p 
                ? "bg-primary text-primary-foreground" 
                : "border-border/50 text-muted-foreground hover:text-foreground"
              }
            >
              {PERIOD_LABELS[p]}
            </Button>
          ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={stat.trend === "up" ? "text-sm text-emerald-500" : "text-sm text-red-500"}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">{PERIOD_COMPARE[period]}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid 2x5 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHART_TITLES.map((title, index) => {
            const chartUrl = chartUrls[index]
            const hasImage = chartUrl && chartUrl.trim() !== ""

            return (
              <Card key={index} className="bg-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium text-foreground">
                    {title}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Скачать</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[16/10] bg-muted/30 rounded-lg overflow-hidden border border-border/30">
                    {hasImage ? (
                      <img 
                        src={chartUrl} 
                        alt={title}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-muted/50 flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm">График: {title}</p>
                          <p className="text-xs mt-1">Данные подключаются</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </main>
  )
}
