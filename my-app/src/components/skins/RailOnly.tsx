"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface RailOnlyProps {
  items: Array<{ q: string; a: string }>
}

export function RailOnly({ items }: RailOnlyProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-0">
      <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
      {items.map((item, i) => (
        <div key={i} className="border-b border-hairline last:border-0">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full py-5 px-2 flex items-center justify-between gap-4 text-left group hover:text-primary transition-colors"
          >
            <span className="font-semibold text-base">{item.q}</span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <ChevronDown className="w-5 h-5 shrink-0" />
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === i && (
              <>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.26 }}
                  className="h-0.5 mb-4"
                  style={{
                    background: "linear-gradient(90deg, var(--pair-1-a), var(--pair-1-b))",
                  }}
                />
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24 }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 px-2 text-muted-foreground leading-relaxed">{item.a}</p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
