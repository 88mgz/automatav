import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <FileQuestion className="w-20 h-20 mx-auto text-muted-foreground" />
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          The article you're looking for doesn't exist or hasn't been published yet.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/articles">Browse Articles</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
