import { NextResponse } from "next/server"

const FALLBACK_RATE = 90

export async function GET() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate")
    }
    
    const data = await response.json()
    
    if (data.rates?.RUB) {
      return NextResponse.json({
        rate: data.rates.RUB,
        updated: new Date().toLocaleTimeString("ru-RU", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        source: "exchangerate-api.com"
      })
    }
    
    throw new Error("RUB rate not found in response")
  } catch (error) {
    console.error("Error fetching currency rate:", error)
    return NextResponse.json({
      rate: FALLBACK_RATE,
      updated: "fallback",
      source: "fallback"
    })
  }
}
