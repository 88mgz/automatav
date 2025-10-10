"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, Sparkles, FileText, Zap, BarChart3, Calculator } from "lucide-react"
import { motion } from "framer-motion"
import { LiquidBlobs } from "@/components/visual/LiquidBlobs"

export default function HomePage() {
  const features = [
    {
      icon: Car,
      title: "Rich Comparisons",
      description: "Detailed spec tables, comparison matrices, and pros/cons analysis",
      gradient: "from-cyan-400 to-blue-500",
    },
    {
      icon: Sparkles,
      title: "Interactive Widgets",
      description: "Calculators, quizzes, and dynamic charts for engaging experiences",
      gradient: "from-violet-400 to-purple-500",
    },
    {
      icon: FileText,
      title: "Preview & Publish",
      description: "Generate drafts, preview instantly, and publish to live pages",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Leverage advanced AI to generate comprehensive vehicle content",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: BarChart3,
      title: "Data Visualization",
      description: "Beautiful charts and graphs that make data easy to understand",
      gradient: "from-pink-400 to-rose-500",
    },
    {
      icon: Calculator,
      title: "Smart Calculators",
      description: "Interactive tools for MPG, cost comparisons, and more",
      gradient: "from-indigo-400 to-blue-500",
    },
  ]

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <LiquidBlobs />

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Content Generation
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
              Vehicle Intelligence
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Platform
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-slate-300 text-balance max-w-3xl mx-auto leading-relaxed">
            Auto-generate rich, data-driven vehicle comparison and overview pages with interactive charts, calculators,
            and quizzes powered by AI.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              asChild
              size="lg"
              className="text-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 border-0"
            >
              <Link href="/admin/generate">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Content
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg bg-white/5 border-white/10 hover:bg-white/10"
            >
              <Link href="/articles">
                <FileText className="w-5 h-5 mr-2" />
                View Articles
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Everything you need
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Powerful features to create engaging vehicle content that converts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -4 }}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {/* Gradient glow on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity`}
                />

                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
