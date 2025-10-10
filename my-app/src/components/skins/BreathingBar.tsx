"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

interface BreathingBarProps {
  quote: string
  attribution?: string
}

export function BreathingBar({ quote, attribution }: BreathingBarProps) {
  return (
    <div className="minimal-card p-8 relative overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 breathe origin-left"
        style={{
          background: "linear-gradient(180deg, var(--pair-2-a), var(--pair-2-b))",
        }}
      />

      <div className="pl-6 space-y-4">
        <Quote className="w-8 h-8 text-[var(--pair-2-a)] opacity-50" />
        <blockquote className="text-xl md:text-2xl font-medium leading-relaxed gradient-text">{quote}</blockquote>
        {attribution && <cite className="text-sm text-muted-foreground not-italic">— {attribution}</cite>}
      </div>
    </div>
  )
}
