"use client"

import { Check, Star, Monitor, Cpu, BarChart3, Settings, Link, Shield, Gift, ArrowRight, Sparkles, Zap, Crown, Rocket, MessageSquare, Database } from "lucide-react"

interface PricingFeature {
  text: string
  highlight?: boolean
}

interface PricingCardProps {
  badge: string
  name: string
  price: string
  priceSubtext?: string
  subtitle: string
  promo?: string
  headline?: string
  calculation: string
  calculationBorder?: boolean
  features: PricingFeature[]
  isPopular?: boolean
  isAddon?: boolean
  icon?: React.ReactNode
  topLabel?: string
  topLabelTone?: "amber" | "blue" | "green"
  channels?: string[]
  channelInactive?: string[]
  hideCalculation?: boolean
}

const integrationChannels = [
  "WhatsApp",
  "Telegram",
  "VK",
  "Instagram",
  "Wazzup",
  "AppChat",
  "Чат на сайте",
  "Avito Бизнес",
]

const startChannels = integrationChannels
const growthChannels = integrationChannels
const systemChannels = integrationChannels

function PricingCard({
  badge,
  name,
  price,
  priceSubtext,
  subtitle,
  promo,
  headline,
  calculation,
  features,
  isPopular,
  isAddon,
  icon,
  topLabel,
  topLabelTone = "amber",
  channels,
  channelInactive,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 h-full ${
        isPopular
          ? "bg-card border-2 border-transparent"
          : "bg-card border border-border"
      }`}
      style={
        isPopular
          ? {
              backgroundImage:
                "linear-gradient(to bottom, hsl(var(--card)), hsl(var(--card))), linear-gradient(135deg, #3b82f6, #8b5cf6, #3b82f6)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }
          : undefined
      }
    >
      {topLabel && (
        <div className={`absolute -top-3 left-5 z-10 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
          topLabelTone === "blue"
            ? "border-blue-400/40 bg-blue-500/15 text-blue-300"
            : topLabelTone === "green"
              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
              : "border-amber-400/40 bg-amber-500/15 text-amber-300"
        }`}>
          {topLabel}
        </div>
      )}

      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isAddon
              ? "bg-emerald-500/20 text-emerald-400"
              : isPopular
                ? "bg-blue-500/15 text-blue-400"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {isPopular && <Sparkles className="w-3 h-3" />}
          {badge}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div className={`p-2 rounded-lg ${isPopular ? "bg-blue-500/10 text-blue-400" : "bg-muted text-muted-foreground"}`}>
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
      </div>

      <div className="mb-2">
        <span className="text-3xl font-bold text-foreground">{price}</span>
        {priceSubtext && (
          <span className="text-muted-foreground text-sm ml-1">
            {priceSubtext}
          </span>
        )}
      </div>

      <p className="text-muted-foreground text-sm mb-3">{subtitle}</p>

      {promo && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-emerald-400" />
            <p className="text-emerald-400 text-xs font-medium">{promo}</p>
          </div>
        </div>
      )}

      {headline && (
        <p className="text-foreground/90 text-sm font-medium mb-4 leading-relaxed">
          {headline}
        </p>
      )}

      <div className="flex-1">
        <ul className="space-y-2.5">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  feature.highlight ? "text-blue-400" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm ${
                  feature.highlight
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {channels && channels.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Каналы
          </p>
          <div className="flex flex-wrap gap-2">
            {channels.map((channel) => {
              const inactive = channelInactive?.includes(channel)
              return (
                <span
                  key={channel}
                  className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] ${
                    inactive
                      ? "border-border bg-muted/40 text-muted-foreground"
                      : "border-blue-500/20 bg-blue-500/10 text-blue-400"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${inactive ? "bg-muted-foreground" : "bg-blue-400"}`} />
                  {channel}
                </span>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-6">
        <a
          href={`mailto:info@lumitera.ru?subject=${encodeURIComponent(`Заявка на подключение "${name}"`)}&body=${encodeURIComponent(getEmailBody(name))}`}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-blue-500 bg-blue-500/10 px-6 py-3 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/20"
        >
          Начать
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

