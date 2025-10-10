"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface CTABannerProps {
  block: {
    heading: string
    sub?: string
    href: string
    label: string
  }
}

export function CTABanner({ block }: CTABannerProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
      <CardContent className="py-12 text-center">
        <h3 className="text-3xl font-bold mb-2">{block.heading}</h3>
        {block.sub && <p className="text-muted-foreground mb-6">{block.sub}</p>}
        <Button asChild size="lg">
          <a href={block.href}>
            {block.label}
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
