"use client"

import { useEffect, useRef, useState } from "react"

export function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Страховка: контент всегда появится, даже если наблюдатель не сработает
    const fallback = window.setTimeout(() => setVisible(true), 1500)

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return () => window.clearTimeout(fallback)
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.unobserve(el)
          window.clearTimeout(fallback)
        }
      },
      { threshold: 0.1 }
    )

    obs.observe(el)
    return () => {
      obs.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="scroll-reveal"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease-out, transform 0.6s ease-out`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}