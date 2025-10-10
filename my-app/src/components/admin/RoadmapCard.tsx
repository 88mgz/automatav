"use client"

import type { RoadmapItem, RoadmapStatus } from "@/lib/types"
import { motion } from "framer-motion"
import { Calendar, User, Tag } from "lucide-react"

interface RoadmapCardProps {
  item: RoadmapItem
  onClick: () => void
  onStatusChange: (newStatus: RoadmapStatus) => void
}

const PRIORITY_COLORS = {
  low: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
  medium: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  high: "bg-red-500/20 text-red-700 dark:text-red-300",
}

export function RoadmapCard({ item, onClick }: RoadmapCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {/* Title */}
      <h4 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h4>

      {/* Meta Info */}
      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
        {item.make && item.model && (
          <div className="flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            <span>
              {item.make} {item.model} {item.year}
            </span>
          </div>
        )}

        {item.assignee && (
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3" />
            <span>{item.assignee}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3" />
          <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[item.priority]}`}>{item.priority}</span>
        <span className="text-xs text-slate-500">{item.intent}</span>
      </div>
    </motion.div>
  )
}
