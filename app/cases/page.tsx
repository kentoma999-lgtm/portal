"use client"

import { useState } from "react"
import { Building2, Scissors, GraduationCap, ChevronRight, X, ArrowRight, Sparkles } from "lucide-react"

type CaseBlock = 
  | { type: "label"; content: string; value: string }
  | { type: "heading"; content: string }
  | { type: "subheading"; content: string }
  | { type: "text"; content: string }
  | { type: "list"; items: string[] }

interface CaseItem {
  id: string
  icon: React.ReactNode
  category: string
  title: string
  short: string
  package: string
  color: string
  bgLight: string
  borderLight: string
  textColor: string
  full: CaseBlock[]
}

const cases: CaseItem[] = [
  {
    id: "realestate",
    icon: <Building2 className="w-5 h-5" />,
    category: "Агентство недвижимости",
    title: "Как AI-агент заменил 3 менеджеров по аренде и увеличил конверсию в просмотры на 40%",
    short: "Агентство элитной недвижимости подключило AI-агента для обработки заявок с Avito. Теперь 100% обращений получают ответ за считанные секунды 24/7.",
    package: "Система",
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-500/10",
    borderLight: "border-violet-500/20",
    textColor: "text-violet-400",
    full: [
      { type: "label", content: "Пакет", value: "Система" },
      { type: "label", content: "Каналы", value: "Avito Бизнес, WhatsApp, Telegram, Чат на сайте" },
      { type: "heading", content: "Задача" },
      { type: "text", content: "Агентство элитной недвижимости получало 150+ заявок в день с Avito. Три менеджера не справлялись с потоком: до 40% обращений оставались без ответа, особенно в нерабочее время." },
      { type: "heading", content: "Решение" },
      { type: "text", content: "Внедрили AI-агента на пакете Система." },
      { type: "subheading", content: "Агент" },
      { type: "list", items: [
        "Отвечает на все заявки за 10–50 секунд 24/7",
        "Квалифицирует лид: бюджет, район, тип недвижимости, сроки",
        "Сам записывает на просмотр в Google Календарь",
        "Отрабатывает возражения и помогает с выбором",
        "Создаёт сделки автоматически в Bitrix24",
        "Маршрутизирует горячих клиентов на нужного риелтора",
      ]},
      { type: "heading", content: "Результат за 2 месяца" },
      { type: "list", items: [
        "100% заявок получают ответ за считанные секунды",
        "+40% конверсия в просмотры",
        "Менеджеры работают только с горячими клиентами",
        "Экономия 180+ часов ручной работы в месяц",
        "Окупаемость — 14 дней",
      ]},
    ],
  },
  {
    id: "beauty",
    icon: <Scissors className="w-5 h-5" />,
    category: "Салон красоты",
    title: "Как сеть салонов красоты автоматизировала запись и сократила нагрузку на администраторов",
    short: "Сеть из 5 салонов красоты внедрила AI-агента для записи клиентов. Клиенты записываются сами, а администраторы наконец выдохнули.",
    package: "Рост",
    color: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-500/10",
    borderLight: "border-pink-500/20",
    textColor: "text-pink-400",
    full: [
      { type: "label", content: "Пакет", value: "Рост" },
      { type: "label", content: "Каналы", value: "Instagram, WhatsApp, Telegram, VK" },
      { type: "heading", content: "Задача" },
      { type: "text", content: "Сеть из 5 салонов красоты получала 80+ заявок в день через соцсети и мессенджеры. Администраторы тратили часы на ответы, запись и подтверждение. Ведение календаря вручную отнимало уйму времени." },
      { type: "heading", content: "Решение" },
      { type: "text", content: "Внедрили AI-агента на пакете Рост." },
      { type: "subheading", content: "Агент" },
      { type: "list", items: [
        "Консультирует по услугам и ценам 24/7",
        "Сам записывает в Google и Яндекс Календарь — администрирование занимает в разы меньше времени",
        "Собирает контакты, запросы, пожелания",
      ]},
      { type: "heading", content: "Результат за 1 месяц" },
      { type: "list", items: [
        "100% заявок обрабатываются автоматически",
        "Администраторы освободили 4 часа в день",
        "Окупаемость — 7 дней",
      ]},
    ],
  },
  {
    id: "edtech",
    icon: <GraduationCap className="w-5 h-5" />,
    category: "Онлайн-школа",
    title: "Как онлайн-школа автоматизировала ответы на вопросы и перестала терять заявки",
    short: "Онлайн-школа digital-профессий внедрила AI-агента на Старте для информирования о курсах и сбора контактов. Теперь на все заявки отвечают мгновенно, а менеджеры получают только тёплые лиды.",
    package: "Старт",
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-500/10",
    borderLight: "border-emerald-500/20",
    textColor: "text-emerald-400",
    full: [
      { type: "label", content: "Пакет", value: "Старт" },
      { type: "label", content: "Каналы", value: "VK, Telegram, Instagram" },
      { type: "heading", content: "Задача" },
      { type: "text", content: "Онлайн-школа digital-профессий получала 150+ заявок в месяц из соцсетей и мессенджеров. Менеджер тратил до 6 часов в день на ответы: какие курсы, цены, как записаться. Часть заявок терялась в нерабочее время." },
      { type: "heading", content: "Решение" },
      { type: "text", content: "Внедрили AI-агента на пакете Старт для информирования и сбора контактов." },
      { type: "subheading", content: "Агент" },
      { type: "list", items: [
        "Рассказывает о курсах, ценах, форматах обучения 24/7",
        "Отвечает на простые вопросы и собирает контакты",
        "Передаёт тёплые заявки менеджеру",
      ]},
      { type: "heading", content: "Результат за 1 месяц" },
      { type: "list", items: [
        "Время ответа — с 6 часов до нескольких секунд",
        "Ни одна заявка не потеряна",
        "Менеджер получает только заинтересованных клиентов",
        "Экономия 100+ часов в месяц",
        "Окупаемость — 7 дней",
      ]},
    ],
  },
]

