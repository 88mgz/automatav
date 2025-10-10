import { NextResponse } from "next/server"
import type { Job } from "@/lib/types"

export async function GET(_req: Request) {
  const now = Date.now()
  const jobs: Job[] = [
    {
      id: "job-001",
      slug: "2026-midsize-sedan-comparison",
      title: "2026 Midsize Sedan Comparison",
      status: "published",
      intent: "publish",
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 30 * 60 * 1000).toISOString(),
    },
    {
      id: "job-002",
      slug: "2026-midsize-sedan-pricing",
      title: "2026 Midsize Sedan Pricing",
      status: "queued",
      intent: "publish",
      createdAt: new Date(now - 10 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 5 * 60 * 1000).toISOString(),
    },
  ]
  return NextResponse.json(jobs)
}
