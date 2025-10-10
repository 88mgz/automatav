"use client"

import { useState, useEffect } from "react"
import type { RoadmapItem, RoadmapStatus } from "@/lib/types"
import { RoadmapBoard } from "@/components/admin/RoadmapBoard"
import { RoadmapFilters } from "@/components/admin/RoadmapFilters"
import { LiquidBlobs } from "@/components/visual/LiquidBlobs"
import { motion } from "framer-motion"
import { Plus, Play, CheckCircle, Calendar } from "lucide-react"

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [filteredItems, setFilteredItems] = useState<RoadmapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null)

  useEffect(() => {
    fetch("/api/roadmap")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || [])
        setFilteredItems(data.items || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleStatusChange = (itemId: string, newStatus: RoadmapStatus) => {
    fetch(`/api/roadmap/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)))
        setFilteredItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)))
      })
  }

  const handleCreateItem = (status: RoadmapStatus) => {
    const newItem: Partial<RoadmapItem> = {
      title: "New Item",
      intent: "comparison",
      status,
      priority: "medium",
    }

    fetch("/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((created) => {
        setItems((prev) => [...prev, created])
        setFilteredItems((prev) => [...prev, created])
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid Background */}
      <LiquidBlobs />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Content Roadmap
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Plan, track, and publish your content pipeline</p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Item
          </button>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Play className="w-4 h-4" />
            Create Jobs
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <CheckCircle className="w-4 h-4" />
            Run QC
          </button>
          <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Calendar className="w-4 h-4" />
            Schedule
          </button>
        </motion.div>

        {/* Filters */}
        <RoadmapFilters items={items} onFilter={setFilteredItems} />

        {/* Board */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <RoadmapBoard
            items={filteredItems}
            onItemClick={setSelectedItem}
            onStatusChange={handleStatusChange}
            onCreateItem={handleCreateItem}
          />
        </motion.div>
      </div>
    </div>
  )
}
