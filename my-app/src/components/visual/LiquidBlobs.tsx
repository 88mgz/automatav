"use client"

import { motion } from "framer-motion"

export function LiquidBlobs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-50/30 to-pink-100/40 dark:from-blue-950/30 dark:via-purple-950/20 dark:to-pink-950/30" />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(158 90% 60% / 0.4), transparent 70%)",
          top: "5%",
          left: "15%",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(42 95% 60% / 0.35), transparent 70%)",
          bottom: "10%",
          right: "10%",
        }}
        animate={{
          x: [0, -45, 0],
          y: [0, 30, 0],
          scale: [1, 1.25, 1],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(262 95% 62% / 0.3), transparent 70%)",
          top: "45%",
          left: "45%",
        }}
        animate={{
          scale: [1, 1.35, 1],
          opacity: [0.3, 0.4, 0.3],
          rotate: [0, 25, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full blur-2xl"
        style={{
          background: "radial-gradient(circle, hsl(200 90% 65% / 0.25), transparent 70%)",
          top: "60%",
          left: "10%",
        }}
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-2xl"
        style={{
          background: "radial-gradient(circle, hsl(320 85% 65% / 0.22), transparent 70%)",
          top: "20%",
          right: "20%",
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 9,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(180 80% 60% / 0.28), transparent 70%)",
          top: "30%",
          right: "5%",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -25, 0],
          scale: [1, 1.18, 1],
          rotate: [0, -12, 0],
        }}
        transition={{
          duration: 11,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-2xl"
        style={{
          background: "radial-gradient(circle, hsl(280 90% 65% / 0.2), transparent 70%)",
          bottom: "25%",
          left: "30%",
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, 15, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-300/25 via-transparent to-transparent dark:from-cyan-900/25" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-300/25 via-transparent to-transparent dark:from-purple-900/25" />
      <div className="absolute inset-0 opacity-35 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pink-200/20 via-transparent to-transparent dark:from-pink-900/20" />

      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(200 90% 60% / 0.3), transparent)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}
