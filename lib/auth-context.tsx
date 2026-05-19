"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

const SPREADSHEET_ID = "1bGiktD7_NCOF4-T_PZC6-NLihfAXx1qMPXf11dYsMUg"
const API_KEY = "AIzaSyBq0Tug_G7oaXgcJFXRUxgx4PAtONJW_Bw"

export interface UserData {
  key: string
  name: string
  company: string
  tariff: string
  modules: string
  balance_messages: number
  balance_minutes: number
  chart_1: string
  chart_2: string
  chart_3: string
  chart_4: string
  chart_5: string
  chart_6: string
  chart_7: string
  chart_8: string
  chart_9: string
  chart_10: string
}

interface AuthContextType {
  user: UserData | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (key: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "lumitera_user_data"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const fetchUserData = async (key: string): Promise<{ success: boolean; data?: UserData; error?: string }> => {
      try {
        const response = await fetch('/api/portal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ key })
        })

        if (!response.ok) {
          return { success: false, error: "Ошибка подключения к базе данных" }
        }

        const data = await response.json()

        if (data.error) {
          return { success: false, error: "Неверный ключ доступа" }
        }

        // Save raw client data for other parts of the app if needed
        try {
          localStorage.setItem("clientData", JSON.stringify(data))
        } catch {}

        // Map received data to UserData (support both flat and nested `client` payloads)
        const src = data.client || data
        const userData: UserData = {
          key: src.key || key || "",
          name: src.name || "",
          company: src.company || "",
          tariff: src.tariff || "",
          modules: src.modules || "",
          balance_messages: parseFloat(src.balance_messages ?? 0) || 0,
          balance_minutes: parseFloat(src.balance_minutes ?? 0) || 0,
          chart_1: src.chart_1 || "",
          chart_2: src.chart_2 || "",
          chart_3: src.chart_3 || "",
          chart_4: src.chart_4 || "",
          chart_5: src.chart_5 || "",
          chart_6: src.chart_6 || "",
          chart_7: src.chart_7 || "",
          chart_8: src.chart_8 || "",
          chart_9: src.chart_9 || "",
          chart_10: src.chart_10 || "",
        }

        return { success: true, data: userData }
      } catch (error) {
      console.error("Error fetching user data:", error)
      return { success: false, error: "Ошибка сети. Попробуйте позже." }
    }
  }

  const login = async (key: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    const result = await fetchUserData(key)
    
    if (result.success && result.data) {
      setUser(result.data)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data))
      setIsLoading(false)
      return { success: true }
    }
    
    setIsLoading(false)
    return { success: false, error: result.error }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const refreshData = async () => {
    if (user?.key) {
      const result = await fetchUserData(user.key)
      if (result.success && result.data) {
        setUser(result.data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data))
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
      refreshData
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
