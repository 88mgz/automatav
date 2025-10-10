import { NextResponse } from "next/server"
import type { Job } from "@/lib/types"

const MOCK_JOB: Job = {
  id: "job-001",
  slug: "2026-midsize-sedan-comparison",
  title: "2026 Midsize Sedan Comparison",
  status: "published",
  intent: "publish",
  createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const idFromPath = url.pathname.split("/").pop() || ""
  if (!idFromPath) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }
  const job = { ...MOCK_JOB, id: idFromPath }
  return NextResponse.json(job)
}
