import { NextResponse } from "next/server"
import { listArticles } from "@/lib/storage"

export async function GET() {
  console.log("[v0] /api/articles GET called")

  try {
    const articles = listArticles()

    console.log("[v0] Returning articles:", articles.length)
    return NextResponse.json(articles)
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to list articles" }, { status: 500 })
  }
}