function getEmailBody(packageName: string): string {
  const bodies: Record<string, string> = {
    "Старт": "Здравствуйте!\n\nХочу подключить пакет «Старт». Расскажите подробнее о процессе внедрения и сроках.\n\nСпасибо!",
    "Рост": "Здравствуйте!\n\nИнтересует пакет «Рост». Хотел бы узнать детали и обсудить подключение.\n\nСпасибо!",
    "Система": "Здравствуйте!\n\nРассматриваю пакет «Система» для нашего бизнеса. Готов обсудить детали внедрения.\n\nСпасибо!",
  }
  return bodies[packageName] || "Здравствуйте!\n\nХочу узнать подробнее о ваших услугах.\n\nСпасибо!"
}

export default function PricingCards() {
  const mainPlans: PricingCardProps[] = [
    {
      badge: "Малый бизнес",
      name: "Старт",
      price: "10 000 ₽",
      priceSubtext: "+ 5 000 ₽/мес",
      subtitle: "Включает настройку и запуск",
      promo: "1 месяц подписки бесплатно",
      calculation: "50 заявок/день, 8 сообщений → ≈6 000 ₽/мес",
      topLabel: "Трафик -50%",
      topLabelTone: "amber",
      icon: <Rocket className="w-5 h-5" />,
      channels: startChannels,
      channelInactive: ["Instagram"],
      features: [
        { text: "AI-агент отвечает 24/7, не теряет заявки", highlight: true },
        { text: "3 канала на выбор" },
        { text: "Менеджер получает только горячих клиентов" },
        { text: "Все лиды в одной таблице" },
        { text: "Уведомление менеджеру о новом лиде" },
        { text: "Аналитика: дашборд обращений и источников" },
        { text: "Живой диалог" },
        { text: "Гибкая логика работы агента" },
        { text: "Агент адаптируется под создание записи/сделки без прямой интеграции" },
      ],
    },
    {
      badge: "Растущий бизнес",
      name: "Рост",
      price: "20 000 ₽",
      priceSubtext: "+ 10 000 ₽/мес",
      subtitle: "Включает настройку и запуск",
      promo: "1 месяц подписки бесплатно",
      calculation: "50 заявок/день, 8 сообщений → ≈6 000 ₽/мес",
      calculationBorder: true,
      topLabel: "Популярный выбор",
      topLabelTone: "blue",
      isPopular: true,
      icon: <Sparkles className="w-5 h-5" />,
      channels: growthChannels,
      features: [
        { text: "Всё из Старта, плюс", highlight: true },
        { text: "5 каналов на выбор" },
        { text: "Приоритет лида: высокий / средний / низкий" },
        { text: "Автозапись в Google и Яндекс Календарь" },
        { text: "AI знает ваш продукт, консультирует 24/7" },
        { text: "Полная аналитика: дашборд, воронка, KPI" },
        { text: "Записи / События создаются автоматически в CRM" },
        { text: "Перенос и отмена записи клиентом (синхронизация с CRM)" },
        { text: "CRM интеграция" },
      ],
    },
    {
      badge: "Крупный бизнес",
      name: "Система",
      price: "40 000 ₽",
      priceSubtext: "+ 20 000 ₽/мес",
      subtitle: "Включает настройку и запуск",
      promo: "1 месяц подписки бесплатно",
      calculation: "50 заявок/день, 8 сообщений → ≈6 000 ₽/мес",
      calculationBorder: true,
      topLabel: "Максимум возможностей",
      topLabelTone: "green",
      icon: <Crown className="w-5 h-5" />,
      channels: systemChannels,
      features: [
        { text: "Всё из Роста, плюс", highlight: true },
        { text: "8 каналов (все возможные)" },
        { text: "AI-менеджер: продаёт, отрабатывает возражения" },
        { text: "Сделки создаются автоматически в CRM" },
        { text: "Агент фиксирует условия сделки" },
        { text: "Умная маршрутизация на менеджера" },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* БЕСПЛАТНЫЙ ТЕСТ */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5">
            <Gift className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-semibold text-sm">1000 ответов AI бесплатно</span>
          </div>

          <h2 className="text-3xl font-bold text-foreground">
            Попробуйте AI-агента{" "}
            <span className="text-blue-400">бесплатно</span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Первые 1000 ответов в Telegram — за наш счёт. Никаких рисков, просто проверьте как это работает.
          </p>

          <a
            href="mailto:info@lumitera.ru?subject=Попробовать%20бесплатно&body=Здравствуйте!%20Заинтересовала%20возможность%20протестировать%20AI-агента.%20Хочу%20получить%201000%20бесплатных%20ответов%20в%20Telegram."
            className="inline-flex items-center gap-2 rounded-full border border-blue-500 bg-blue-500/10 px-7 py-3 text-base font-semibold text-blue-400 transition hover:bg-blue-500/20"
          >
            Попробовать бесплатно
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* ТАРИФЫ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainPlans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>

      {/* ИНТЕГРАЦИИ */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Интеграции</h2>
            <p className="text-sm text-muted-foreground">Подключаемся ко всем популярным платформам</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Каналы</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {integrationChannels.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">CRM</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Yclients", "Bitrix24", "amoCRM", "МойСклад", "Fitbase", "и другие по запросу"].map((item) => {
                  const isOther = item === "и другие по запросу"
                  return (
                    <span key={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground">
                      {!isOther && <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />}
                      {item}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ЧТО ВХОДИТ В ПОДПИСКУ */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-3">Что входит в подписку?</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Постоянная работа системы, обновления и поддержка — без вашего участия
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-8">
            {[
              { icon: <Monitor className="w-5 h-5" />, title: "Система", items: ["Бесперебойная работа AI-агента 24/7", "Хостинг, резервные копии, мониторинг", "Автовосстановление при сбоях"] },
              { icon: <Cpu className="w-5 h-5" />, title: "AI и обновления", items: ["Обновление модели при выходе новых версий", "Дообучение на данных вашего бизнеса", "Исправление ошибок и сбоев"] },
              { icon: <BarChart3 className="w-5 h-5" />, title: "Аналитика", items: ["Дашборд обращений и воронки в реальном времени", "История всех диалогов и лидов", "Мониторинг зависших сделок"] },
              { icon: <Settings className="w-5 h-5" />, title: "Настройка", items: ["Корректировки скриптов и сценариев", "Настройка логики маршрутизации при росте команды", "Подключение новых каналов по запросу"] },
              { icon: <Link className="w-5 h-5" />, title: "Интеграции", items: ["Обновление интеграций при изменениях API", "Синхронизация с CRM и календарями", "Хранение и резервирование данных клиентов"] },
              { icon: <Shield className="w-5 h-5" />, title: "Поддержка", items: ["Техподдержка по email и Telegram", "Ответ до 8 ч, приоритет для Системы — 2 ч", "Соответствие 152-ФЗ, уведомления о работах"] },
            ].map((section) => (
              <div key={section.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-blue-400">{section.icon}</div>
                  <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 mt-0.5 text-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Переход между пакетами */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Переход между пакетами</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { from: "Старт", to: "Рост", price: "10 000", oldPrice: "20 000", save: "10 000" },
                { from: "Рост", to: "Система", price: "20 000", oldPrice: "40 000", save: "20 000" },
                { from: "Старт", to: "Система", price: "30 000", oldPrice: "40 000", save: "10 000" },
              ].map((item) => (
                <div key={`${item.from}-${item.to}`} className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">{item.from} → {item.to}</p>
                  <p className="text-xl font-semibold text-foreground">{item.price} ₽ вместо {item.oldPrice} ₽</p>
                  <p className="text-sm text-emerald-400">экономия {item.save} ₽</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* КОНТАКТЫ */}
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-2xl font-bold text-foreground">Остались вопросы?</h2>
          <p className="text-muted-foreground text-base">Напишите нам — подберём решение под ваш бизнес</p>
          <div className="inline-flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3">
            <span className="text-xs text-muted-foreground">Сроки внедрения:</span>
            <span className="text-sm text-foreground font-medium">7–21 день</span>
          </div>
          <div>
            <a
              href="mailto:info@lumitera.ru"
              className="inline-flex items-center gap-2 rounded-full border border-blue-500 bg-blue-500/10 px-7 py-3 text-lg font-semibold text-blue-400 transition hover:bg-blue-500/20"
            >
              Написать нам
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
