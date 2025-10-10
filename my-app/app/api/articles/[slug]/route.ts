import { NextResponse } from "next/server"
import { getArticle } from "@/lib/storage"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    console.log("[v0] Fetching article with slug:", slug)

    const article = await getArticle(slug)

    if (!article) {
      console.log("[v0] Article not found:", slug)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("[v0] Article found:", article.title)
    return NextResponse.json({ article })
  } catch (error) {
    console.error("[v0] Failed to read article:", error)
    return NextResponse.json({ error: "Failed to read article" }, { status: 500 })
  }
}
