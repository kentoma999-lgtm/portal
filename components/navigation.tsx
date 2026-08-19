"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, User, CreditCard, LogOut, LogIn, Sparkles, Bell, Check, Shield, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

interface Notification {
  type: string
  message: string
}

interface DashboardResponse {
  notifications?: Notification[]
  limits?: unknown
  [key: string]: unknown
}

// Публичное меню (для незалогиненных)
const publicNavItems = [
  { href: "/", label: "Главная", icon: Sparkles },
  { href: "/pricing", label: "Тарифы", icon: CreditCard },
  { href: "/cases", label: "Кейсы", icon: Briefcase },
  { href: "/agreements", label: "Соглашения", icon: Shield },
]

// Внутреннее меню (для залогиненных)
const navItems = [
  { href: "/", label: "Главная", icon: Sparkles },
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/account", label: "Личный кабинет", icon: User },
  { href: "/pricing", label: "Тарифы", icon: CreditCard },
  { href: "/cases", label: "Кейсы", icon: Briefcase },
  { href: "/agreements", label: "Соглашения", icon: Shield },
]

function NotificationsBell() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [read, setRead] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.key) return
      setIsLoading(true)
      try {
        const response = await fetch("/api/portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: user.key }),
        })
        if (!response.ok) throw new Error("Failed to fetch notifications")
        const data: DashboardResponse = await response.json()
        setNotifications(data.notifications || [])
        setRead([])
      } catch (error) {
        console.error("Notifications fetch error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [user?.key])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleReadNotification = (index: number) => { setRead([...read, index]) }

  const visibleNotifications = notifications
    .map((notification, index) => ({ notification, originalIndex: index }))
    .filter(({ originalIndex }) => !read.includes(originalIndex))

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "traffic_low": case "subscription_ending": case "minutes_low":
        return "border-l-4 border-[#f59e0b]"
      case "traffic_empty": case "subscription_expired": case "minutes_empty":
        return "border-l-4 border-[#ef4444]"
      default:
        return "border-l-4 border-[#00ccff]"
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}
        className="text-muted-foreground hover:text-[#60a5fa] hover:bg-[rgba(59,130,246,0.15)] relative">
        <Bell className="w-4 h-4" />
        {read.length < notifications.length && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">
              {isLoading ? "Загрузка..." : visibleNotifications.length > 0 ? "Уведомления" : "Нет уведомлений"}
            </h3>
          </div>
          {visibleNotifications.length > 0 ? (
            <div className="divide-y divide-border">
              {visibleNotifications.map(({ notification, originalIndex }) => (
                <div key={originalIndex}
                  className={`p-3 text-sm flex items-center justify-between gap-3 ${getNotificationColor(notification.type)}`}>
                  <p className="text-foreground font-medium flex-1">{notification.message}</p>
                  <Button size="sm" variant="ghost" onClick={() => handleReadNotification(originalIndex)}
                    className="h-6 w-6 p-0 bg-transparent text-muted-foreground hover:text-[#60a5fa] hover:bg-[rgba(59,130,246,0.15)] flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {isLoading ? "Загрузка..." : "Все хорошо, уведомлений нет"}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Navigation() {
  const pathname = usePathname()
  const { logout, isAuthenticated } = useAuth()
  const items = isAuthenticated ? navItems : publicNavItems

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-cyan-400 flex items-center justify-center shadow-sm shadow-primary/20">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground hidden sm:block">Lumitera</span>
          </Link>

          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {items.map((item) => {
                const isActive = pathname === item.href
                const isDisabled = "disabled" in item && item.disabled
                if (isDisabled) {
                  return (
                    <div key={item.href}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground/50 cursor-not-allowed relative">
                      <item.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-black px-1.5 py-0.5 rounded-full">Новое</span>
                    </div>
                  )
                }
                return (
                  <Link key={item.href} href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}>
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {isAuthenticated && <NotificationsBell />}

            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={logout}
                className="text-muted-foreground hover:text-[#60a5fa] hover:bg-[rgba(59,130,246,0.15)] ml-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Выйти</span>
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm"
                  className="text-muted-foreground hover:text-[#60a5fa] hover:bg-[rgba(59,130,246,0.15)] ml-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Войти</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}