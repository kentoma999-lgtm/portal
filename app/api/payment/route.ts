import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { amount, key, type } = body

  const shopId = process.env.YOOKASSA_SHOP_ID
  const secretKey = process.env.YOOKASSA_SECRET_KEY

  if (!shopId || !secretKey) {
    return NextResponse.json({ error: "Payment is not configured" }, { status: 500 })
  }

  const idempotenceKey = key + "_" + Date.now()

  const paymentData: any = {
    amount: {
      value: amount.toFixed(2),
      currency: "RUB"
    },
    capture: true,
    confirmation: {
      type: "redirect",
      return_url: process.env.YOOKASSA_RETURN_URL || "https://lumitera.ru/account"
    },
    description: type === "subscription" ? "Оплата подписки Lumitera" : "Пополнение трафика Lumitera",
    metadata: {
      client_key: key,
      type: type
    }
  }

  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(shopId + ":" + secretKey),
        "Idempotence-Key": idempotenceKey
      },
      body: JSON.stringify(paymentData)
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Payment creation failed" }, { status: 500 })
  }
}