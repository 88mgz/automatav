"use client"

import { useState } from "react"
import { LiquidBlobs } from "@/components/visual/LiquidBlobs"
import { TemplateCard } from "@/components/admin/TemplateCard"
import { Plus, Search } from "lucide-react"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock templates data
  const templates = [
    {
      id: "1",
      name: "Midsize Sedan Comparison",
      description: "Compare 3-4 midsize sedans with specs, features, and pricing",
      category: "Automotive",
      isDefault: true,
      usageCount: 24,
      lastUsed: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "SUV Review",
      description: "Comprehensive SUV review with performance, safety, and tech features",
      category: "Automotive",
      isDefault: false,
      usageCount: 12,
      lastUsed: new Date(Date.now() - 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Electric Vehicle Guide",
      description: "EV comparison with range, charging, and cost analysis",
      category: "Automotive",
      isDefault: false,
      usageCount: 8,
      createdAt: new Date().toISOString(),
    },
  ]

  const categories = ["all", "Automotive", "Technology", "Home & Garden"]

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleUse = (id: string) => {
    console.log("[v0] Using template:", id)
    // TODO: Navigate to generate page with template pre-filled
  }

  const handleEdit = (id: string) => {
    console.log("[v0] Editing template:", id)
    // TODO: Open template editor
  }

  const handleDelete = (id: string) => {
    console.log("[v0] Deleting template:", id)
    // TODO: Delete template with confirmation
  }

  const handleSetDefault = (id: string) => {
    console.log("[v0] Setting default template:", id)
    // TODO: Set as default template
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 relative overflow-hidden">
      <LiquidBlobs />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Article Templates</h1>
                <p className="text-gray-400">Manage reusable article templates</p>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-violet-600 transition-all flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Template
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 transition-colors"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                        : "border border-white/20 text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onUse={handleUse}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No templates found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
