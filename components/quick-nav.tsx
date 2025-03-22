"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Users, Calendar, FileText, MessageSquare, Church, Bell, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: PieChart,
    color: "primary", // Navy blue
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    color: "secondary", // Teal
  },
  {
    title: "Events",
    href: "/dashboard/events",
    icon: Calendar,
    color: "accent", // Orange
  },
  {
    title: "Resources",
    href: "/dashboard/content",
    icon: FileText,
    color: "highlight", // Red
  },
  {
    title: "Feedback",
    href: "/dashboard/feedback",
    icon: MessageSquare,
    color: "primary", // Navy blue
  },
  {
    title: "Ministry Team",
    href: "/dashboard/ministry",
    icon: Church,
    color: "secondary", // Teal
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    color: "accent", // Orange
  },
]

export function QuickNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Find the current page
  const currentPage = navItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))

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
    }

    return colorMap[type][color || "primary"] || colorMap[type]["primary"]
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between md:w-[200px]">
          <div className="flex items-center gap-2">
            {currentPage?.icon && <currentPage.icon className={getColorClass("text", currentPage.color)} />}
            <span>{currentPage?.title || "Navigate"}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {navItems.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link
              href={item.href}
              className={cn("flex items-center gap-2", pathname === item.href && getColorClass("text", item.color))}
              onClick={() => setOpen(false)}
            >
              <item.icon className={getColorClass("text", item.color)} />
              {item.title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

