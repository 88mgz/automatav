"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  icon?: LucideIcon
  label: string
  value: string | number
  unit?: string
  description?: string
}

export function MetricCard({ icon: Icon, label, value, unit, description }: MetricCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="glass-card hover-lift h-full">
        <CardContent className="p-6 space-y-3">
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            <p className="text-3xl font-bold mt-1">
              {value}
              {unit && <span className="text-lg text-muted-foreground ml-1">{unit}</span>}
            </p>
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardContent>
      </Card>
    </motion.div>
  )
}
