"use client"

import { ArrowRight, MessageSquare, Sparkles, Play, Database } from "lucide-react"

const crmItems = ["Yclients", "Bitrix24", "amoCRM", "МойСклад", "Fitbase", "и другие по запросу"]
const messengerItems = [
  "WhatsApp",
  "Telegram",
  "VK",
  "Instagram",
  "Wazzup",
  "AppChat",
  "Чат на сайте",
  "Avito Бизнес",
]

const demoSubject = encodeURIComponent("Запись на демо")
const demoBody = encodeURIComponent("Здравствуйте, покажите, что умеют ваши AI-агенты.")
const demoMailto = `mailto:info@lumitera.ru?subject=${demoSubject}&body=${demoBody}`

export function HeroSection() {
  return (
    <section className="relative grid gap-10 overflow-hidden px-4 py-10 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-16 lg:py-24">
      {/* Фон: мягкое свечение из CSS-классов — градиенты гаснут задолго до краёв, обрезаться нечему */}
      <div className="hero-glow-layer" aria-hidden="true" />
      <div className="hero-grid-wrap" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-grid-fade" />
      </div>

      <div className="relative flex flex-col justify-center">
        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-400 shadow-lg shadow-blue-500/10">
          <Sparkles className="h-4 w-4" />
          Полностью автономный AI-менеджер
        </div>
        
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
          Ваш первый AI-сотрудник, который работает 24/7{" "}
          <span className="text-gradient">без вашего участия</span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Никакого обучения. Никакого контроля. Просто смотрите на статистику готовых продаж.
        </p>
        
        <div className="mt-4 space-y-1 text-base text-muted-foreground">
          <p className="font-medium text-blue-400">1000 ответов AI бесплатно в Telegram.</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={demoMailto}
            className="flex items-center gap-2 rounded-full border border-blue-500 bg-blue-500/10 px-7 py-3 text-lg font-semibold text-blue-400 shadow-lg shadow-blue-500/20 transition hover:bg-blue-500/20"
          >
            Попробовать бесплатно
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href={demoMailto}
            className="flex items-center gap-2 rounded-full border border-border/70 bg-background/50 px-7 py-3 text-lg font-semibold text-white transition hover:bg-background/80"
          >
            <Play className="h-5 w-5" />
            Записаться на демо
          </a>
        </div>
      </div>

      <div className="relative rounded-3xl border border-border/60 bg-card/80 p-5 shadow-2xl shadow-blue-500/10 backdrop-blur">
        {/* Светящаяся линия сверху */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/70 to-transparent" />
        {/* Статус AI онлайн */}
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          AI онлайн
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/70 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">CRM с которыми работаем</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {crmItems.map((item) => {
              const isOther = item === "и другие по запросу"
              return (
                <div key={item} className="flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-2 text-sm text-muted-foreground transition hover:border-blue-500/40">
                  {!isOther && <Database className="h-4 w-4 text-yellow-400" />}
                  {item}
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground">Каналы коммуникации</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {messengerItems.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-2 text-sm text-muted-foreground transition hover:border-blue-500/40">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}