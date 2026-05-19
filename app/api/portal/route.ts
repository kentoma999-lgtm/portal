import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch('https://n8n.lumitera.online/webhook/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Portal API error:', error)
    return NextResponse.json(
      { error: 'Ошибка подключения' },
      { status: 500 }
    )
  }
}
