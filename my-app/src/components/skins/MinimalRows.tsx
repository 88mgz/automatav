"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

interface MinimalRowsProps {
  sources?: string[]
  entries: Array<{
    author?: string
    rating?: number
    summary: string
    pros?: string[]
    cons?: string[]
  }>
}

export function MinimalRows({ sources, entries }: MinimalRowsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Expert Reviews</h2>
        {sources && sources.length > 0 && (
          <div className="text-sm text-muted-foreground">Sources: {sources.join(", ")}</div>
        )}
      </div>

      <div className="space-y-0">
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: i * 0.08 }}
            className="py-6 border-b border-hairline last:border-0 hover:bg-foreground/[0.03] transition-colors px-4 -mx-4"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              {entry.author && <div className="font-semibold">{entry.author}</div>}
              {entry.rating && (
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4"
                      style={{
                        stroke: j < entry.rating! ? "var(--pair-1-a)" : "currentColor",
                        fill: j < entry.rating! ? "none" : "none",
                        opacity: j < entry.rating! ? 1 : 0.3,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-3">{entry.summary}</p>
            {(entry.pros || entry.cons) && (
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {entry.pros && (
                  <div>
                    <div className="font-medium text-green-600 dark:text-green-400 mb-1">Pros</div>
                    <ul className="space-y-1 text-muted-foreground">
                      {entry.pros.map((pro, j) => (
                        <li key={j}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {entry.cons && (
                  <div>
                    <div className="font-medium text-red-600 dark:text-red-400 mb-1">Cons</div>
                    <ul className="space-y-1 text-muted-foreground">
                      {entry.cons.map((con, j) => (
                        <li key={j}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
