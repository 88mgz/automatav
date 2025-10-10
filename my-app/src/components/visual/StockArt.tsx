"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface StockArtProps {
  variant?: "sedan" | "suv" | "ev" | "generic"
  src?: string
  alt?: string
  priority?: boolean
}

const defaultImages = {
  sedan: "/2026-midsize-sedan-comparison.jpg",
  suv: "/modern-suv-vehicle.jpg",
  ev: "/futuristic-electric-vehicle.png",
  generic: "/modern-vehicle.jpg",
}

export function StockArt({ variant = "generic", src, alt = "Vehicle illustration", priority = false }: StockArtProps) {
  const imageSrc = src || defaultImages[variant]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-full"
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
        <Image src={imageSrc || "/placeholder.svg"} alt={alt} fill className="object-cover" priority={priority} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
      </div>
    </motion.div>
  )
}
