import { NextResponse } from "next/server"
import type { Job } from "@/lib/types"

// Mock data - replace with actual database
const MOCK_JOBS: Job[] = [
  {
    id: "job-001",
    roadmapId: "rm-001",
    title: "2026 Midsize Sedan Comparison",
    status: "complete",
    progress: 100,
    currentStep: "Complete",
    qcStatus: "pass",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "job-002",
    roadmapId: "rm-002",
    title: "Best Electric SUVs 2026",
    status: "running",
    progress: 65,
    currentStep: "Generating AI modules",
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: "job-003",
    roadmapId: "rm-003",
    title: "Luxury Sedan Showdown",
    status: "failed",
    progress: 45,
    currentStep: "Failed at content generation",
    error: "OpenAI API rate limit exceeded",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

export async function GET() {
  // TODO: Fetch from database
  return NextResponse.json({ jobs: MOCK_JOBS })
}

export async function POST(request: Request) {
  const body = await request.json()

  // TODO: Create job in database and queue for processing
  const newJob: Job = {
    id: `job-${Date.now()}`,
    roadmapId: body.roadmapId,
    title: body.title,
    status: "queued",
    progress: 0,
    currentStep: "Queued",
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({ job: newJob })
}
