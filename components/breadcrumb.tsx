import type React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLDivElement> {
  segments: {
    title: string
    href: string
    icon?: React.ReactNode
    isActive?: boolean
  }[]
  homeHref?: string
  showHomeIcon?: boolean
  separator?: React.ReactNode
}

export function Breadcrumb({
  segments,
  homeHref = "/dashboard",
  showHomeIcon = true,
  separator = <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)} {...props}>
      <ol className="flex items-center flex-wrap">
        {/* Home link */}
        {showHomeIcon && (
          <li className="flex items-center">
            <Link
              href={homeHref}
              className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            {segments.length > 0 && separator}
          </li>
        )}

        {/* Breadcrumb segments */}
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1

          return (
            <li key={segment.href} className="flex items-center">
              {isLast || segment.isActive ? (
                <span
                  className={cn(
                    "text-sm font-medium truncate max-w-[180px] md:max-w-[300px]",
                    segment.isActive ? "text-primary" : "text-foreground",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {segment.icon && <span className="mr-1.5 inline-flex">{segment.icon}</span>}
                  {segment.title}
                </span>
              ) : (
                <>
                  <Link
                    href={segment.href}
                    className="text-sm text-muted-foreground hover:text-primary truncate max-w-[180px] md:max-w-[300px] transition-colors flex items-center"
                  >
                    {segment.icon && <span className="mr-1.5">{segment.icon}</span>}
                    {segment.title}
                  </Link>
                  {!isLast && separator}
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

