"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="grid grid-cols-2 grid-rows-2 w-16 h-16 rounded-lg overflow-hidden mb-4">
        <div className="bg-accent"></div>
        <div className="bg-secondary"></div>
        <div className="bg-primary"></div>
        <div className="bg-highlight"></div>
      </div>
      <h2 className="text-2xl font-bold text-primary">Something went wrong!</h2>
      <p className="text-muted-foreground text-center max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4 mt-4">
        <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
          Go to Dashboard
        </Button>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </Button>
      </div>
    </div>
  )
}

