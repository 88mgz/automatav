"use client"

import type { ComparisonMatrixSection } from "@/lib/content-schema"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface ComparisonMatrixProps {
  section: ComparisonMatrixSection
  brandColor: string
}

export function ComparisonMatrix({ section, brandColor }: ComparisonMatrixProps) {
  return (
    <Card>
      {section.title && (
        <CardHeader>
          <CardTitle>{section.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-left text-sm font-semibold">Specification</th>
                {section.columns.map((col, idx) => (
                  <th key={idx} className="py-3 px-4 text-left text-sm font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {section.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-sm">{row.label}</td>
                  {row.values.map((val, valIdx) => (
                    <td key={valIdx} className="py-3 px-4 text-sm text-muted-foreground">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
