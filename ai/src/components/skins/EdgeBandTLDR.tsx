"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Sparkles } from "lucide-react"

interface EdgeBandTLDRProps {
  content: string
}

export function EdgeBandTLDR({ content }: EdgeBandTLDRProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-20, 20])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4])

  return (
    <div className="w-full relative overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, var(--pair-1-a) 0%, transparent 50%), radial-gradient(circle at 80% 50%, var(--pair-1-b) 0%, transparent 50%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "0px 40px"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <motion.div
        ref={ref}
        style={{ y }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative py-12 md:py-16"
      >
        <div className="px-6 md:px-12 lg:px-16">
          <motion.div
            className="relative overflow-hidden rounded-xl border border-white/20 dark:border-white/10 backdrop-blur-xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/70 shadow-2xl"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                background: "linear-gradient(135deg, var(--pair-1-a), var(--pair-1-b), var(--pair-1-a))",
                opacity: 0.15,
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <div className="relative p-8 md:p-12">
              <div className="flex items-start gap-6">
                <motion.div
                  className="p-4 rounded-xl bg-gradient-to-br from-[var(--pair-1-a)] to-[var(--pair-1-b)] shrink-0 shadow-lg"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(37, 99, 235, 0.3)",
                      "0 0 40px rgba(37, 99, 235, 0.6)",
                      "0 0 20px rgba(37, 99, 235, 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-7 h-7 text-white" />
                </motion.div>

                <div className="flex-1 min-w-0">
                  <motion.h3
                    className="font-bold text-2xl md:text-3xl mb-4 bg-gradient-to-r from-[var(--pair-1-a)] to-[var(--pair-1-b)] bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    TL;DR
                  </motion.h3>

                  <motion.p
                    className="text-lg md:text-xl text-foreground/90 leading-relaxed font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {content}
                  </motion.p>
                </div>
              </div>
            </div>

            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
