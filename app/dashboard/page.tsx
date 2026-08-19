"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  CalendarCheck,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  CreditCard,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Target,
  Flag,
  Zap,
  Star,
  BarChart3,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts"

import { useAuth } from "@/lib/auth-context"

// Типы
type DashboardData = {
  tariff?: string
  modules?: string
  period?: string
  kpi?: unknown
  by_day?: unknown
  funnel?: unknown
  by_source?: unknown
  by_priority?: unknown
  by_objection_reason?: unknown
  top_deals?: unknown
  support_stats?: unknown
  telephony_stats?: unknown
  updated_at?: string
  empty?: boolean
  message?: string
  [key: string]: unknown
}

type KpiItem = {
  key?: string
  label: string
  value: string
  change?: string
  trend?: "up" | "down"
  isPercent?: boolean
}

type LabelValueItem = {
  name: string
  value: number
  date?: string
}

type StatItem = {
  label: string
  value: string
}

type TopDealItem = {
  title: string
  subtitle?: string
  amount: string
  date?: string
}

type MetricColor = "blue" | "green" | "amber" | "teal" | "purple" | "red" | "coral" | "gray"

const metricIcons: Record<string, React.ReactNode> = {
  total_leads: <Users className="w-4 h-4" />,
  active_appointments: <CalendarCheck className="w-4 h-4" />,
  total_appointments: <Calendar className="w-4 h-4" />,
  conversion_appointment: <TrendingUp className="w-4 h-4" />,
  deals_closed: <CheckCircle className="w-4 h-4" />,
  deals_canceled: <XCircle className="w-4 h-4" />,
  deals_lost: <AlertTriangle className="w-4 h-4" />,
  conversion_deal: <Target className="w-4 h-4" />,
  revenue: <DollarSign className="w-4 h-4" />,
  avg_budget: <CreditCard className="w-4 h-4" />,
  objections_total: <MessageSquare className="w-4 h-4" />,
  objections_success: <ThumbsUp className="w-4 h-4" />,
  objections_failed: <ThumbsDown className="w-4 h-4" />,
  objections_success_rate: <BarChart3 className="w-4 h-4" />,
}

const metricColorMap: Record<string, MetricColor> = {
  total_leads: "blue",
  active_appointments: "teal",
  total_appointments: "gray",
  conversion_appointment: "purple",
  deals_closed: "green",
  deals_canceled: "red",
  deals_lost: "coral",
  conversion_deal: "amber",
  revenue: "amber",
  avg_budget: "teal",
  objections_total: "blue",
  objections_success: "green",
  objections_failed: "red",
  objections_success_rate: "amber",
}

const metricSections = {
  start: [
    {
      title: "Лиды и записи",
      keys: ["total_leads", "active_appointments", "total_appointments", "conversion_appointment"],
    },
  ],
  growth: [
    {
      title: "Лиды и записи",
      keys: ["total_leads", "active_appointments", "total_appointments", "conversion_appointment"],
    },
    {
      title: "Сделки",
      keys: ["deals_closed", "deals_canceled", "deals_lost", "conversion_deal"],
    },
  ],
  system: [
    {
      title: "Лиды и записи",
      keys: ["total_leads", "active_appointments", "total_appointments", "conversion_appointment"],
    },
    {
      title: "Сделки",
      keys: ["deals_closed", "deals_canceled", "deals_lost", "conversion_deal"],
    },
    {
      title: "Финансы",
      keys: ["revenue", "avg_budget"],
    },
    {
      title: "Возражения",
      keys: ["objections_total", "objections_success", "objections_failed", "objections_success_rate"],
    },
  ],
}

const tariffSections: Record<string, string[]> = {
  start: ["kpi", "funnel", "by_day", "sources"],
  growth: ["kpi", "funnel", "by_day", "sources", "priorities", "objections"],
  system: ["kpi", "funnel", "by_day", "sources", "priorities", "objections", "top_deals", "support", "telephony"],
}

