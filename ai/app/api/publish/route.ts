export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { parseArticle } from "@/lib/articleSchema"
import { publishArticle } from "@/lib/publish"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { article } = body

    if (!article) {
      return NextResponse.json({ ok: false, error: "Missing article data" }, { status: 400 })
    }

    // Validate article with schema
    const validatedArticle = parseArticle(article)

    // Publish to file system or GitHub
    const { url } = await publishArticle(validatedArticle)

    return NextResponse.json({ ok: true, url })
  } catch (error) {
    console.error("[Publish API Error]", error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to publish article",
      },
      { status: 500 },
    )
  }
}
