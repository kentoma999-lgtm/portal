"use client"

import { Database, Calendar, ShoppingCart, MessageCircle } from "lucide-react"

export function IntegrationsSection() {
  const integrations = [
    {
      icon: Database,
      title: "amoCRM / Bitrix24",
      description: "Автоматическое создание и ведение сделок, смена статусов",
    },
    {
      icon: Calendar,
      title: "Google / Яндекс Календарь",
      description: "Проверка свободных слотов и автоматическое бронирование",
    },
    {
      icon: ShoppingCart,
      title: "Yclients / Fitbase / МойСклад",
      description: "Запись клиентов и проверка наличия товаров/услуг в реальном времени",
    },
    {
      icon: MessageCircle,
      title: "Telegram / WhatsApp / VK",
      description: "Работа во всех популярных мессенджерах из одного окна",
    },
  ]

  return (
    <section className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">
          Работает в вашей системе. <br />
          <span className="text-gradient">Не требует переходить на другую.</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Мы не заставляем вас менять привычки. AI встраивается в то, что вы уже используете.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {integrations.map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border/70 bg-card/80 p-6 text-left transition hover:-translate-y-1 hover:border-blue-500/30"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 transition group-hover:bg-blue-500/20">
                <item.icon className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-blue-400">
          Нет вашей CRM? Напишем индивидуальную интеграцию по API.
        </p>
      </div>
    </section>
  )
}