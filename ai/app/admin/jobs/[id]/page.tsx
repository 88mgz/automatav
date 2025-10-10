"use client"

import { JobDetail } from "@/components/admin/JobDetail"
import { LiquidBlobs } from "@/components/visual/LiquidBlobs"
import Link from "next/link"
import { use } from "react"

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 relative overflow-hidden">
      <LiquidBlobs />

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              ← Back to Jobs
            </Link>
          </div>

          {/* Job Detail */}
          <JobDetail jobId={id} />
        </div>
      </div>
    </div>
  )
}
