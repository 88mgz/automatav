"use client"

import type { SpecTableSection } from "@/lib/content-schema"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface SpecTableProps {
  section: SpecTableSection
  brandColor: string
}

export function SpecTable({ section, brandColor }: SpecTableProps) {
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
            <tbody className="divide-y divide-border">
              {section.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-sm">{row.label}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground text-right">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
