"use client"

import { motion, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

interface InlineStatProps {
  value: number
  duration?: number
  suffix?: string
}

export function InlineStat({ value, duration = 1, suffix = "" }: InlineStatProps) {
  const [isVisible, setIsVisible] = useState(false)
  const spring = useSpring(0, { stiffness: 50, damping: 20 })
  const display = useTransform(spring, (current) => Math.round(current))

  useEffect(() => {
    if (isVisible) {
      spring.set(value)
    }
  }, [isVisible, value, spring])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
      className="font-bold text-primary"
    >
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  )
}
