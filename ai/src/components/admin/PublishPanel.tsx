"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, AlertCircle, Github, Loader2, ExternalLink } from "lucide-react"

type LocalQCResult = {
  rule: string
  message: string
  severity: "error" | "warning" | "info"
  path?: string
}

interface PublishPanelProps {
  jobId: string
  qcResults: LocalQCResult[]
  articleData?: any
  onPublish?: () => void | Promise<void>
}

export function PublishPanel({ jobId, qcResults, articleData, onPublish }: PublishPanelProps) {
  const [busy, setBusy] = useState<"idle" | "checking" | "publishing" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const hasBlockers = (qcResults || []).some((r) => r.severity === "error")

  async function runPublish() {
    try {
      setErrorMsg(null)
      setBusy("checking")

      // (Optionally) you could do extra client-side checks here.
      // We just gate on blockers for now.
      if (hasBlockers) {
        setBusy("error")
        setErrorMsg("Fix all QC errors before publishing.")
        return
      }

      setBusy("publishing")

      // Your publish API currently exposes a GET in app/api/publish/[id]/route.ts
      // Keep the call simple and let the server side handle details.
      const res = await fetch(`/api/publish/${encodeURIComponent(jobId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j?.error || `Publish failed (${res.status})`)
      }

      setBusy("success")
      // Let parent refresh job/history if it passed us a hook
      await onPublish?.()
    } catch (err: any) {
      setBusy("error")
      setErrorMsg(err?.message || "Publish failed")
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Github className="w-5 h-5" /> Publish to GitHub
      </h3>

      {busy === "error" && errorMsg && (
        <div className="flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
          <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {busy === "success" && (
        <div className="flex items-start gap-2 text-green-600 dark:text-green-400 text-sm">
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Published</span>
        </div>
      )}

      <button
        onClick={runPublish}
        disabled={busy === "checking" || busy === "publishing" || hasBlockers}
        className={`w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg border transition-colors
          ${hasBlockers
            ? "border-red-400/30 text-red-400/70 cursor-not-allowed"
            : "border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"}`}
      >
        {busy === "checking" || busy === "publishing" ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {busy === "checking" ? "Running pre-flight checks..." : "Publishing to GitHub..."}
          </span>
        ) : busy === "success" ? (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Published
          </span>
        ) : (
          "Publish to GitHub"
        )}
      </button>

      {hasBlockers && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          <AlertCircle className="w-4 h-4 inline mr-1 -mt-1" />
          Fix all blockers before publishing
        </p>
      )}

      {articleData && (
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Preview output <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  )
}

export default PublishPanel
