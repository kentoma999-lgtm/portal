"use client"

import { Brain, Eye, Plug } from "lucide-react"

export function ZeroTouchSection() {
  const features = [
    {
      icon: Brain,
      title: "Не требует обучения",
      description:
        "В отличие от обычных ботов, наш AI не задает вопросов вашим менеджерам. Мы настраиваем его под ваш бизнес.",
    },
    {
      icon: Eye,
      title: "Только статистика",
      description:
        "Ваша единственная задача — раз в день смотреть на дашборд и видеть новые сделки. Всё остальное система делает сама.",
    },
    {
      icon: Plug,
      title: "Глубокая интеграция",
      description:
        "AI сам проверяет календарь, сам создает сделки в CRM. Без вашего участия.",
    },
  ]

  return (
    <section className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">
          Забудьте о рутине. <span className="text-gradient">Полностью автономный AI-менеджер.</span>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border/70 bg-card/80 p-8 transition hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500">
                <feature.icon className="h-7 w-7 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}