"use client"

import { useState, useEffect } from "react"
import { Parser } from "expr-eval"
import type { CalculatorSection } from "@/lib/content-schema"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"

interface CalculatorProps {
  section: CalculatorSection
  brandColor: string
}

export function Calculator({ section, brandColor }: CalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    section.inputs.forEach((input) => {
      initial[input.key] = input.defaultValue || 0
    })
    return initial
  })

  const [result, setResult] = useState<number>(0)

  useEffect(() => {
    try {
      const parser = new Parser()
      const expr = parser.parse(section.formula)
      const calculated = expr.evaluate(values)
      setResult(calculated)
    } catch (error) {
      console.error("Calculator error:", error)
      setResult(0)
    }
  }, [values, section.formula])

  const handleChange = (key: string, value: number[]) => {
    setValues({ ...values, [key]: value[0] })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {section.inputs.map((input) => (
          <div key={input.key} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>{input.label}</Label>
              <span className="text-sm font-mono font-semibold">{values[input.key].toLocaleString()}</span>
            </div>
            <Slider
              value={[values[input.key]]}
              onValueChange={(value) => handleChange(input.key, value)}
              min={0}
              max={input.key.includes("price") || input.key.includes("Price") ? 100000 : 100}
              step={input.key.includes("price") || input.key.includes("Price") ? 1000 : 1}
              className="w-full"
            />
          </div>
        ))}

        <div className="pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">{section.outputLabel}</p>
            <div className="text-4xl font-bold" style={{ color: brandColor }}>
              {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              {section.units && <span className="text-2xl ml-2">{section.units}</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
