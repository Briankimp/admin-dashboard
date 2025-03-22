import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
      <div className="grid grid-cols-2 grid-rows-2 w-16 h-16 rounded-lg overflow-hidden mb-4">
        <div className="bg-accent"></div>
        <div className="bg-secondary"></div>
        <div className="bg-primary"></div>
        <div className="bg-highlight"></div>
      </div>
      <h2 className="text-2xl font-bold text-primary">Page Not Found</h2>
      <p className="text-muted-foreground text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-4">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
}

