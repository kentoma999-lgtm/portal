export async function POST(request) {
  try {
    // 1. Берем аудио от браузера
    const formData = await request.formData();
    
    // 2. Отправляем его в n8n (сервер-к-серверу, CORS не существует)
    const response = await fetch('https://n8n.lumitera.online/webhook/voice-agent', {
      method: 'POST',
      headers: {
        'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET || '',
      },
      body: formData,
    });

    // Если n8n вернул ошибку, выводим её в консоль, чтобы мы её видели
    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n Error:', response.status, errorText);
      return new Response(errorText, { status: response.status });
    }

    // 3. Получаем готовый MP3 от n8n и отдаем браузеру
    const blob = await response.blob();
    return new Response(blob, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('Voice API Error:', error);
    return new Response('Ошибка сервера', { status: 500 });
  }
}