function MetricCard({
  label,
  value,
  color,
  metricKey,
  isPercent,
  isZero,
}: {
  label: string
  value: string
  color: MetricColor
  metricKey?: string
  isPercent?: boolean
  isZero?: boolean
}) {
  const colorVar = {
    blue: "var(--c-blue)",
    green: "var(--c-green)",
    amber: "var(--c-amber)",
    teal: "var(--c-teal)",
    purple: "var(--c-purple)",
    red: "var(--c-red)",
    coral: "var(--c-coral)",
    gray: "var(--c-gray)",
  }[color]

  return (
    <div className="relative group">
      <div className="relative bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:-translate-y-0.5">
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
          style={{ background: `linear-gradient(90deg, ${colorVar}, ${colorVar}88)` }}
        />
        
        <div className="flex items-start justify-between mt-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {metricKey && metricIcons[metricKey] && (
                <span style={{ color: colorVar }}>
                  {metricIcons[metricKey]}
                </span>
              )}
              <p className="text-xs text-[var(--text-secondary)] font-medium truncate">{label}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold tracking-tight ${isZero ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                {value}
              </span>
              {isPercent && <span className="text-sm text-[var(--text-secondary)]">%</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FunnelChart({
  items,
}: {
  items: { name: string; value: number }[]
}) {
  const maxValue = items.length > 0 ? items[0].value || 0 : 0
  const colorMap: Record<string, { bg: string; bar: string }> = {
    "Всего лидов": { bg: "#1e3a5f", bar: "#378ADD" },
    "Записей назначено": { bg: "#1a3a2e", bar: "#1D9E75" },
    "Сделок закрыто": { bg: "#2a3a1e", bar: "#639922" },
    "Сделок отменено": { bg: "#3a1e1e", bar: "#E24B4A" },
    "Не состоялось": { bg: "#3a251e", bar: "#D85A30" },
  }

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
      <div className="space-y-4">
        {items.map((item) => {
          const value = item.value ?? 0
          const widthPercent = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0
          const colors = colorMap[item.name] ?? { bg: "#2e2e2e", bar: "#9098a8" }

          return (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[var(--text-secondary)] font-medium">{item.name}</span>
                <span className={`text-xs font-semibold ${value === 0 ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                  {value} <span className="text-[var(--text-secondary)] font-normal">({widthPercent}%)</span>
                </span>
              </div>
              <div className="relative h-7 rounded-lg overflow-hidden" style={{ background: colors.bg }}>
                {value > 0 && (
                  <div
                    className="h-full rounded-lg transition-all duration-700 ease-out relative overflow-hidden"
                    style={{ width: `${widthPercent}%`, background: `linear-gradient(90deg, ${colors.bar}, ${colors.bar}cc)` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AppleLineChart({
  data,
}: {
  data: { date: string; value: number }[]
}) {
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const ticks = Array.from({ length: maxVal + 1 }, (_, i) => i).filter(v => v >= 1)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 shadow-xl">
          <p className="text-[var(--text-secondary)] text-xs mb-1">{label}</p>
          <p className="text-[var(--text-primary)] text-sm font-semibold">
            Обращений: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[200px] sm:h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--c-blue)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--c-blue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[1, 'auto']}
            ticks={ticks}
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--c-blue)"
            strokeWidth={2}
            fill="url(#colorValue)"
            dot={{ r: 3, fill: "var(--c-blue)", strokeWidth: 2, stroke: "var(--card)" }}
            activeDot={{ r: 5, fill: "var(--c-blue)", strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function SourcesInline({
  data,
}: {
  data: { name: string; value: number }[]
}) {
  const colors = [
    "var(--c-blue)", "var(--c-green)", "var(--c-purple)", "var(--c-amber)", "var(--c-teal)",
    "var(--c-red)", "var(--c-coral)", "#9B59B6", "#1ABC9C", "#F39C12",
  ]

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {data.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
          return (
            <div key={item.name} className="flex items-center gap-1.5 whitespace-nowrap">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colors[index % colors.length] }} />
              <span className="text-xs text-[var(--text-secondary)]">{item.name}</span>
              <span className="text-xs font-semibold text-[var(--text-primary)]">{item.value}</span>
              <span className="text-[10px] text-[var(--text-muted)]">({percentage}%)</span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 h-1.5 rounded-full overflow-hidden flex bg-[var(--bg-hover)]">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          return percentage > 0 ? (
            <div
              key={item.name}
              className="h-full transition-all duration-500"
              style={{ width: `${percentage}%`, background: colors[index % colors.length] }}
            />
          ) : null
        })}
      </div>
    </div>
  )
}

function PrioritiesBars({
  data,
}: {
  data: { name: string; value: number }[]
}) {
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0
  const configMap: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    "🔴 высокий": { color: "#E24B4A", bg: "#3a1e1e", icon: <Flag className="w-3.5 h-3.5" /> },
    "🔴 Высокий": { color: "#E24B4A", bg: "#3a1e1e", icon: <Flag className="w-3.5 h-3.5" /> },
    "🟡 средний": { color: "#BA7517", bg: "#3a2e1e", icon: <Zap className="w-3.5 h-3.5" /> },
    "🟡 Средний": { color: "#BA7517", bg: "#3a2e1e", icon: <Zap className="w-3.5 h-3.5" /> },
    "🟢 низкий": { color: "#639922", bg: "#2a3a1e", icon: <Star className="w-3.5 h-3.5" /> },
    "🟢 Низкий": { color: "#639922", bg: "#2a3a1e", icon: <Star className="w-3.5 h-3.5" /> },
  }

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
      <div className="space-y-4">
        {data.map((item) => {
          const value = item.value ?? 0
          const widthPercent = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0
          const config = configMap[item.name] ?? { color: "#9098a8", bg: "#2e2e2e", icon: null }

          return (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {config.icon && <span style={{ color: config.color }}>{config.icon}</span>}
                  <span className="text-xs text-[var(--text-secondary)]">{item.name}</span>
                </div>
                <span className={`text-xs font-semibold ${value === 0 ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                  {value}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: config.bg }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${widthPercent}%`, background: `linear-gradient(90deg, ${config.color}, ${config.color}aa)` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ObjectionsChart({
  items,
}: {
  items: { name: string; value: number }[]
}) {
  const maxValue = items.length > 0 ? Math.max(...items.map((i) => i.value)) : 0

  const colors = [
    { bar: "#E24B4A", bg: "#3a1e1e" },
    { bar: "#D85A30", bg: "#3a251e" },
    { bar: "#BA7517", bg: "#3a2e1e" },
    { bar: "#F39C12", bg: "#3a301e" },
    { bar: "#E67E22", bg: "#3a2a1e" },
    { bar: "#9B59B6", bg: "#2e1e3a" },
    { bar: "#7F77DD", bg: "#251e3a" },
    { bar: "#378ADD", bg: "#1e2a3a" },
    { bar: "#1ABC9C", bg: "#1e3a30" },
    { bar: "#1D9E75", bg: "#1a3a2e" },
    { bar: "#639922", bg: "#2a3a1e" },
    { bar: "#34495E", bg: "#1e2530" },
    { bar: "#16A085", bg: "#1e3a30" },
    { bar: "#C0392B", bg: "#3a1e1e" },
    { bar: "#8E44AD", bg: "#2a1e3a" },
  ]

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
      <div className="space-y-3">
        {items.map((item, index) => {
          const value = item.value ?? 0
          const widthPercent = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0
          const colorSet = colors[index % colors.length]

          return (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-[var(--text-secondary)] truncate flex-1 mr-3">{item.name}</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">{value}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: colorSet.bg }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${widthPercent}%`, background: `linear-gradient(90deg, ${colorSet.bar}, ${colorSet.bar}cc)` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TopDealsTable({
  deals,
}: {
  deals: { title: string; subtitle?: string; amount: string | number }[]
}) {
  if (deals.length === 0) {
    return (
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-8 text-center">
        <Star className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
        <p className="text-sm text-[var(--text-secondary)]">Нет закрытых сделок за выбранный период</p>
      </div>
    )
  }

  const parseAmount = (raw: string | number): number => {
    if (raw === null || raw === undefined) return 0
    if (typeof raw === 'number') return raw
    const str = String(raw)
    const cleaned = str.replace(/[^0-9-]/g, '')
    if (!cleaned) return 0
    const parsed = parseInt(cleaned, 10)
    return isNaN(parsed) ? 0 : parsed
  }

  const formatAmount = (amount: number): string => {
    if (amount === 0) return '—'
    return `${amount.toLocaleString('ru-RU')} ₽`
  }

  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-hover)]/50">
            <th className="text-xs text-[var(--text-secondary)] font-medium text-left py-3 px-4 w-12">#</th>
            <th className="text-xs text-[var(--text-secondary)] font-medium text-left py-3 px-4">Название</th>
            <th className="text-xs text-[var(--text-secondary)] font-medium text-right py-3 px-4">Бюджет</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal, index) => {
            const isFirstPlace = index === 0
            const amount = parseAmount(deal.amount)
            
            return (
              <tr key={`${deal.title}-${index}`} className="border-b border-[rgba(255,255,255,0.04)] last:border-b-0 hover:bg-[var(--bg-hover)]/50 transition-colors">
                <td className="py-3 px-4">
                  <div
                    className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold"
                    style={{
                      background: isFirstPlace ? "linear-gradient(135deg, var(--c-amber), #F39C12)" : "var(--bg-hover)",
                      color: isFirstPlace ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {index + 1}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-[var(--text-primary)] font-medium">{deal.title}</div>
                  {deal.subtitle && <div className="text-xs text-[var(--text-secondary)] mt-0.5">{deal.subtitle}</div>}
                </td>
                <td className="py-3 px-4 text-right text-sm font-semibold text-[var(--text-primary)]">
                  {formatAmount(amount)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const webhookUrl = "https://n8n.lumitera.online/webhook/dashboard"

const kpiLabels: Record<string, string> = {
  "total_leads": "Всего лидов",
  "active_appointments": "Активных записей",
  "total_appointments": "Всего записей",
  "conversion_appointment": "Конверсия в запись",
  "deals_closed": "Сделок закрыто",
  "deals_canceled": "Сделок отменено",
  "deals_lost": "Не состоялось",
  "conversion_deal": "Конверсия в сделку",
  "revenue": "Выручка",
  "avg_budget": "Средний чек",
  "objections_total": "Возражений всего",
  "objections_success": "Отработано успешно",
  "objections_failed": "Не отработано",
  "objections_success_rate": "Успешность возражений"
}

const formatLabel = (text = "") =>
  text
    .toString()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

const parseAmountUniversal = (raw: unknown): number => {
  if (raw === null || raw === undefined) return 0
  if (typeof raw === 'number') return raw
  const str = String(raw)
  const cleaned = str.replace(/[^0-9-]/g, '')
  if (!cleaned) return 0
  const parsed = parseInt(cleaned, 10)
  return isNaN(parsed) ? 0 : parsed
}

const getFieldValue = (item: any, keys: string[]) => {
  if (!item || typeof item !== "object") return undefined
  for (const key of keys) {
    if (key in item && item[key] !== undefined && item[key] !== null) return item[key]
  }
  return undefined
}

const normalizeSeries = (raw: unknown, labelKeys: string[], valueKeys: string[]): LabelValueItem[] => {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      const name = String(item?.date ?? getFieldValue(item, labelKeys) ?? item?.label ?? item?.name ?? item?.title ?? "")
      const value = parseAmountUniversal(getFieldValue(item, valueKeys) ?? item?.value ?? item?.count ?? item?.total ?? 0)
      return { name, value, date: item?.date ?? undefined }
    })
  }
  if (typeof raw === "object" && raw !== null) {
    return Object.entries(raw).map(([key, value]) => ({ name: formatLabel(key), value: parseAmountUniversal(value) }))
  }
  return []
}

const percentKpiKeys = ["conversion_appointment", "conversion_deal", "objections_success_rate"]

const normalizeKpi = (raw: unknown): KpiItem[] => {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((item) => ({
      label: String(getFieldValue(item, ["label", "title", "name"]) ?? ""),
      value: String(getFieldValue(item, ["value", "amount", "count", "total"]) ?? ""),
      change: String(getFieldValue(item, ["change"]) ?? ""),
      trend: getFieldValue(item, ["trend"]) as "up" | "down" | undefined,
      isPercent: false,
    }))
  }
  if (typeof raw === "object" && raw !== null) {
    return Object.entries(raw).map(([key, value]) => {
      const shouldAppendPercent = percentKpiKeys.includes(key)
      if (typeof value === "object" && value !== null) {
        const fieldValue = String(getFieldValue(value, ["value", "amount", "count", "total"]) ?? "")
        return {
          key,
          label: String(getFieldValue(value, ["label", "title"]) ?? kpiLabels[key] ?? formatLabel(key)),
          value: fieldValue,
          change: String(getFieldValue(value, ["change"]) ?? ""),
          trend: getFieldValue(value, ["trend"]) as "up" | "down" | undefined,
          isPercent: shouldAppendPercent,
        }
      }
      return {
        key,
        label: kpiLabels[key] ?? formatLabel(key),
        value: String(value ?? ""),
        isPercent: shouldAppendPercent,
      }
    })
  }
  return []
}

const normalizeStats = (raw: unknown): StatItem[] => {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((item, index) => ({
      label: String(getFieldValue(item, ["label", "title", "name"]) ?? `Пункт ${index + 1}`),
      value: typeof item === "object" && item !== null ? JSON.stringify(item) : String(item ?? "-"),
    }))
  }
  if (typeof raw === "object" && raw !== null) {
    return Object.entries(raw).map(([key, value]) => ({
      label: formatLabel(key),
      value: typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "-"),
    }))
  }
  return []
}

const normalizeDeals = (raw: unknown): TopDealItem[] => {
  if (!raw) return []
  
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      const amount = getFieldValue(item, ["budget", "amount", "value", "total", "price"])
      
      return {
        title: String(getFieldValue(item, ["name", "title", "deal", "company"]) ?? "Сделка"),
        subtitle: String(getFieldValue(item, ["status", "stage", "category"]) ?? ""),
        amount: amount !== undefined && amount !== null ? amount : "",
        date: item?.date ?? undefined,
      }
    })
  }
  
  if (typeof raw === "object" && raw !== null) {
    return Object.values(raw).map((item: any) => {
      const amount = getFieldValue(item, ["budget", "amount", "value", "total", "price"])
      
      return {
        title: String(getFieldValue(item, ["name", "title", "deal", "company"]) ?? "Сделка"),
        subtitle: String(getFieldValue(item, ["status", "stage", "category"]) ?? ""),
        amount: amount !== undefined && amount !== null ? amount : "",
        date: item?.date ?? undefined,
      }
    })
  }
  
  return []
}

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null
  
  const dotMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/)
  if (dotMatch) {
    const day = parseInt(dotMatch[1])
    const month = parseInt(dotMatch[2]) - 1
    let year = parseInt(dotMatch[3])
    if (year < 100) year += 2000
    return new Date(year, month, day)
  }
  
  const isoMatch = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]))
  }
  
  return null
}

