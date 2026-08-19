import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()
  const { paymentId } = body

  const shopId = process.env.YOOKASSA_SHOP_ID
  const secretKey = process.env.YOOKASSA_SECRET_KEY

  if (!shopId || !secretKey) {
    return NextResponse.json({ error: "Payment is not configured" }, { status: 500 })
  }

  try {
    const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      method: "GET",
      headers: {
        "Authorization": "Basic " + btoa(shopId + ":" + secretKey)
      }
    })
    const data = await response.json()
    
    if (data.status === "succeeded") {
      await fetch("https://n8n.lumitera.online/webhook/payment-success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET || "",
        },
        body: JSON.stringify({
          client_key: data.metadata?.client_key,
          type: data.metadata?.type,
          amount: data.amount?.value,
          payment_id: data.id
        })
      })
      
      return NextResponse.json({ status: "succeeded", metadata: data.metadata, amount: data.amount })
    }
    
    return NextResponse.json({ status: data.status })
  } catch (error) {
    return NextResponse.json({ error: "Status check failed" }, { status: 500 })
  }
}