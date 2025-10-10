"use client"

import { motion } from "framer-motion"
import { Fuel, TrendingUp, Gauge } from "lucide-react"

interface FuelEconomyProps {
  vehicles: Array<{
    name: string
    cityMpg: string
    highwayMpg: string
    combinedMpg?: string
  }>
}

export function FuelEconomy({ vehicles }: FuelEconomyProps) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="minimal-card p-8 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            background: "radial-gradient(circle at 30% 50%, hsl(158 90% 60%), transparent 60%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-2.5 rounded-lg bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Fuel className="w-5 h-5 text-green-600 dark:text-green-400" />
            </motion.div>
            <h2 className="text-2xl font-bold">Fuel Economy Comparison</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">{vehicle.name}</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Gauge className="w-4 h-4" />
                        <span>City</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {vehicle.cityMpg}
                        <span className="text-sm font-normal text-slate-500 ml-1">MPG</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>Highway</span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {vehicle.highwayMpg}
                        <span className="text-sm font-normal text-slate-500 ml-1">MPG</span>
                      </div>
                    </div>

                    {vehicle.combinedMpg && (
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">Combined</span>
                          <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {vehicle.combinedMpg}
                            <span className="text-sm font-normal text-slate-500 ml-1">MPG</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-100"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
