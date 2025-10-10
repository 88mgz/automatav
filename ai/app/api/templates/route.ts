import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch templates from database
    const templates = [
      {
        id: "1",
        name: "Midsize Sedan Comparison",
        description: "Compare 3-4 midsize sedans with specs, features, and pricing",
        category: "Automotive",
        isDefault: true,
        usageCount: 24,
        lastUsed: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        structure: {
          blocks: ["comparisonTable", "specGrid"],
          modules: ["tldr", "keyTakeaways", "mpgCalculator", "quiz"],
        },
      },
    ]

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("[v0] Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const template = await request.json()

    console.log("[v0] Creating template:", template)

    // TODO: Save template to database
    const newTemplate = {
      id: Date.now().toString(),
      ...template,
      usageCount: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ template: newTemplate })
  } catch (error) {
    console.error("[v0] Error creating template:", error)
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}
