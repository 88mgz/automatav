export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { readDraft } from "@/lib/storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 })
    }

    const draft = await readDraft(slug)
    return NextResponse.json(draft)
  } catch (error) {
    console.error("Draft read error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to read draft",
      },
      { status: 404 },
    )
  }
}
