"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { LiquidBlobs } from "../visual/LiquidBlobs"
import { GradientRibbon } from "../visual/GradientRibbon"
import { StockArt } from "../visual/StockArt"

interface FluidHeroProps {
  eyebrow?: string
  headline: string
  subheadline?: string
  badges?: Array<{ label: string }>
  cta?: { label: string; href: string }
  stockArtVariant?: "sedan" | "suv" | "ev" | "generic"
}

export function FluidHero({ eyebrow, headline, subheadline, badges, cta, stockArtVariant = "sedan" }: FluidHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div
      ref={ref}
      className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
    >
      <LiquidBlobs />
      <GradientRibbon />

      <div className="container mx-auto px-4 py-20 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <motion.div style={{ y, opacity }} className="space-y-8">
            {eyebrow && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Badge variant="secondary" className="text-sm px-4 py-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  {eyebrow}
                </Badge>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20, letterSpacing: "0.05em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "normal" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-balance leading-tight"
            >
              {headline}
            </motion.h1>

            {subheadline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground text-balance leading-relaxed"
              >
                {subheadline}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4 items-center"
            >
              {badges && badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badge, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1">
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}

              {cta && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    asChild
                    size="lg"
                    className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
                  >
                    <a href={cta.href}>{cta.label}</a>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Right column - Stock Art */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] lg:h-[500px]"
          >
            <StockArt variant={stockArtVariant} priority />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
