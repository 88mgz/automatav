"use client"

import { useState } from "react"
import type { RoadmapItem } from "@/lib/types"
import { Search } from "lucide-react"

interface RoadmapFiltersProps {
  items: RoadmapItem[]
  onFilter: (filtered: RoadmapItem[]) => void
}

export function RoadmapFilters({ items, onFilter }: RoadmapFiltersProps) {
  const [search, setSearch] = useState("")
  const [intent, setIntent] = useState<string>("all")
  const [make, setMake] = useState<string>("all")

  const handleFilter = (searchTerm: string, intentFilter: string, makeFilter: string) => {
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (intentFilter !== "all") {
      filtered = filtered.filter((item) => item.intent === intentFilter)
    }

    if (makeFilter !== "all") {
      filtered = filtered.filter((item) => item.make === makeFilter)
    }

    onFilter(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    handleFilter(value, intent, make)
  }

  const handleIntentChange = (value: string) => {
    setIntent(value)
    handleFilter(search, value, make)
  }

  const handleMakeChange = (value: string) => {
    setMake(value)
    handleFilter(search, intent, value)
  }

  const makes = Array.from(new Set(items.map((item) => item.make).filter(Boolean)))

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Intent Filter */}
        <select
          value={intent}
          onChange={(e) => handleIntentChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Intents</option>
          <option value="comparison">Comparison</option>
          <option value="review">Review</option>
          <option value="guide">Guide</option>
          <option value="localized_dealer">Localized Dealer</option>
        </select>

        {/* Make Filter */}
        <select
          value={make}
          onChange={(e) => handleMakeChange(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Makes</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
