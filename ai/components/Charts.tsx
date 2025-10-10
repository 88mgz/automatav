"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  ResponsiveContainer,
  BarChart, LineChart, PieChart,
  Bar, Line, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts"

type ChartKind = "bar" | "line" | "pie"

interface ChartSection {
  title?: string
  kind: ChartKind
  data: any[]
  xKey?: string
  yKey?: string
  dataKey?: string
  nameKey?: string
}

export interface ChartsProps {
  section: ChartSection
  /** Optional brand color to tint series */
  brandColor?: string
}

export function Charts({ section, brandColor }: ChartsProps) {
  const title = section.title ?? "Chart"

  // Always return a chart element (never null)
  const renderChart = (): React.ReactElement => {
    if (section.kind === "bar") {
      const xKey = section.xKey ?? "name"
      const yKey = section.yKey ?? "value"
      return (
        <BarChart data={section.data ?? []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill={brandColor} />
        </BarChart>
      )
    }

    if (section.kind === "line") {
      const xKey = section.xKey ?? "name"
      const yKey = section.yKey ?? "value"
      return (
        <LineChart data={section.data ?? []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={yKey} dot={false} stroke={brandColor} />
        </LineChart>
      )
    }

    if (section.kind === "pie") {
      const dataKey = section.dataKey ?? "value"
      const nameKey = section.nameKey ?? "name"
      const data = section.data ?? []
      return (
        <PieChart>
          <Tooltip />
          <Legend />
          <Pie data={data} dataKey={dataKey} nameKey={nameKey} outerRadius={100}>
            {data.map((_, i) => (
              <Cell key={i} fill={brandColor} />
            ))}
          </Pie>
        </PieChart>
      )
    }

    // Fallback (shouldn’t happen with our union, but keeps TS happy)
    return (
      <BarChart data={[]}>
        <XAxis />
        <YAxis />
      </BarChart>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
