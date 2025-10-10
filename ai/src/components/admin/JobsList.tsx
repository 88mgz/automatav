"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import type { Job } from "@/lib/types"

function statusTextColor(status: Job["status"] | "published") {
  switch (status) {
    case "queued":
      return "text-blue-400"
    case "running":
      return "text-yellow-400"
    case "preview":
      return "text-violet-400"
    case "blocked":
      return "text-orange-400"
    case "published":
      return "text-green-400"
    case "failed":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

function qcStatusTextColor(sev?: string) {
  switch (sev) {
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

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "running" | "published" | "failed">("all")

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const res = await fetch("/api/jobs")
        const json = await res.json()
        const list: Job[] = Array.isArray(json?.jobs) ? json.jobs : Array.isArray(json) ? json : []
        if (!ignore) setJobs(list)
      } catch {
        if (!ignore) setJobs([])
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const visible = jobs.filter((j) => {
    if (filter === "all") return true
    if (filter === "running") return j.status === "running" || j.status === "queued"
    if (filter === "published") return j.status === "published"
    if (filter === "failed") return j.status === "failed"
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["all", "running", "published", "failed"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              filter === key
                ? "border-blue-400 bg-blue-400/10 text-blue-400"
                : "border-white/10 hover:border-white/20 text-gray-400 hover:text-white"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((job, i) => {
          const progress = (job as any)?.progress ?? 0
          const currentStep = (job as any)?.currentStep ?? ""
          const qcStatus: string | undefined = (job as any)?.qcStatus
          const qcIssuesLen = Array.isArray((job as any)?.qcIssues) ? (job as any).qcIssues.length : 0

          return (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
              <Link href={`/admin/jobs/${job.id}`}>
                <div className="group relative border border-white/10 rounded-lg p-4 hover:border-blue-400/50 transition-all bg-black/20 backdrop-blur-sm">
                  <div className="absolute top-4 right-4">
                    <div className={`text-xs font-medium ${statusTextColor(job.status)}`}>{String(job.status).toUpperCase()}</div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white pr-20">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>ID: {job.id.slice(0, 8)}</span>
                      <span>•</span>
                      <span>{new Date(job.createdAt).toLocaleString()}</span>
                    </div>

                    {job.status === "running" && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-400 to-violet-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <div className="mt-1 text-xs text-gray-400">
                          {currentStep || "In progress"} - {progress}%
                        </div>
                      </div>
                    )}

                    {qcStatus && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">QC:</span>
                        <span className={`text-xs font-medium ${qcStatusTextColor(qcStatus)}`}>{qcStatus.toUpperCase()}</span>
                        {qcIssuesLen > 0 && <span className="text-xs text-gray-400">({qcIssuesLen} issues)</span>}
                      </div>
                    )}

                    {(job as any)?.error && (
                      <div className="mt-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded px-2 py-1">
                        {(job as any).error}
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-violet-400/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </Link>
            </motion.div>
          )
        })}

        {visible.length === 0 && <div className="text-center py-12 text-gray-400">No jobs found</div>}
      </div>
    </div>
  )
}

export default JobsList
