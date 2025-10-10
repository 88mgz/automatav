import { NextResponse } from "next/server"
import type { Job } from "@/lib/types"

// Mock data - replace with actual database
const MOCK_JOB: Job = {
  id: "job-001",
  roadmapId: "rm-001",
  title: "2026 Midsize Sedan Comparison",
  status: "complete",
  progress: 100,
  currentStep: "Complete",
  qcStatus: "pass",
  qcIssues: [],
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  completedAt: new Date(Date.now() - 1800000).toISOString(),
  result: {
    slug: "2026-midsize-sedan-comparison",
    blocks: [],
    modules: [],
  },
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // TODO: Fetch from database
  return NextResponse.json({ job: { ...MOCK_JOB, id } })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  // TODO: Update job in database
  return NextResponse.json({ job: { ...MOCK_JOB, id, ...body } })
}
