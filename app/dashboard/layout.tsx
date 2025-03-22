"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme-provider"
import {
  Users,
  Calendar,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Home,
  Church,
  BookOpen,
  Settings,
  HelpCircle,
  PieChart,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Breadcrumb } from "@/components/breadcrumb"
import { QuickNav } from "@/components/quick-nav"

interface SidebarItem {
  title: string
  href: string
  icon: React.ElementType
  role?: string[]
  description: string
  color?: "primary" | "secondary" | "accent" | "highlight"
}

// Update the sidebarItems array with MUTCU logo colors
const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: PieChart,
    description: "Overview of all activities",
    color: "primary", // Navy blue
  },
  {
    title: "User Management",
    href: "/dashboard/users",
    icon: Users,
    role: ["super_admin"],
    description: "Manage user accounts and permissions",
    color: "secondary", // Teal
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: Calendar,
    description: "Schedule and manage church events",
    color: "accent", // Orange
  },
  {
    title: "Resources",
    href: "/dashboard/content",
    icon: BookOpen,
    description: "Manage documents and resources",
    color: "highlight", // Red
  },
  {
    title: "Feedback",
    href: "/dashboard/feedback",
    icon: MessageSquare,
    description: "View and respond to member feedback",
    color: "primary", // Navy blue
  },
  {
    title: "Ministry Team",
    href: "/dashboard/ministry",
    icon: Church,
    description: "Manage ministry members and roles",
    color: "secondary", // Teal
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    description: "Send and manage notifications",
    color: "accent", // Orange
  },
]

// Create a logo component that uses the MUTCU logo colors
function MUTCULogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid grid-cols-2 grid-rows-2 w-8 h-8 rounded overflow-hidden">
        <div className="bg-accent"></div>
        <div className="bg-secondary"></div>
        <div className="bg-primary"></div>
        <div className="bg-highlight"></div>
      </div>
      <span className="font-bold text-xl">MUTCU</span>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isLoading, isInitialized } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  // Only redirect once when authentication is confirmed to be missing
  useEffect(() => {
    if (isInitialized && !isLoading && !user && !redirecting) {
      setRedirecting(true)
      router.push("/login")
    }
  }, [user, router, isInitialized, isLoading, redirecting])

  // Show loading state while checking authentication
  if (isLoading || !isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we set up your dashboard</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h2 className="text-xl font-semibold">Redirecting to login...</h2>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const filteredItems = sidebarItems.filter((item) => !item.role || item.role.includes(user.role))

  // Get the current page item for breadcrumb
  const currentPageItem = sidebarItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))

  // Create breadcrumb segments
  const getBreadcrumbSegments = () => {
    // Start with dashboard
    const segments = [{ title: "Dashboard", href: "/dashboard", icon: <Home className="h-4 w-4" /> }]

    if (pathname === "/dashboard") {
      return segments
    }

    // Split the pathname into segments
    const pathSegments = pathname.split("/").filter(Boolean)

    // If we're in a known section from sidebarItems
    if (currentPageItem) {
      segments.push({
        title: currentPageItem.title,
        href: currentPageItem.href,
        icon: <currentPageItem.icon className={`h-4 w-4 text-${currentPageItem.color || "primary"}`} />,
        isActive: pathname === currentPageItem.href,
      })

      // If we're deeper than the main section
      if (pathSegments.length > 2) {
        // Add the final segment (e.g., "Edit" or an ID)
        const lastSegment = pathSegments[pathSegments.length - 1]
        const title = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ")

        segments.push({
          title,
          href: pathname,
          isActive: true,
        })
      }
    } else {
      // For unknown paths, just add each segment
      let currentPath = ""

      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`
        const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

        segments.push({
          title,
          href: currentPath,
          isActive: index === pathSegments.length - 1,
        })
      })
    }

    return segments
  }

  const breadcrumbSegments = getBreadcrumbSegments()

  // Map color names to actual Tailwind classes to avoid string interpolation issues
  const getColorClass = (type: string, color?: string) => {
    const colorMap: Record<string, Record<string, string>> = {
      text: {
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        highlight: "text-highlight",
      },
      bg: {
        primary: "bg-primary",
        secondary: "bg-secondary",
        accent: "bg-accent",
        highlight: "bg-highlight",
      },
      "bg-light": {
        primary: "bg-primary/10",
        secondary: "bg-secondary/10",
        accent: "bg-accent/10",
        highlight: "bg-highlight/10",
      },
      border: {
        primary: "border-primary",
        secondary: "border-secondary",
        accent: "border-accent",
        highlight: "border-highlight",
      },
    }

    return colorMap[type][color || "primary"] || colorMap[type]["primary"]
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:flex",
        )}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800 bg-primary text-primary-foreground">
          <MUTCULogo />
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? cn(getColorClass("bg", item.color), "text-white")
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md",
                    getColorClass("bg-light", item.color),
                    getColorClass("text", item.color),
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs text-muted-foreground hidden lg:inline-block">{item.description}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 space-y-1">
            <h3 className="px-3 text-xs font-medium text-muted-foreground">Support</h3>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Help & Resources</span>
                <span className="text-xs text-muted-foreground hidden lg:inline-block">
                  Get support and documentation
                </span>
              </div>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Settings className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Settings</span>
                <span className="text-xs text-muted-foreground hidden lg:inline-block">Configure your dashboard</span>
              </div>
            </Link>
          </div>
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-950 md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800 bg-primary text-primary-foreground">
          <MUTCULogo />
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {filteredItems.map((item) => {
              // Use the getColorClass function for mobile items too
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? cn(getColorClass("bg", item.color), "text-white")
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md",
                      getColorClass("bg-light", item.color),
                      getColorClass("text", item.color),
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="mt-6 space-y-1">
            <h3 className="px-3 text-xs font-medium text-muted-foreground">Support</h3>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Help & Resources</span>
                <span className="text-xs text-muted-foreground">Get support and documentation</span>
              </div>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-accent">
                <Settings className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Settings</span>
                <span className="text-xs text-muted-foreground">Configure your dashboard</span>
              </div>
            </Link>
          </div>
        </nav>
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col overflow-hidden">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Add QuickNav for mobile users */}
          <div className="md:hidden flex-1 mr-2">
            <QuickNav />
          </div>

          {/* Add breadcrumb based on current path */}
          <Breadcrumb
            segments={breadcrumbSegments.slice(1)} // Skip the first "Dashboard" item since we show the home icon
            showHomeIcon={true}
            className="hidden md:flex"
          />

          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

