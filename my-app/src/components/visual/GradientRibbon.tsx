"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function GradientRibbon() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <motion.div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity, scale }}>
      <div
        className="absolute top-0 left-0 right-0 h-2 blur-sm"
        style={{
          background: "linear-gradient(90deg, hsl(262 95% 62%), hsl(202 92% 60%), hsl(158 90% 60%))",
        }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, hsl(262 95% 62%), hsl(202 92% 60%), hsl(158 90% 60%))",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </motion.div>
  )
}
