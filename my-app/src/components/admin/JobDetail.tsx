"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import type { Job, QCIssue } from "@/lib/types"
import { PublishPanel } from "./PublishPanel"
import { PublishHistory } from "./PublishHistory"

interface JobDetailProps {
  jobId: string
}

export function JobDetail({ jobId }: JobDetailProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishHistory, setPublishHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchJob = () => {
      fetch(`/api/jobs/${jobId}`)
        .then((res) => res.json())
        .then((data) => {
          setJob(data.job)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }

    const fetchHistory = () => {
      fetch(`/api/publish/${jobId}`)
        .then((res) => res.json())
        .then((data) => setPublishHistory(data.history || []))
        .catch(() => {})
    }

    fetchJob()
    fetchHistory()

    // Poll for updates if job is running
    const interval = setInterval(() => {
      if (job?.status === "running" || job?.status === "queued") {
        fetchJob()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, job?.status])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!job) {
    return <div className="text-center py-12 text-gray-400">Job not found</div>
  }

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "queued":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20"
      case "running":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "complete":
        return "text-green-400 bg-green-400/10 border-green-400/20"
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const getSeverityColor = (severity: QCIssue["severity"]) => {
    switch (severity) {
      case "error":
        return "text-red-400 bg-red-400/10 border-red-400/20"
      case "warning":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
      case "info":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20"
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20"
    }
  }

  const handlePublish = async () => {
    // Refresh job and history after publishing
    const res = await fetch(`/api/jobs/${jobId}`)
    const data = await res.json()
    setJob(data.job)

    const historyRes = await fetch(`/api/publish/${jobId}`)
    const historyData = await historyRes.json()
    setPublishHistory(historyData.history || [])
  }

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
              {job.completedAt && (
                <>
                  <span>•</span>
                  <span>Completed: {new Date(job.completedAt).toLocaleString()}</span>
                </>
              )}
            </div>
          </div>
          <div className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(job.status)}`}>
            {job.status.toUpperCase()}
          </div>
        </div>

        {/* Progress */}
        {job.status === "running" && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">{job.currentStep}</span>
              <span className="text-white font-medium">{job.progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-violet-400"
                initial={{ width: 0 }}
                animate={{ width: `${job.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {job.error && (
          <div className="mt-4 p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-sm">
            <strong>Error:</strong> {job.error}
          </div>
        )}
      </div>

      {/* QC Results */}
      {job.qcStatus && (
        <div className="border border-white/10 rounded-lg p-6 bg-black/20 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-4">Quality Control</h2>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-400">Status:</span>
            <span
              className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                job.qcStatus === "pass"
                  ? "text-green-400 bg-green-400/10 border-green-400/20"
                  : job.qcStatus === "warn"
                    ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                    : "text-red-400 bg-red-400/10 border-red-400/20"
              }`}
            >
              {job.qcStatus.toUpperCase()}
            </span>
          </div>

          {job.qcIssues && job.qcIssues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400">Issues ({job.qcIssues.length})</h3>
              {job.qcIssues.map((issue, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-sm font-medium">{issue.rule}</span>
                    <span className="text-xs uppercase">{issue.severity}</span>
                  </div>
                  <p className="text-sm opacity-80">{issue.message}</p>
                  {issue.path && <p className="text-xs opacity-60 mt-1">Path: {issue.path}</p>}
                </motion.div>
              ))}
            </div>
          )}

          {(!job.qcIssues || job.qcIssues.length === 0) && (
            <div className="text-center py-6 text-gray-400">No issues found - all checks passed!</div>
          )}
        </div>
      )}

      {job.status === "complete" && job.qcStatus && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PublishPanel
            jobId={jobId}
            qcResults={job.qcIssues || []}
            articleData={job.result}
            onPublish={handlePublish}
          />
          <PublishHistory events={publishHistory} />
        </div>
      )}

      {/* Generated Content Preview */}
      {job.result && (
        <div className="border border-white/10 rounded-lg p-6 bg-black/20 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-4">Generated Content</h2>
          <div className="bg-black/40 rounded-lg p-4 border border-white/5">
            <pre className="text-xs text-gray-300 overflow-x-auto">{JSON.stringify(job.result, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
