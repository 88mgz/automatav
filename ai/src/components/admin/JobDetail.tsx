"use client"

import { useEffect, useState } from "react"
import type { Job } from "@/lib/types"
import { motion } from "framer-motion"
import { CircleCheck, CircleX, LoaderCircle, AlertCircle, Clock } from "lucide-react"

type LocalQCIssue = {
  rule: string
  message: string
  severity: "error" | "warning" | "info"
  path?: string
}

type PublishEvent = {
  id: string
  status: "success" | "failed"
  timestamp: string
  user?: string
  githubUrl?: string
  error?: string
}

function statusBadgeClasses(status: Job["status"] | "published") {
  switch (status) {
    case "queued":
      return "text-blue-400 bg-blue-400/10 border-blue-400/20"
    case "running":
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    case "preview":
      return "text-violet-400 bg-violet-400/10 border-violet-400/20"
    case "blocked":
      return "text-orange-400 bg-orange-400/10 border-orange-400/20"
    case "published":
      return "text-green-400 bg-green-400/10 border-green-400/20"
    case "failed":
      return "text-red-400 bg-red-400/10 border-red-400/20"
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20"
  }
}

function qcBadgeClasses(sev: string | undefined) {
  switch (sev) {
    case "pass":
      return "text-green-400 bg-green-400/10 border-green-400/20"
    case "warn":
      return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
    case "fail":
      return "text-red-400 bg-red-400/10 border-red-400/20"
    default:
      return "text-gray-400 bg-gray-400/10 border-gray-400/20"
  }
}

export function JobDetail({ jobId }: { jobId: string }) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [pubHistory, setPubHistory] = useState<PublishEvent[]>([])

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        const jRes = await fetch(`/api/jobs/${jobId}`)
        const jJson = await jRes.json()
        if (!ignore) setJob((jJson.job as Job) ?? (jJson as Job))

        const pRes = await fetch(`/api/publish/${jobId}`)
        const pJson = await pRes.json()
        if (!ignore) setPubHistory(Array.isArray(pJson.history) ? pJson.history : [])
      } catch {
        // ignore
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [jobId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
      </div>
    )
  }

  if (!job) {
    return <div className="text-center py-12 text-gray-400">Job not found</div>
  }

  const progress = (job as any)?.progress ?? 0
  const currentStep = (job as any)?.currentStep ?? "In progress"
  const qcStatus: string | undefined = (job as any)?.qcStatus
  const qcIssues: LocalQCIssue[] = Array.isArray((job as any)?.qcIssues)
    ? ((job as any).qcIssues as LocalQCIssue[])
    : []
  const errorMsg: string | undefined = (job as any)?.error

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-white/10 rounded-lg p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>ID: {job.id}</span>
              <span>•</span>
              <span>Created: {new Date(job.createdAt).toLocaleString()}</span>
              <span>•</span>
              <span>Updated: {new Date(job.updatedAt).toLocaleString()}</span>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-lg border text-sm font-medium ${statusBadgeClasses(job.status)}`}>
            {String(job.status).toUpperCase()}
          </div>
        </div>

        {job.status === "running" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">{currentStep}</span>
              <span className="text-white font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-violet-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-sm">
            <strong>Error:</strong> {errorMsg}
          </div>
        )}
      </div>

      {/* QC Section */}
      {qcStatus && (
        <div className="border border-white/10 rounded-lg p-6 bg-black/20 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-4">Quality Control</h2>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-400">Status:</span>
            <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${qcBadgeClasses(qcStatus)}`}>
              {qcStatus.toUpperCase()}
            </span>
          </div>

          {Array.isArray(qcIssues) && qcIssues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400">Issues ({qcIssues.length})</h3>
              {qcIssues.map((issue, index) => {
                const sevClass =
                  issue.severity === "error"
                    ? "text-red-400 bg-red-400/10 border-red-400/20"
                    : issue.severity === "warning"
                    ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                    : "text-blue-400 bg-blue-400/10 border-blue-400/20"
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className={`p-3 rounded-lg border ${sevClass}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium">{issue.rule}</span>
                      <span className="text-xs uppercase">{issue.severity}</span>
                    </div>
                    <p className="text-sm opacity-80">{issue.message}</p>
                    {issue.path && <p className="text-xs opacity-60 mt-1">Path: {issue.path}</p>}
                  </motion.div>
                )
              })}
            </div>
          )}

          {(!qcIssues || qcIssues.length === 0) && (
            <div className="text-center py-6 text-gray-400">No issues found - all checks passed!</div>
          )}
        </div>
      )}

      {/* Publishing history */}
      <div className="border border-white/10 rounded-lg p-6 bg-black/20 backdrop-blur-sm">
        <h3 className="text-lg font-semibold mb-4">Publishing History</h3>
        {pubHistory.length === 0 ? (
          <div className="rounded-lg border border-slate-200/20 p-8 text-center">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-400">No publishing history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pubHistory.map((evt, i) => (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200/20 hover:bg-slate-50/5 transition-colors"
              >
                {evt.status === "success" ? (
                  <CircleCheck className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <CircleX className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-sm">{evt.status === "success" ? "Published" : "Failed"}</p>
                    <time className="text-xs text-slate-400">
                      {new Date(evt.timestamp).toLocaleString()}
                    </time>
                  </div>
                  {evt.status === "success" && evt.githubUrl && (
                    <a
                      href={evt.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:underline"
                    >
                      View on GitHub
                    </a>
                  )}
                  {evt.status === "failed" && evt.error && (
                    <p className="text-sm text-red-400">{evt.error}</p>
                  )}
                  {evt.user && <p className="text-xs text-slate-400 mt-1">by {evt.user}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default JobDetail
