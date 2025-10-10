"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { RoadmapItem, RoadmapStatus } from "@/lib/types"
import { RoadmapCard } from "./RoadmapCard"
import { Plus } from "lucide-react"

const COLUMNS: { status: RoadmapStatus; label: string; color: string }[] = [
  { status: "idea", label: "Idea", color: "from-slate-500 to-slate-600" },
  { status: "drafting", label: "Drafting", color: "from-blue-500 to-blue-600" },
  { status: "in_review", label: "In Review", color: "from-purple-500 to-purple-600" },
  { status: "qc_passed", label: "QC Passed", color: "from-green-500 to-green-600" },
  { status: "scheduled", label: "Scheduled", color: "from-amber-500 to-amber-600" },
  { status: "published", label: "Published", color: "from-emerald-500 to-emerald-600" },
]

interface RoadmapBoardProps {
  items: RoadmapItem[]
  onItemClick: (item: RoadmapItem) => void
  onStatusChange: (itemId: string, newStatus: RoadmapStatus) => void
  onCreateItem: (status: RoadmapStatus) => void
}

export function RoadmapBoard({ items, onItemClick, onStatusChange, onCreateItem }: RoadmapBoardProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const getItemsByStatus = (status: RoadmapStatus) => {
    return items.filter((item) => item.status === status)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {COLUMNS.map((column) => {
        const columnItems = getItemsByStatus(column.status)

        return (
          <motion.div
            key={column.status}
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Column Header */}
            <div className={`bg-gradient-to-br ${column.color} rounded-lg p-3 border border-white/10`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm">{column.label}</h3>
                <span className="text-xs text-white/80 bg-white/20 px-2 py-0.5 rounded-full">{columnItems.length}</span>
              </div>
            </div>

            {/* Cards Container */}
            <div className="flex-1 space-y-2 min-h-[200px]">
              {columnItems.map((item) => (
                <RoadmapCard
                  key={item.id}
                  item={item}
                  onClick={() => onItemClick(item)}
                  onStatusChange={(newStatus) => onStatusChange(item.id, newStatus)}
                />
              ))}

              {/* Add New Button */}
              <button
                onClick={() => onCreateItem(column.status)}
                className="w-full p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg hover:border-blue-500 hover:bg-blue-500/5 transition-colors group"
              >
                <Plus className="w-4 h-4 mx-auto text-slate-400 group-hover:text-blue-500" />
              </button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
