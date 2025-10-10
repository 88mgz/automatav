"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Job, QCStatus } from "@/lib/types"

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "running" | "complete" | "failed">("all")

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true
    if (filter === "running") return job.status === "running" || job.status === "queued"
    if (filter === "complete") return job.status === "complete"
    if (filter === "failed") return job.status === "failed"
    return true
  })

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "queued":
        return "text-blue-400"
      case "running":
        return "text-yellow-400"
      case "complete":
        return "text-green-400"
      case "failed":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getQCStatusColor = (status: QCStatus) => {
    switch (status) {
      case "pass":
        return "text-green-400"
      case "warn":
        return "text-yellow-400"
      case "fail":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "running", "complete", "failed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              filter === f
                ? "border-blue-400 bg-blue-400/10 text-blue-400"
                : "border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/admin/jobs/${job.id}`}>
              <div className="group relative border border-white/10 rounded-lg p-4 hover:border-blue-400/50 transition-all bg-black/20 backdrop-blur-sm">
                {/* Status indicator */}
                <div className="absolute top-4 right-4">
                  <div className={`text-xs font-medium ${getStatusColor(job.status)}`}>{job.status.toUpperCase()}</div>
                </div>

                {/* Job info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white pr-20">{job.title}</h3>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>ID: {job.id.slice(0, 8)}</span>
                    <span>•</span>
                    <span>{new Date(job.createdAt).toLocaleString()}</span>
                  </div>

                  {/* Progress bar */}
                  {job.status === "running" && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-blue-400 to-violet-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${job.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {job.currentStep} - {job.progress}%
                      </div>
                    </div>
                  )}

                  {/* QC Status */}
                  {job.qcStatus && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">QC:</span>
                      <span className={`text-xs font-medium ${getQCStatusColor(job.qcStatus)}`}>
                        {job.qcStatus.toUpperCase()}
                      </span>
                      {job.qcIssues && job.qcIssues.length > 0 && (
                        <span className="text-xs text-gray-400">({job.qcIssues.length} issues)</span>
                      )}
                    </div>
                  )}

                  {/* Error message */}
                  {job.error && (
                    <div className="mt-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-2 py-1">
                      {job.error}
                    </div>
                  )}
                </div>

                {/* Hover indicator */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-violet-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </Link>
          </motion.div>
        ))}

        {filteredJobs.length === 0 && <div className="text-center py-12 text-gray-400">No jobs found</div>}
      </div>
    </div>
  )
}
