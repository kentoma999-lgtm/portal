import { NextResponse } from "next/server"

const FALLBACK_RATE = 80
const COMMISSION = 1.1047 // 1 + 0.06 (НПД) + 0.043 (ЮKassa с НДС)

export async function GET() {
  try {
    const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js", {
      next: { revalidate: 3600 },
    })
    
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate")
    }
    
    const data = await response.json()
    const rate = data.Valute?.USD?.Value || FALLBACK_RATE
    
    // Цена за сообщение: Старт = 0.0025$, Рост/Система = 0.005$
    // Формула: (курс + 20) × цена_в_долларах × COMMISSION
    const messagePriceStart = Math.round((rate + 20) * 0.0025 * COMMISSION * 100) / 100
    const messagePriceGrowth = Math.round((rate + 20) * 0.005 * COMMISSION * 100) / 100
    const messagePriceSystem = Math.round((rate + 20) * 0.005 * COMMISSION * 100) / 100
    
    return NextResponse.json({
      rate: rate,
      messagePrice: messagePriceGrowth, // для обратной совместимости
      messagePriceStart: messagePriceStart,
      messagePriceGrowth: messagePriceGrowth,
      messagePriceSystem: messagePriceSystem,
      updated: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      source: "ЦБ РФ"
    })
  } catch (error) {
    console.error("Error fetching currency rate:", error)
    const fp = Math.round((FALLBACK_RATE + 20) * 0.005 * COMMISSION * 100) / 100
    const fps = Math.round((FALLBACK_RATE + 20) * 0.0025 * COMMISSION * 100) / 100
    return NextResponse.json({
      rate: FALLBACK_RATE,
      messagePrice: fp,
      messagePriceStart: fps,
      messagePriceGrowth: fp,
      messagePriceSystem: fp,
      updated: "fallback",
      source: "fallback"
    })
  }
}