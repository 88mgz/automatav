import { NextResponse } from "next/server"
import type { RoadmapItem } from "@/lib/types"

// Stub: In production, this would read from a database or file system
const MOCK_ITEMS: RoadmapItem[] = [
  {
    id: "1",
    title: "2026 Midsize Sedan Comparison",
    intent: "comparison",
    make: "Honda",
    model: "Accord",
    year: 2026,
    targetSchema: "ComparisonPage",
    priority: "high",
    status: "idea",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "2026 Honda Accord Review",
    intent: "review",
    make: "Honda",
    model: "Accord",
    year: 2026,
    targetSchema: "ReviewArticle",
    priority: "medium",
    status: "drafting",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Honda Dealers in Los Angeles",
    intent: "localized_dealer",
    make: "Honda",
    locale: "los-angeles-ca",
    targetSchema: "LocalizedDealer",
    priority: "low",
    status: "in_review",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export async function GET() {
  // Stub: Return mock items
  return NextResponse.json({ items: MOCK_ITEMS })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Stub: Create new item
  const newItem: RoadmapItem = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(newItem)
}
