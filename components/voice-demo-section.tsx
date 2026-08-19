"use client"

import { useState, useRef } from "react"
import { Mic, Square, Loader2, Volume2, RotateCcw, Sparkles } from "lucide-react"

export function VoiceDemoSection() {
  const [status, setStatus] = useState<"idle" | "recording" | "processing" | "done" | "error">("idle")
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [statusText, setStatusText] = useState("Нажмите на микрофон и задайте любой вопрос")
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = () => {
        setStatus("idle")
        setStatusText("Запись завершена. Нажмите 'Получить ответ'")
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorderRef.current.start()
      setStatus("recording")
      setStatusText("Говорите... AI слушает вас")
      setAudioUrl(null)
    } catch (err) {
      setStatus("error")
      setStatusText("Разрешите доступ к микрофону в настройках браузера")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }

  const sendAudio = async () => {
    setStatus("processing")
    setStatusText("AI обрабатывает ваш запрос...")

    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
    const formData = new FormData()
    formData.append("data", audioBlob, "voice.wav")

    try {
      const response = await fetch("/api/voice-agent", { method: "POST", body: formData })
      
      if (response.ok) {
        const audioResponse = await response.blob()
        const url = URL.createObjectURL(audioResponse)
        setAudioUrl(url)
        setStatus("done")
        setStatusText("Готово! Послушайте ответ AI-агента:")
      } else {
        setStatus("error")
        setStatusText("Ошибка обработки. Попробуйте ещё раз.")
      }
    } catch (err) {
      setStatus("error")
      setStatusText("Ошибка сети. Проверьте подключение.")
    }
  }

  const reset = () => {
    setAudioUrl(null)
    audioChunksRef.current = []
    setStatus("idle")
    setStatusText("Нажмите на микрофон и задайте любой вопрос")
  }

  return (
    <section className="px-4 py-16 md:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Заголовок секции */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
            <Sparkles className="h-4 w-4" />
            Живое демо
          </div>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            Послушайте, как работает{" "}
            <span className="text-blue-400">AI-менеджер</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Задайте любой вопрос голосом — получите ответ за 3 секунды
          </p>
        </div>

        {/* Карточка виджета */}
        <div className="rounded-3xl border border-dashed border-border/80 bg-card/70 p-6 backdrop-blur md:p-10">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-6 md:p-8">
            
            {/* Статус */}
            <div className={`mb-6 rounded-xl border p-4 text-center transition-all ${
              status === "recording" ? "border-red-500/30 bg-red-500/10" :
              status === "processing" ? "border-yellow-500/30 bg-yellow-500/10" :
              status === "done" ? "border-green-500/30 bg-green-500/10" :
              status === "error" ? "border-red-500/30 bg-red-500/10" :
              "border-border/70 bg-muted/50"
            }`}>
              <div className="flex items-center justify-center gap-2">
                {status === "recording" && (
                  <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                )}
                {status === "processing" && (
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
                )}
                {status === "done" && (
                  <Volume2 className="h-4 w-4 text-green-400" />
                )}
                {status === "error" && (
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                )}
                <span className={`text-sm font-medium ${
                  status === "recording" ? "text-red-400" :
                  status === "processing" ? "text-yellow-400" :
                  status === "done" ? "text-green-400" :
                  status === "error" ? "text-red-400" :
                  "text-muted-foreground"
                }`}>
                  {statusText}
                </span>
              </div>
            </div>

            {/* Кнопки управления */}
            <div className="flex flex-col gap-3 sm:flex-row">
              {status === "idle" && (
                <button
                  onClick={startRecording}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-blue-500 bg-blue-500/10 px-6 py-3 text-base font-semibold text-blue-400 transition hover:bg-blue-500/20"
                >
                  <Mic className="h-5 w-5" />
                  Начать запись
                </button>
              )}

              {status === "recording" && (
                <button
                  onClick={stopRecording}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-red-500 bg-red-500/10 px-6 py-3 text-base font-semibold text-red-400 transition hover:bg-red-500/20"
                >
                  <Square className="h-5 w-5 fill-current" />
                  Остановить
                </button>
              )}

              {status === "idle" && audioChunksRef.current.length > 0 && !audioUrl && (
                <button
                  onClick={sendAudio}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-green-500 bg-green-500/10 px-6 py-3 text-base font-semibold text-green-400 transition hover:bg-green-500/20"
                >
                  <Volume2 className="h-5 w-5" />
                  Получить ответ
                </button>
              )}

              {status === "done" && (
                <button
                  onClick={reset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/50 px-6 py-3 text-base font-semibold text-muted-foreground transition hover:bg-background/80"
                >
                  <RotateCcw className="h-5 w-5" />
                  Записать заново
                </button>
              )}

              {status === "error" && (
                <button
                  onClick={reset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/50 px-6 py-3 text-base font-semibold text-muted-foreground transition hover:bg-background/80"
                >
                  <RotateCcw className="h-5 w-5" />
                  Попробовать снова
                </button>
              )}
            </div>

            {/* Аудиоплеер */}
            {audioUrl && (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="rounded-xl border border-border/70 bg-muted/50 p-4">
                  <audio src={audioUrl} controls autoPlay className="w-full" />
                </div>
              </div>
            )}

            {/* Подсказка */}
            <div className="mt-6 flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-muted-foreground">
              <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
              <span>
                Попробуйте спросить: <span className="font-medium text-blue-400">"Здравствуйте, расскажите про ваши услуги и цены"</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}