"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fuel } from "lucide-react"
import { EdgeChip } from "../skins/EdgeChip"

interface MpgCalculatorProps {
  label?: string
  defaults?: {
    cityMpg?: number
    hwyMpg?: number
    fuelPrice?: number
    miles?: number
  }
}

export function MpgCalculator({ label = "Fuel Cost Calculator", defaults = {} }: MpgCalculatorProps) {
  const [cityMpg, setCityMpg] = useState(defaults.cityMpg || 28)
  const [hwyMpg, setHwyMpg] = useState(defaults.hwyMpg || 36)
  const [fuelPrice, setFuelPrice] = useState(defaults.fuelPrice || 3.5)
  const [miles, setMiles] = useState(defaults.miles || 12000)

  const cityCost = (miles / cityMpg) * fuelPrice
  const hwyCost = (miles / hwyMpg) * fuelPrice
  const mixedCost = ((miles * 0.6) / cityMpg + (miles * 0.4) / hwyMpg) * fuelPrice

  return (
    <div className="minimal-card p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Fuel className="w-5 h-5 text-[var(--pair-1-a)]" />
        <h3 className="text-xl font-bold">{label}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cityMpg" className="text-sm font-medium">
            City MPG
          </Label>
          <Input
            id="cityMpg"
            type="number"
            value={cityMpg}
            onChange={(e) => setCityMpg(Number.parseFloat(e.target.value) || 0)}
            className="mt-2 border-hairline"
            style={{ borderRadius: "var(--r-sm)" }}
          />
        </div>
        <div>
          <Label htmlFor="hwyMpg" className="text-sm font-medium">
            Highway MPG
          </Label>
          <Input
            id="hwyMpg"
            type="number"
            value={hwyMpg}
            onChange={(e) => setHwyMpg(Number.parseFloat(e.target.value) || 0)}
            className="mt-2 border-hairline"
            style={{ borderRadius: "var(--r-sm)" }}
          />
        </div>
        <div>
          <Label htmlFor="fuelPrice" className="text-sm font-medium">
            Fuel Price ($/gal)
          </Label>
          <Input
            id="fuelPrice"
            type="number"
            step="0.01"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(Number.parseFloat(e.target.value) || 0)}
            className="mt-2 border-hairline"
            style={{ borderRadius: "var(--r-sm)" }}
          />
        </div>
        <div>
          <Label htmlFor="miles" className="text-sm font-medium">
            Annual Miles
          </Label>
          <Input
            id="miles"
            type="number"
            value={miles}
            onChange={(e) => setMiles(Number.parseFloat(e.target.value) || 0)}
            className="mt-2 border-hairline"
            style={{ borderRadius: "var(--r-sm)" }}
          />
        </div>
      </div>

      <div className="pt-4 border-hairline border-none border-t-0">
        <div className="flex flex-wrap justify-center gap-8 border-none py-2.5">
          <EdgeChip value={cityCost} unit="$/year" label="City Driving" />
          <EdgeChip value={hwyCost} unit="$/year" label="Highway Driving" />
          <EdgeChip value={mixedCost} unit="$/year" label="Mixed (60/40)" />
        </div>
      </div>
    </div>
  )
}
