"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface SchemaDiffProps {
  expected: any
  actual: any
}

export function SchemaDiff({ expected, actual }: SchemaDiffProps) {
  const [view, setView] = useState<"side-by-side" | "unified">("side-by-side")

  const differences = findDifferences(expected, actual)

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView("side-by-side")}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            view === "side-by-side"
              ? "bg-blue-500/20 text-blue-400"
              : "bg-slate-800 text-slate-400 hover:text-slate-300"
          }`}
        >
          Side by Side
        </button>
        <button
          onClick={() => setView("unified")}
          className={`px-3 py-1.5 rounded text-sm transition-colors ${
            view === "unified" ? "bg-blue-500/20 text-blue-400" : "bg-slate-800 text-slate-400 hover:text-slate-300"
          }`}
        >
          Unified
        </button>
      </div>

      {/* Differences Summary */}
      {differences.length > 0 && (
        <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
          <p className="text-sm text-yellow-400">{differences.length} difference(s) found</p>
        </div>
      )}

      {/* Diff View */}
      {view === "side-by-side" ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-green-400">Expected Schema</h4>
            <pre className="p-4 rounded-lg bg-slate-900 text-xs overflow-auto max-h-96 border border-green-500/20">
              {JSON.stringify(expected, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2 text-red-400">Actual Data</h4>
            <pre className="p-4 rounded-lg bg-slate-900 text-xs overflow-auto max-h-96 border border-red-500/20">
              {JSON.stringify(actual, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {differences.map((diff, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 rounded-lg bg-slate-900 border border-slate-700"
            >
              <div className="text-xs font-mono text-slate-400 mb-2">{diff.path}</div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="text-red-400">- {JSON.stringify(diff.expected)}</div>
                <div className="text-green-400">+ {JSON.stringify(diff.actual)}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function findDifferences(expected: any, actual: any, path = ""): Array<{ path: string; expected: any; actual: any }> {
  const diffs: Array<{ path: string; expected: any; actual: any }> = []

  if (typeof expected !== typeof actual) {
    diffs.push({ path, expected, actual })
    return diffs
  }

  if (typeof expected === "object" && expected !== null) {
    const allKeys = new Set([...Object.keys(expected), ...Object.keys(actual)])

    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key

      if (!(key in expected)) {
        diffs.push({ path: newPath, expected: undefined, actual: actual[key] })
      } else if (!(key in actual)) {
        diffs.push({ path: newPath, expected: expected[key], actual: undefined })
      } else if (JSON.stringify(expected[key]) !== JSON.stringify(actual[key])) {
        diffs.push(...findDifferences(expected[key], actual[key], newPath))
      }
    }
  } else if (expected !== actual) {
    diffs.push({ path, expected, actual })
  }

  return diffs
}