const getDateCutoff = (period: "all" | "30" | "7" | "today"): Date | null => {
  if (period === "all") return null
  
  const now = new Date()
  const cutoff = new Date()
  
  if (period === "today") {
    cutoff.setHours(0, 0, 0, 0)
  } else if (period === "30") {
    cutoff.setDate(now.getDate() - 30)
    cutoff.setHours(0, 0, 0, 0)
  } else if (period === "7") {
    cutoff.setDate(now.getDate() - 7)
    cutoff.setHours(0, 0, 0, 0)
  }
  
  return cutoff
}

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState(() =>
    new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
  )
  const [selectedPeriod, setSelectedPeriod] = useState<"all" | "30" | "7" | "today">("all")

  const now = new Date()
  const [dynMonth, setDynMonth] = useState(now.getMonth())
  const [dynYear, setDynYear] = useState(now.getFullYear())

  const changeMonth = (delta: number) => {
    const newDate = new Date(dynYear, dynMonth + delta, 1)
    setDynMonth(newDate.getMonth())
    setDynYear(newDate.getFullYear())
  }

  const tariff = (dashboardData?.tariff as string | undefined)?.toLowerCase() ?? "start"
  const modulesString = dashboardData?.modules as string | undefined
  const availableModules = useMemo(() => {
    if (!modulesString) return []
    return modulesString.split(",").map(m => m.trim().toLowerCase())
  }, [modulesString])

  const hasSupport = availableModules.some(m => m.includes("support") || m.includes("поддержк"))
  const hasTelephony = availableModules.some(m => m.includes("телефон") || m.includes("teleph"))

  const serverEmptyMessage = dashboardData?.empty && typeof dashboardData?.message === "string" ? dashboardData.message : null

  const kpiItems = useMemo(() => normalizeKpi(dashboardData?.kpi), [dashboardData?.kpi])
  const kpiItemsByKey = useMemo(
    () => new Map(kpiItems.filter((item): item is KpiItem => Boolean(item.key)).map((item) => [item.key as string, item])),
    [kpiItems],
  )
  const allByDay = useMemo(
    () => normalizeSeries(dashboardData?.by_day, ["date", "day", "label", "name"], ["value", "count", "total", "amount"]),
    [dashboardData?.by_day],
  )
  const funnelItems = useMemo(
    () => normalizeSeries(dashboardData?.funnel, ["stage", "label", "name"], ["value", "count", "total", "amount"]),
    [dashboardData?.funnel],
  )
  const allSourceItems = useMemo(
    () => normalizeSeries(dashboardData?.by_source, ["source", "label", "name"], ["value", "count", "total", "amount", "percentage"]),
    [dashboardData?.by_source],
  )
  
  const priorityItems = useMemo(() => {
    const items = normalizeSeries(dashboardData?.by_priority, ["priority", "label", "name"], ["value", "count", "total", "amount", "percentage"])

    const defaults = [
      { name: "🔴 Высокий", value: 0, searchKeys: ["высокий", "high"] },
      { name: "🟡 Средний", value: 0, searchKeys: ["средний", "medium", "сред"] },
      { name: "🟢 Низкий", value: 0, searchKeys: ["низкий", "low", "низ"] },
    ]

    defaults.forEach(d => {
      const found = items.find(i => {
        const nameLower = i.name.toLowerCase()
        return d.searchKeys.some(key => nameLower.includes(key.toLowerCase()))
      })
      if (found) d.value = found.value
    })

    return defaults.map(({ name, value }) => ({ name, value }))
  }, [dashboardData?.by_priority])

  const objectionItems = useMemo(
    () => normalizeSeries(dashboardData?.by_objection_reason, ["reason", "label", "name"], ["value", "count", "total", "amount"]),
    [dashboardData?.by_objection_reason],
  )

  const topDeals = useMemo(() => normalizeDeals(dashboardData?.top_deals), [dashboardData?.top_deals])
  const supportItems = useMemo(() => normalizeStats(dashboardData?.support_stats), [dashboardData?.support_stats])
  const telephonyItems = useMemo(() => normalizeStats(dashboardData?.telephony_stats), [dashboardData?.telephony_stats])

  // ФИЛЬТРАЦИЯ по дате
  const filteredByDay = useMemo(() => {
    const cutoff = getDateCutoff(selectedPeriod)
    
    // Сначала фильтруем по периоду
    let data = allByDay
    if (cutoff) {
      data = data.filter((item) => {
        const parsed = parseDate(item.date || item.name)
        if (!parsed) return true
        return parsed >= cutoff
      })
    }
    
    // Затем по месяцу навигации
    return data.filter((item) => {
      const parsed = parseDate(item.date || item.name)
      if (!parsed) return false
      return parsed.getMonth() === dynMonth && parsed.getFullYear() === dynYear
    })
  }, [allByDay, dynMonth, dynYear, selectedPeriod])

  const sourceItems = useMemo(() => {
    const cutoff = getDateCutoff(selectedPeriod)
    if (!cutoff) return allSourceItems
    return allSourceItems.filter((item) => {
      const parsed = parseDate(item.date || "")
      if (!parsed) return true
      return parsed >= cutoff
    })
  }, [allSourceItems, selectedPeriod])

  const availableSections = useMemo(() => {
    return tariffSections[tariff] ?? tariffSections.start
  }, [tariff])

  const shouldShowSection = (section: string) => availableSections.includes(section)

  const showSupportSection = shouldShowSection("support") && hasSupport && supportItems.length > 0
  const showTelephonySection = shouldShowSection("telephony") && hasTelephony && telephonyItems.length > 0

  const serviceTabs = useMemo(() => {
    const tabs: { value: string; label: string; items: StatItem[] }[] = []
    if (showSupportSection) tabs.push({ value: "support", label: "AI Support", items: supportItems })
    if (showTelephonySection) tabs.push({ value: "telephony", label: "Телефония", items: telephonyItems })
    return tabs
  }, [showSupportSection, showTelephonySection, supportItems, telephonyItems])

  const selectedDataAvailable = useMemo(() => {
    if (serverEmptyMessage) return false
    return [
      kpiItems.length > 0,
      allByDay.length > 0,
      funnelItems.length > 0,
      allSourceItems.length > 0,
      priorityItems.length > 0,
      objectionItems.length > 0,
      topDeals.length > 0,
      serviceTabs.length > 0,
    ].some(Boolean)
  }, [serverEmptyMessage, kpiItems.length, allByDay.length, funnelItems.length, allSourceItems.length, priorityItems.length, objectionItems.length, topDeals.length, serviceTabs.length])

  const fetchDashboardData = async () => {
    if (!user?.key) {
      setError("Не найден ключ пользователя.")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: user.key, period: selectedPeriod }),
      })

      if (!response.ok) throw new Error("Ошибка при загрузке данных")

      const responseData = await response.json()
      // n8n возвращает массив — берём первый элемент
      const data = Array.isArray(responseData) ? responseData[0] : responseData
      
      setDashboardData(data)
      setLastUpdate(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }))
    } catch (error) {
      console.error("❌ Dashboard fetch error:", error)
      if (error instanceof TypeError) {
        setError("Ошибка соединения. Проверьте интернет.")
      } else if (error instanceof Error) {
        setError(error.message || "Не удалось загрузить данные. Попробуйте обновить страницу.")
      } else {
        setError("Не удалось загрузить данные. Попробуйте обновить страницу.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.key) fetchDashboardData()
  }, [user?.key, selectedPeriod])

  return (
    <main className="min-h-screen py-6 px-4 sm:py-8 sm:px-6" style={{ background: "var(--bg-page)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
              Дашборд
            </h1>
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
              <span>Обновлено: {lastUpdate}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--c-teal)" }} />
              <span>Данные актуальны</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--card)] rounded-lg p-1 border border-[var(--border)]">
              {[{ value: "all", label: "Всё время" }, { value: "30", label: "30 дн" }, { value: "7", label: "7 дн" }, { value: "today", label: "Сегодня" }].map(p => (
                <button
                  key={p.value}
                  onClick={() => setSelectedPeriod(p.value as "all" | "30" | "7" | "today")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedPeriod === p.value
                      ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <Button
              onClick={fetchDashboardData}
              disabled={isLoading}
              variant="outline"
              className="border-[var(--border)] bg-[var(--card)] hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Загрузка..." : "Обновить"}
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-20">
            <Spinner className="text-[var(--primary)]" />
            <span className="text-[var(--text-secondary)]">Загрузка данных...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400 mb-6">
            {error}
          </div>
        )}

        {!isLoading && serverEmptyMessage && !error && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-12 text-center">
            <BarChart3 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)]">{serverEmptyMessage}</p>
          </div>
        )}

        {!isLoading && !serverEmptyMessage && !selectedDataAvailable && !error && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-12 text-center">
            <BarChart3 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)]">Нет доступных данных для выбранного периода.</p>
          </div>
        )}

        {!isLoading && selectedDataAvailable && (
          <div className="space-y-6">
            {shouldShowSection("kpi") && kpiItems.length > 0 && (
              <div className="space-y-5">
                {(metricSections[tariff as keyof typeof metricSections] ?? metricSections.start).map((section) => {
                  const sectionItems = section.keys
                    .map((key) => {
                      const item = kpiItemsByKey.get(key)
                      if (!item) return null
                      return (
                        <MetricCard
                          key={item.key}
                          label={item.label}
                          value={item.value}
                          color={metricColorMap[key]}
                          metricKey={key}
                          isPercent={item.isPercent}
                          isZero={!item.value || item.value === "0"}
                        />
                      )
                    })
                    .filter(Boolean)
                  if (sectionItems.length === 0) return null
                  return (
                    <div key={section.title}>
                      <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                        {sectionItems}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shouldShowSection("by_day") && (
                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                      Динамика обращений
                    </h3>
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
                        <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
                      </button>
                      <span className="text-sm font-medium text-[var(--text-primary)] min-w-[120px] text-center">
                        {monthNames[dynMonth]} {dynYear}
                      </span>
                      <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-[var(--bg-hover)] rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                      </button>
                    </div>
                  </div>
                  {filteredByDay.length > 0 ? (
                    <AppleLineChart data={filteredByDay.map((item) => ({ date: item.name, value: item.value }))} />
                  ) : (
                    <div className="text-center text-sm text-[var(--text-secondary)] py-12">
                      Нет данных за {monthNames[dynMonth]} {dynYear}
                    </div>
                  )}
                </div>
              )}

              {shouldShowSection("funnel") && funnelItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Воронка продаж
                  </h3>
                  <FunnelChart items={funnelItems} />
                </div>
              )}
            </div>

            {shouldShowSection("sources") && sourceItems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                  Источники лидов
                </h3>
                <SourcesInline data={sourceItems} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shouldShowSection("priorities") && priorityItems.some(i => i.value > 0) && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    По приоритетам
                  </h3>
                  <PrioritiesBars data={priorityItems} />
                </div>
              )}

              {shouldShowSection("objections") && objectionItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    Причины возражений
                  </h3>
                  <ObjectionsChart items={objectionItems} />
                </div>
              )}
            </div>

            {shouldShowSection("top_deals") && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                  Топ сделок
                </h3>
                <TopDealsTable deals={topDeals} />
              </div>
            )}

            {serviceTabs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                  Службы
                </h3>
                <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
                  {serviceTabs.length > 1 ? (
                    <Tabs defaultValue={serviceTabs[0].value} className="space-y-4">
                      <TabsList>
                        {serviceTabs.map((tab) => (
                          <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                        ))}
                      </TabsList>
                      {serviceTabs.map((tab) => (
                        <TabsContent key={tab.value} value={tab.value} className="mt-2">
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {tab.items.map((item) => (
                              <div key={item.label} className="bg-[var(--bg-hover)]/50 rounded-lg p-4 border border-[rgba(255,255,255,0.04)]">
                                <div className="text-xs text-[var(--text-secondary)] mb-1">{item.label}</div>
                                <div className="text-base font-semibold text-[var(--text-primary)]">{item.value}</div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {serviceTabs[0].items.map((item) => (
                        <div key={item.label} className="bg-[var(--bg-hover)]/50 rounded-lg p-4 border border-[rgba(255,255,255,0.04)]">
                          <div className="text-xs text-[var(--text-secondary)] mb-1">{item.label}</div>
                          <div className="text-base font-semibold text-[var(--text-primary)]">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}