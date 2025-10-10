"use client"

import { motion } from "framer-motion"
import { FileText, Copy, Edit2, Trash2, Star } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: string
  isDefault: boolean
  usageCount: number
  lastUsed?: string
  createdAt: string
}

interface TemplateCardProps {
  template: Template
  onUse: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onSetDefault: (id: string) => void
}

export function TemplateCard({ template, onUse, onEdit, onDelete, onSetDefault }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="border border-white/10 rounded-lg p-6 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{template.name}</h3>
              {template.isDefault && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
            </div>
            <p className="text-xs text-gray-400">{template.category}</p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{template.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
        <span>Used {template.usageCount} times</span>
        {template.lastUsed && <span>Last used {new Date(template.lastUsed).toLocaleDateString()}</span>}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUse(template.id)}
          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-violet-600 transition-all flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Use Template
        </button>
        <button
          onClick={() => onEdit(template.id)}
          className="px-3 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        {!template.isDefault && (
          <>
            <button
              onClick={() => onSetDefault(template.id)}
              className="px-3 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(template.id)}
              className="px-3 py-2 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
