"use client"

import type { ChartSection } from "@/lib/content-schema"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ChartsProps {
  section: ChartSection
  brandColor: string
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

export function Charts({ section, brandColor }: ChartsProps) {
  const data = section.data.map((item) => ({
    name: item.label,
    value: item.value,
  }))

  return (
    <Card>
      {section.title && (
        <CardHeader>
          <CardTitle>{section.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {section.kind === "bar" && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Legend />
              <Bar dataKey="value" fill={brandColor} />
            </BarChart>
          )}

          {section.kind === "line" && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={brandColor} strokeWidth={2} />
            </LineChart>
          )}

          {section.kind === "pie" && (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label
                outerRadius={100}
                fill={brandColor}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
