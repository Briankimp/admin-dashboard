"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "super_admin" | "event_manager"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Start with loading true
  const [isInitialized, setIsInitialized] = useState(false)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to get from localStorage (client-side)
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("user")

          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser)
              setUser(parsedUser)

              // Also ensure cookie is set
              document.cookie = `user=${encodeURIComponent(storedUser)}; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
            } catch (e) {
              console.error("Error parsing stored user:", e)
              localStorage.removeItem("user") // Clear invalid data
            }
          } else {
            // If no user in localStorage, check cookies
            const cookies = document.cookie.split(";")
            const userCookie = cookies.find((cookie) => cookie.trim().startsWith("user="))

            if (userCookie) {
              const userValue = userCookie.split("=")[1]
              if (userValue) {
                try {
                  const parsedUser = JSON.parse(decodeURIComponent(userValue))
                  setUser(parsedUser)
                  // Also set in localStorage for future use
                  localStorage.setItem("user", JSON.stringify(parsedUser))
                } catch (e) {
                  console.error("Error parsing user cookie:", e)
                  // Clear invalid cookie
                  document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      } finally {
        setIsLoading(false)
        setIsInitialized(true)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email with password "password"
      if (password === "password") {
        const newUser = {
          id: "1",
          name: email.split("@")[0],
          email,
          role: "super_admin" as const,
        }

        // Set user in state
        setUser(newUser)

        // Store in localStorage
        if (typeof window !== "undefined") {
          const userString = JSON.stringify(newUser)
          localStorage.setItem("user", userString)

          // Also set in cookie for server-side access
          document.cookie = `user=${encodeURIComponent(userString)}; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
        }

        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear user from state
    setUser(null)

    // Clear from localStorage and cookies
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isInitialized }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

