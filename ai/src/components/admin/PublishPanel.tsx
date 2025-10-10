"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Github, Loader2, ExternalLink } from "lucide-react"
import type { QCResult } from "@/lib/types"

interface PublishPanelProps {
  jobId: string
  qcResults: QCResult[]
  articleData: any
  onPublish: () => Promise<void>
}

export function PublishPanel({ jobId, qcResults, articleData, onPublish }: PublishPanelProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishStatus, setPublishStatus] = useState<"idle" | "checking" | "publishing" | "success" | "failed">("idle")
  const [githubUrl, setGithubUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Calculate blockers
  const blockers = qcResults.filter((r) => r.severity === "error")
  const warnings = qcResults.filter((r) => r.severity === "warning")
  const canPublish = blockers.length === 0

  const handlePublish = async () => {
    if (!canPublish) return

    setIsPublishing(true)
    setPublishStatus("checking")
    setError(null)

    try {
      // Pre-flight checks
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPublishStatus("publishing")

      // Call publish API
      const response = await fetch(`/api/publish/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleData }),
      })

      if (!response.ok) {
        throw new Error("Publishing failed")
      }

      const data = await response.json()
      setGithubUrl(data.githubUrl)
      setPublishStatus("success")

      await onPublish()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publishing failed")
      setPublishStatus("failed")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Publishing</h3>
        <Github className="w-5 h-5 text-slate-400" />
      </div>

      {/* Blockers */}
      {blockers.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                {blockers.length} Blocker{blockers.length !== 1 ? "s" : ""}
              </h4>
              <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
                {blockers.map((blocker, i) => (
                  <li key={i}>• {blocker.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && blockers.length === 0 && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
                {warnings.length} Warning{warnings.length !== 1 ? "s" : ""}
              </h4>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                You can publish with warnings, but consider fixing them first.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success state */}
      {publishStatus === "success" && githubUrl && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Published Successfully</h4>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-800 dark:text-green-200 hover:underline flex items-center gap-1"
              >
                View on GitHub <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {publishStatus === "failed" && error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">Publishing Failed</h4>
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Publish button */}
      <button
        onClick={handlePublish}
        disabled={!canPublish || isPublishing}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-all
          ${
            canPublish && !isPublishing
              ? "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl"
              : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
          }
        `}
      >
        {isPublishing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {publishStatus === "checking" ? "Running pre-flight checks..." : "Publishing to GitHub..."}
          </span>
        ) : publishStatus === "success" ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Published
          </span>
        ) : (
          "Publish to GitHub"
        )}
      </button>

      {!canPublish && (
        <p className="mt-3 text-sm text-center text-slate-500 dark:text-slate-400">
          Fix all blockers before publishing
        </p>
      )}
    </motion.div>
  )
}
