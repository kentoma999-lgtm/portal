"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, TrendingUp, PiggyBank, Building2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

const CONVERSION_RATE = 0.2

const demoSubject = encodeURIComponent("Запись на демо")
const demoBody = encodeURIComponent("Здравствуйте, покажите, что умеют ваши AI-агенты.")
const demoMailto = `mailto:info@lumitera.ru?subject=${demoSubject}&body=${demoBody}`

export function CalculatorSection() {
  const [leadsPerMonth, setLeadsPerMonth] = useState(300)
  const [averageCheck, setAverageCheck] = useState(5000)

  const lostRevenue = useMemo(() => {
    return Math.round(leadsPerMonth * averageCheck * CONVERSION_RATE)
  }, [leadsPerMonth, averageCheck])

  const lumiteraYearCost = 140000
  const competitorYearCost = 253000
  const yearlySavings = competitorYearCost - lumiteraYearCost

  useEffect(() => {
    const el = document.getElementById("revenue-output")
    if (el) {
      el.animate(
        [{ opacity: 0.6, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 220, easing: "ease-out" }
      )
      el.textContent = `${lostRevenue.toLocaleString("ru-RU")} ₽`
    }
  }, [lostRevenue])

  return (
    <section className="px-4 py-12 md:px-10 lg:px-16 lg:py-20">
      <div className="mx-auto max-w-6xl rounded-3xl border border-border/70 bg-card/80 p-6 md:p-8 lg:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Честный расчет: сколько вы теряете и сколько сэкономите за год
          </h2>
          <p className="mt-3 text-muted-foreground">
            Многие обещают «дешевле», но за год вы переплачиваете за скрытые лимиты. Посчитаем вашу реальную выгоду.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8 rounded-2xl border border-border/70 bg-background/70 p-6">
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Building2 className="h-4 w-4" />
                Сколько входящих диалогов в месяц?
              </label>
              <div className="mb-3 text-3xl font-semibold text-white">{leadsPerMonth}</div>
              <Slider
                aria-label="Количество диалогов в месяц"
                min={50}
                max={2000}
                step={50}
                value={[leadsPerMonth]}
                onValueChange={([value]) => setLeadsPerMonth(value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Средний чек с одного клиента?
              </label>
              <div className="mb-3 text-3xl font-semibold text-white">
                {averageCheck.toLocaleString("ru-RU")} ₽
              </div>
              <Slider
                aria-label="Средний чек"
                min={1000}
                max={100000}
                step={1000}
                value={[averageCheck]}
                onValueChange={([value]) => setAverageCheck(value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6 shadow-lg shadow-blue-500/10">
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-blue-300">
                  Упущенная выручка без AI
                </p>
                <div className="mt-2 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 p-4 text-center shadow-lg shadow-blue-500/20">
                  <div id="revenue-output" className="text-4xl font-semibold text-white sm:text-5xl">
                    {lostRevenue.toLocaleString("ru-RU")} ₽
                  </div>
                  <div className="mt-1 text-sm text-blue-100/80">
                    ≈ {(lostRevenue * 12).toLocaleString("ru-RU")} ₽ в год
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-background/50 p-4 text-sm">
                <p className="mb-2 font-semibold text-white">Как мы это посчитали:</p>
                <p className="text-muted-foreground">
                  {leadsPerMonth} диалогов × {averageCheck.toLocaleString("ru-RU")} ₽ × 20% (заявок, которые вы теряете) ={" "}
                  <span className="font-medium text-white">{lostRevenue.toLocaleString("ru-RU")} ₽/мес</span>
                </p>
              </div>

              <div className="rounded-xl border border-border/50 bg-background/50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <PiggyBank className="h-5 w-5 text-blue-400" />
                  Экономия на подписке vs Конкуренты
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Конкуренты (средний тариф)</span>
                    <span className="font-medium text-white">253 000 ₽/год</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Lumitera (тариф «Рост»)</span>
                    <span className="font-medium text-white">140 000 ₽/год</span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-border/50 pt-2">
                    <span className="text-blue-300">Экономия за год</span>
                    <span className="font-bold text-blue-400">{yearlySavings.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/20 p-4">
                <p className="text-sm font-semibold text-white">Итого эффект за год с Lumitera:</p>
                <div className="mt-2 text-3xl font-bold text-blue-400">
                  {(lostRevenue * 12 + yearlySavings).toLocaleString("ru-RU")} ₽
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(lostRevenue * 12).toLocaleString("ru-RU")} ₽ — возвращённая выручка +{" "}
                  {yearlySavings.toLocaleString("ru-RU")} ₽ — экономия на подписке
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <a
                href={demoMailto}
                className="flex items-center gap-2 rounded-full border border-blue-500 bg-blue-500/10 px-7 py-3 text-lg font-semibold text-blue-400 shadow-lg shadow-blue-500/20 transition hover:bg-blue-500/20"
              >
                Получить точный расчет
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}