"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorDisplay({ title = "Error", message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex h-full items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-4 max-w-md">
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mx-auto w-fit">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{message}</p>
        {onRetry && <Button onClick={onRetry}>Try Again</Button>}
      </div>
    </div>
  )
}