function CaseModal({ caseData, onClose }: { caseData: CaseItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className={`relative overflow-hidden rounded-t-2xl bg-gradient-to-r ${caseData.color} px-6 md:px-8 py-8`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <span className="text-white">{caseData.icon}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/80">{caseData.category}</span>
              <h2 className="text-xl md:text-2xl font-bold text-white mt-1 leading-snug">{caseData.title}</h2>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-8 py-6 space-y-4">
          {caseData.full.map((block, i) => {
            switch (block.type) {
              case "label":
                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground">{block.content}:</span>
                    <span className="text-muted-foreground">{block.value}</span>
                  </div>
                )
              case "heading":
                return (
                  <h3 key={i} className="text-base font-bold text-foreground pt-2 flex items-center gap-2">
                    <Sparkles className={`w-4 h-4 ${caseData.textColor}`} />
                    {block.content}
                  </h3>
                )
              case "subheading":
                return (
                  <h4 key={i} className="text-sm font-bold text-foreground">{block.content}</h4>
                )
              case "text":
                return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{block.content}</p>
              case "list":
                return (
                  <ul key={i} className="space-y-1.5">
                    {block.items.map((item, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gradient-to-br ${caseData.color}`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              default:
                return null
            }
          })}
        </div>

        <div className="px-6 md:px-8 pb-8">
          <div className={`rounded-2xl bg-gradient-to-br ${caseData.bgLight} border ${caseData.borderLight} p-6 text-center`}>
            <p className="text-foreground font-semibold mb-3">Хотите такой же результат для вашего бизнеса?</p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-base font-semibold text-black transition hover:bg-yellow-300 shadow-md"
            >
              Посмотреть тарифы
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CasesPage() {
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">Кейсы</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Узнайте, как AI-агенты Lumitera помогают автоматизировать бизнес
          </p>
        </div>

        <div className="mb-8 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-amber-400">Пилотные проекты</span> — мы подготовили примеры на основе возможностей продукта.
          </p>
          <p className="text-sm text-muted-foreground">
            Реальные кейсы с подтверждёнными цифрами появятся здесь после первых внедрений.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cases.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border ${item.borderLight} bg-card p-6 flex flex-col hover:shadow-lg transition-all cursor-pointer group`}
              onClick={() => setSelectedCase(item)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}>
                  <span className="text-white">{item.icon}</span>
                </div>
                <span className={`text-xs font-medium ${item.textColor} uppercase tracking-wider`}>{item.category}</span>
              </div>

              <h3 className="text-foreground font-semibold mb-2 leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-4 flex-1 leading-relaxed">
                {item.short}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.bgLight} ${item.textColor}`}>
                  {item.package}
                </span>
                <button className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                  Читать
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Будущие кейсы */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Результаты клиентов</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xl mx-auto whitespace-nowrap">
            Здесь будут реальные истории внедрения Lumitera с подтверждёнными цифрами и отзывами.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground/50 cursor-not-allowed bg-muted/20">
            <span>Скоро</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white px-1.5 py-0.5 rounded-full">
              Ожидайте
            </span>
          </div>
        </div>
      </div>

      {selectedCase && (
        <CaseModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
      )}
    </main>
  )
}