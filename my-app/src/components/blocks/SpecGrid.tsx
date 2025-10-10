"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SpecGridProps {
  block: {
    groups: Array<{
      title: string
      items: Array<{ label: string; value: string }>
    }>
  }
}

export function SpecGrid({ block }: SpecGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {block.groups.map((group, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{group.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {group.items.map((item, j) => (
                <div key={j} className="flex justify-between items-center">
                  <dt className="text-sm text-muted-foreground">{item.label}</dt>
                  <dd className="text-sm font-semibold">{item.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
