"use client"

import { Check, Star, Phone, Headphones } from "lucide-react"

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
  headline: string
  calculation: string
  features: PricingFeature[]
  isPopular?: boolean
  isAddon?: boolean
  icon?: React.ReactNode
}

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
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 h-full ${
        isPopular
          ? "bg-gradient-to-b from-card to-card border-2 border-transparent bg-clip-padding"
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
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full text-xs font-semibold text-white flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          Популярный
        </div>
      )}

      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            isAddon
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-primary/20 text-primary"
          }`}
        >
          {badge}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        {icon}
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
          <p className="text-emerald-400 text-xs font-medium">{promo}</p>
        </div>
      )}

      <p className="text-foreground/90 text-sm font-medium mb-4 leading-relaxed">
        {headline}
      </p>

      <div className="bg-muted/50 rounded-lg px-4 py-3 mb-6">
        <p className="text-xs text-muted-foreground">Пример расчёта:</p>
        <p className="text-sm text-foreground font-medium">{calculation}</p>
      </div>

      <div className="flex-1">
        <ul className="space-y-2.5">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  feature.highlight ? "text-emerald-400" : "text-primary"
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
    </div>
  )
}

export default function PricingCards() {
  const mainPlans: PricingCardProps[] = [
    {
      badge: "Малый бизнес",
      name: "Старт",
      price: "$150",
      priceSubtext: "+ $50/мес",
      subtitle: "Включает настройку и запуск",
      promo: "14 дней бесплатно, затем 1 мес подписки бесплатно",
      headline: "Отвечает на заявки в 23:00, когда менеджер спит",
      calculation: "15 заявок/день, 8 сообщений → ≈$18/мес",
      features: [
        { text: "AI-агент отвечает 24/7, не теряет заявки", highlight: true },
        { text: "Менеджер получает только горячих клиентов" },
        { text: "Все лиды в одной таблице" },
        { text: "3 канала на выбор" },
        { text: "Уведомление менеджеру о новом лиде" },
        { text: "Аналитика: дашборд обращений и источников" },
        { text: "Сбор: имя, контакт, запрос, бюджет" },
      ],
    },
    {
      badge: "Растущий бизнес",
      name: "Рост",
      price: "$450",
      priceSubtext: "+ $150/мес",
      subtitle: "Включает настройку и запуск",
      promo: "1 мес подписки бесплатно",
      headline: "Менеджер работает только с горячими клиентами",
      calculation: "50 заявок/день, 8 сообщений → ≈$60/мес",
      features: [
        { text: "Всё из Старта, плюс", highlight: true },
        { text: "AI сам спрашивает бюджет, сроки, потребности" },
        { text: "Приоритет лида: высокий / средний / низкий" },
        { text: "Автозапись в Google и Яндекс Календарь" },
        { text: "AI знает ваш продукт, консультирует 24/7" },
        { text: "7 каналов на выбор" },
        { text: "Полная аналитика: дашборд, воронка, KPI" },
        { text: "Поиск зависших записей: AI находит без движения" },
        { text: "Напоминание клиенту за день и за час" },
      ],
    },
    {
      badge: "Крупный бизнес",
      name: "Система",
      price: "$1350",
      priceSubtext: "+ $450/мес",
      subtitle: "Включает настройку и запуск",
      promo: "1 мес подписки бесплатно",
      headline: "Отдел продаж работает 24/7",
      calculation: "200 заявок/день, 8 сообщений → ≈$240/мес",
      features: [
        { text: "Всё из Роста, плюс", highlight: true },
        { text: "AI-менеджер: продаёт, отрабатывает возражения" },
        { text: "Сделки создаются автоматически в CRM" },
        { text: "CRM: AmoCRM, Bitrix24, Twenty" },
        { text: "Умная маршрутизация на менеджера" },
        { text: "15 каналов на выбор" },
        { text: "Поиск зависших сделок: AI находит и дожимает" },
      ],
    },
  ]

  const addons: PricingCardProps[] = [
    {
      badge: "Бизнес с растущей базой клиентов",
      name: "AI Support",
      price: "$190",
      priceSubtext: "/мес",
      subtitle: "Подключается к любому пакету или отдельно",
      headline: "AI-поддержка клиентов 24/7 после покупки",
      calculation: "100 обращений/день, 5 сообщений → ≈$75/мес",
      isAddon: true,
      icon: <Headphones className="w-5 h-5 text-emerald-400" />,
      features: [
        { text: "AI-поддержка клиентов 24/7 после покупки", highlight: true },
        { text: "Разбирает жалобы, возвраты, сложные ситуации" },
        { text: "Решает проблемы без участия человека" },
        { text: "Эскалация на менеджера, если AI не справляется" },
        { text: "База знаний: продукт, цены, условия" },
        { text: "3 канала на выбор" },
        { text: "Отчёты: частые вопросы, причины, нагрузка" },
      ],
    },
    {
      badge: "Дополнение",
      name: "Телефония",
      price: "$290",
      priceSubtext: "+ $0.025/мин",
      subtitle: "Подключается к любому пакету",
      headline: "AI-анализ и контроль качества звонков",
      calculation: "50 звонков/день по 5 мин → ≈$188/мес",
      isAddon: true,
      icon: <Phone className="w-5 h-5 text-emerald-400" />,
      features: [
        { text: "Интеграция Sipuni или аналога", highlight: true },
        { text: "Запись всех звонков" },
        { text: "AI-расшифровка и анализ каждого разговора" },
        { text: "Резюме диалога после каждого звонка" },
        { text: "Контроль качества: скрипт, тон, возражения" },
        { text: "Оценка каждого звонка по чек-листу" },
        { text: "Автозаполнение CRM из транскрипта" },
      ],
    },
  ]

  console.log('PricingCards загружен v2', new Date().toLocaleTimeString());

  return (
    <div className="space-y-8">
      {/* Main Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainPlans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>

      {/* Addons */}
      <div className="pt-8">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
          Дополнительные модули
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {addons.map((addon, index) => (
            <PricingCard key={index} {...addon} />
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="pt-8">
        <div className="bg-card border border-border rounded-2xl p-6 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Остались вопросы?
            </h2>
            <p className="text-muted-foreground text-base mb-6">
              Напишите нам — подберём решение под ваш бизнес
            </p>

            <div className="bg-muted/50 rounded-lg px-4 py-4 mb-6">
              <p className="text-xs text-muted-foreground mb-2">Email</p>
              <span className="font-semibold text-sm text-foreground">info@lumitera.ru</span>
            </div>

            <div className="bg-muted/50 rounded-lg px-4 py-4 mb-6">
              <p className="text-xs text-muted-foreground mb-2">
                Сроки внедрения
              </p>
              <p className="text-sm text-foreground font-medium">
                7–21 день в зависимости от пакета и количества каналов
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
