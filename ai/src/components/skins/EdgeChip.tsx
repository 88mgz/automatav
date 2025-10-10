"use client"

import { motion, useSpring } from "framer-motion"
import { useEffect, useState } from "react"

interface EdgeChipProps {
  value: number
  unit: string
  label: string
}

export function EdgeChip({ value, unit, label }: EdgeChipProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const springValue = useSpring(0, { stiffness: 100, damping: 20 })

  useEffect(() => {
    springValue.set(value)
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [value, springValue])

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.24 }}
        className="dual-stroke minimal-card px-6 py-4 inline-flex items-baseline gap-2"
      >
        <span className="text-3xl font-bold gradient-text">{displayValue}</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.04 }}
          className="text-sm text-muted-foreground font-medium"
        >
          {unit}
        </motion.span>
      </motion.div>
    </div>
  )
}
