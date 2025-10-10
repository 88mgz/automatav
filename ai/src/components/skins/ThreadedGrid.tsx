"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { ArticleBlock } from "@/lib/articleSchema"

interface ThreadedGridProps {
  block: Extract<ArticleBlock, { type: "comparisonTable" }>
}

export function ThreadedGrid({ block }: ThreadedGridProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null)
  const [sortCol, setSortCol] = useState<number | null>(null)

  return (
    <div className="minimal-card overflow-hidden">
      {block.caption && <div className="px-6 pt-6 pb-2 text-sm text-muted-foreground">{block.caption}</div>}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-hairline">
              {block.columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-left font-semibold text-sm relative cursor-pointer group"
                  onMouseEnter={() => setHoveredCol(i)}
                  onMouseLeave={() => setHoveredCol(null)}
                  onClick={() => setSortCol(sortCol === i ? null : i)}
                >
                  <div className="flex items-center gap-2">
                    {col}
                    <motion.div
                      animate={{ rotate: sortCol === i ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    >
                      <ChevronDown className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {hoveredCol === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "100%", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24 }}
                        className="absolute left-1/2 top-full w-0.5 -translate-x-1/2 pointer-events-none"
                        style={{
                          background: "linear-gradient(180deg, var(--pair-1-a), var(--pair-1-b))",
                        }}
                      />
                    )}
                  </AnimatePresence>
                </th>
              ))}
            </tr>
            <tr>
              <td colSpan={block.columns.length} className="p-0">
                <div className="rule-grad" />
              </td>
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <motion.tr
                key={i}
                className="border-b border-hairline last:border-0 hover:bg-foreground/[0.04] transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, delay: i * 0.05 }}
              >
                {block.columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 text-sm">
                    {row[col]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
