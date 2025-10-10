import { type NextRequest, NextResponse } from "next/server"
import { runQCChecks } from "@/lib/qc/rules"
import { listArticles } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    const article = await request.json()

    // Get existing articles for duplicate checks
    const existingArticles = await listArticles()

    // Run QC checks
    const normalizedExisting = existingArticles.map((a: any) => ({
      intent: a?.intent ?? "comparison",
      ...a,
    }))
    const results = await runQCChecks(article as any, normalizedExisting as any)

    return NextResponse.json({ results })
  } catch (error) {
    console.error("[v0] QC check error:", error)
    return NextResponse.json({ error: "Failed to run QC checks" }, { status: 500 })
  }
}
