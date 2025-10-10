"use client"

import { JobsList } from "@/components/admin/JobsList"
import { LiquidBlobs } from "@/components/visual/LiquidBlobs"
import Link from "next/link"

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 relative overflow-hidden">
      <LiquidBlobs />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Generation Jobs</h1>
                <p className="text-gray-400">Track article generation and QC status</p>
              </div>
              <Link
                href="/admin/roadmap"
                className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all"
              >
                ← Back to Roadmap
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { label: "Total Jobs", value: "24", color: "blue" },
                { label: "Running", value: "3", color: "yellow" },
                { label: "Complete", value: "18", color: "green" },
                { label: "Failed", value: "3", color: "red" },
              ].map((stat) => (
                <div key={stat.label} className="border border-white/10 rounded-lg p-4 bg-black/20 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          <JobsList />
        </div>
      </div>
    </div>
  )
}
