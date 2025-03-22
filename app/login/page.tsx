"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// MUTCU Logo component
function MUTCULogo() {
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 grid-rows-2 w-16 h-16 rounded-lg overflow-hidden">
        <div className="bg-accent"></div>
        <div className="bg-secondary"></div>
        <div className="bg-primary"></div>
        <div className="bg-highlight"></div>
      </div>
      <h1 className="text-2xl font-bold mt-2">MUTCU</h1>
    </div>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [redirecting, setRedirecting] = useState(false)
  const { user, login, isLoading, isInitialized } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (isInitialized && user && !redirecting) {
      setRedirecting(true)
      router.push("/dashboard")
    }
  }, [user, router, isInitialized, redirecting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    }
  }

  // Show loading state while checking auth
  if (isLoading || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait</p>
        </div>
      </div>
    )
  }

  // Don't render if already logged in
  if (user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Redirecting to dashboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="grid grid-cols-4 h-1">
          <div className="bg-accent h-full"></div>
          <div className="bg-secondary h-full"></div>
          <div className="bg-primary h-full"></div>
          <div className="bg-highlight h-full"></div>
        </div>
        <CardHeader className="space-y-1 pt-6">
          <div className="mx-auto mb-4">
            <MUTCULogo />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-primary">Admin Dashboard</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@mutcu.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-200 focus-visible:ring-primary"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-200 focus-visible:ring-primary"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p className="w-full">For demo purposes, use any email with password: "password"</p>
        </CardFooter>
      </Card>
    </div>
  )
}

