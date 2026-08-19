"use client"

import { MessageSquare, Cpu, CheckCircle2 } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: MessageSquare,
      title: "Клиент пишет",
      description: "WhatsApp, Telegram, VK или чат на сайте. В любое время дня и ночи.",
    },
    {
      number: "02",
      icon: Cpu,
      title: "AI обрабатывает",
      description: "Отвечает на вопросы, консультирует по базе знаний и отрабатывает возражения.",
    },
    {
      number: "03",
      icon: CheckCircle2,
      title: "Готовый результат",
      description: "Сделка создана в CRM, запись добавлена в календарь, менеджер получил уведомление.",
    },
  ]

  return (
    <section className="px-4 py-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">
          От заявки до записи — <span className="text-gradient">без вашего участия</span>
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative rounded-2xl border border-border/70 bg-card/80 p-8">
              <div className="absolute right-4 top-4 text-6xl font-bold text-muted-foreground/10">
                {step.number}
              </div>
              
              <div className="relative z-10">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <step.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <CheckCircle2 className="h-4 w-4" />
            Быстрая обработка заявок — от первого сообщения до записи
          </p>
        </div>
      </div>
    </section>
  )
}