"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Clock, ExternalLink } from "lucide-react"

interface PublishEvent {
  id: string
  timestamp: string
  status: "success" | "failed"
  githubUrl?: string
  error?: string
  user: string
}

interface PublishHistoryProps {
  events: PublishEvent[]
}

export function PublishHistory({ events }: PublishHistoryProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 text-center">
        <Clock className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400">No publishing history yet</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6">
      <h3 className="text-lg font-semibold mb-4">Publishing History</h3>

      <div className="space-y-3">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
          >
            {event.status === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="font-medium text-sm">{event.status === "success" ? "Published" : "Failed"}</p>
                <time className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(event.timestamp).toLocaleString()}
                </time>
              </div>

              {event.status === "success" && event.githubUrl && (
                <a
                  href={event.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  View on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {event.status === "failed" && event.error && (
                <p className="text-sm text-red-600 dark:text-red-400">{event.error}</p>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">by {event.user}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
