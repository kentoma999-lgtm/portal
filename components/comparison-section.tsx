"use client"

import { X, Check } from "lucide-react"

export function ComparisonSection() {
  const withoutLumitera = [
    "Менеджер тратит 2-3 часа в день на однотипные ответы",
    "Долгое время ответа в мессенджерах — клиент уходит к конкурентам",
    "Заявки теряются в переписках, нет единого контроля",
    "Нужно постоянно контролировать и обучать сотрудников",
    "Зарплата + налоги + больничные = 40 000+ ₽/мес",
  ]

  const withLumitera = [
    "AI отвечает мгновенно 24/7, без выходных и перерывов",
    "AI обрабатывает 100% обращений и удерживает клиента",
    "Квалифицированные лиды автоматически попадают в CRM",
    "Вы только смотрите на статистику готовых продаж",
    "10 000 ₽/мес и никакой головной боли с кадрами",
  ]

  return (
    <section className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">
          Без Lumitera <span className="text-muted-foreground">vs</span> С Lumitera
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border/70 bg-background/50 p-6 md:p-8">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-red-400">
              <X className="h-6 w-6" />
              Без AI-агента
            </h3>
            <ul className="space-y-4">
              {withoutLumitera.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <X className="mt-1 h-5 w-5 shrink-0 text-red-400/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-blue-500/40 bg-blue-500/10 p-6 shadow-lg shadow-blue-500/10 md:p-8">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-blue-400">
              <Check className="h-6 w-6" />
              С Lumitera
            </h3>
            <ul className="space-y-4">
              {withLumitera.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-white">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-blue-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}