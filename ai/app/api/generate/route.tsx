import { type NextRequest, NextResponse } from "next/server"
import { ArticleSchema } from "@/lib/articleSchema"
import { slugify } from "@/lib/slugify"

export const runtime = "nodejs"

// GET /api/generate - Diagnostics endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Generate API is running",
    timestamp: new Date().toISOString(),
    env: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      openAIModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
      allowBrowser: process.env.ALLOW_BROWSER_OPENAI === "true",
    },
  })
}

// POST /api/generate - Generate article with fallback chain
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({
        success: false,
        error: "Missing or invalid prompt",
        article: null,
        usedFallback: false,
      })
    }

    // Try OpenAI SDK first
    let article = await tryOpenAISDK(prompt)
    if (article) {
      return NextResponse.json({
        success: true,
        article,
        usedFallback: false,
        method: "sdk",
      })
    }

    // Fall back to REST API
    article = await tryOpenAIREST(prompt)
    if (article) {
      return NextResponse.json({
        success: true,
        article,
        usedFallback: false,
        method: "rest",
      })
    }

    // Fall back to deterministic article
const fallback = buildFallbackArticle(prompt) as any
if (fallback?.hero && typeof fallback.hero.image === 'string') {
  fallback.hero.image = { url: fallback.hero.image, alt: fallback.hero?.headline ?? 'Hero image' }
}
article = fallback
    return NextResponse.json({
      success: true,
      article,
      usedFallback: true,
      method: "fallback",
    })
  } catch (error) {
    console.error("[Generate API Error]", error)
    // Even on error, return JSON with fallback article
    const fallbackArticle = buildFallbackArticle("Error occurred")
    return NextResponse.json({
      success: true,
      article: fallbackArticle,
      usedFallback: true,
      method: "fallback",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// Try OpenAI SDK (with optional browser support)
async function tryOpenAISDK(prompt: string) {
  try {
    const { default: OpenAI } = await import("openai")

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.log("[SDK] No API key, skipping SDK")
      return null
    }

    const allowBrowser = process.env.ALLOW_BROWSER_OPENAI === "true"
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: allowBrowser,
    })

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini"

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a vehicle intelligence content generator. Generate detailed, accurate articles about vehicles in JSON format matching the provided schema.",
        },
        {
          role: "user",
          content: `Generate a comprehensive vehicle intelligence article for: ${prompt}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      console.log("[SDK] No content in response")
      return null
    }

    const parsed = JSON.parse(content)
    const validated = ArticleSchema.parse(parsed)
    return validated
  } catch (error) {
    console.log("[SDK] Failed:", error instanceof Error ? error.message : error)
    return null
  }
}

// Try OpenAI REST API
async function tryOpenAIREST(prompt: string) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.log("[REST] No API key, skipping REST")
      return null
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini"

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are a vehicle intelligence content generator. Generate detailed, accurate articles about vehicles in JSON format matching the provided schema.",
          },
          {
            role: "user",
            content: `Generate a comprehensive vehicle intelligence article for: ${prompt}`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.log("[REST] HTTP error:", response.status)
      return null
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      console.log("[REST] No content in response")
      return null
    }

    const parsed = JSON.parse(content)
    const validated = ArticleSchema.parse(parsed)
    return validated
  } catch (error) {
    console.log("[REST] Failed:", error instanceof Error ? error.message : error)
    return null
  }
}

// Build deterministic fallback article
function buildFallbackArticle(prompt: string) {
  const slug = slugify(prompt)
  const title = prompt || "Vehicle Comparison"

  return {
    slug,
    title,
    description: `A comprehensive comparison and overview of ${title}`,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: {
      name: "AI Content Generator",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    hero: {
      eyebrow: "Vehicle Intelligence",
      headline: title,
      subheadline: `A detailed comparison and overview of different vehicle models, including specifications, performance comparisons and expert answers`,
      image: "/diverse-city-street.png",
      badges: [{ label: "Updated 2026" }, { label: "Expert Analysis" }, { label: "Comprehensive Data" }],
      cta: {
        text: "Compare Models",
        href: "#comparison",
      },
    },
    toc: [
      { id: "overview", label: "Overview" },
      { id: "comparison", label: "Comparison" },
      { id: "specifications", label: "Specifications" },
      { id: "pros-cons", label: "Pros & Cons" },
      { id: "faq", label: "FAQ" },
    ],
    blocks: [
      {
        type: "intro" as const,
        html: `<p>This comprehensive guide provides detailed information about ${title}, including specifications, comparisons, and expert insights to help you make an informed decision.</p>`,
      },
      {
        type: "comparisonTable" as const,
        title: "Model Comparison",
        columns: ["Feature", "Model A", "Model B", "Model C"],
        rows: [
          { Feature: "Price", "Model A": "$27,950", "Model B": "$32,450", "Model C": "$29,800" },
          { Feature: "MPG", "Model A": "45", "Model B": "42", "Model C": "48" },
          { Feature: "Horsepower", "Model A": "203 hp", "Model B": "250 hp", "Model C": "220 hp" },
          { Feature: "0-60 mph", "Model A": "7.2s", "Model B": "6.1s", "Model C": "6.8s" },
        ],
        caption: "Comparison of key specifications across models",
        highlightRule: "max" as const,
      },
      {
        type: "specGrid" as const,
        title: "Detailed Specifications",
        groups: [
          {
            title: "Performance",
            items: [
              { label: "Engine", value: "2.5L 4-Cylinder" },
              { label: "Horsepower", value: "203 hp @ 6,000 rpm" },
              { label: "Torque", value: "184 lb-ft @ 4,000 rpm" },
              { label: "Transmission", value: "CVT Automatic" },
            ],
          },
          {
            title: "Efficiency",
            items: [
              { label: "City MPG", value: "43" },
              { label: "Highway MPG", value: "47" },
              { label: "Combined MPG", value: "45" },
              { label: "Fuel Tank", value: "13.2 gallons" },
            ],
          },
          {
            title: "Dimensions",
            items: [
              { label: "Length", value: "192.1 in" },
              { label: "Width", value: "72.4 in" },
              { label: "Height", value: "56.9 in" },
              { label: "Wheelbase", value: "111.2 in" },
            ],
          },
        ],
      },
      {
        type: "prosCons" as const,
        title: "Pros & Cons",
        pros: [
          "Excellent fuel economy",
          "Spacious interior with premium materials",
          "Advanced safety features standard",
          "Smooth and comfortable ride",
        ],
        cons: [
          "CVT transmission may feel less responsive",
          "Limited cargo space compared to competitors",
          "Higher price point in segment",
        ],
      },
      {
        type: "faq" as const,
        title: "Frequently Asked Questions",
        items: [
          {
            q: "What is the fuel economy?",
            a: "The vehicle achieves an impressive 45 MPG combined (43 city / 47 highway), making it one of the most efficient in its class.",
          },
          {
            q: "What safety features are included?",
            a: "Standard safety features include adaptive cruise control, lane departure warning, automatic emergency braking, and blind spot monitoring.",
          },
          {
            q: "Is all-wheel drive available?",
            a: "Yes, all-wheel drive is available as an option on most trim levels, adding approximately $1,500 to the base price.",
          },
        ],
      },
      {
        type: "ctaBanner" as const,
        title: "Ready to Learn More?",
        description: "Get detailed pricing, schedule a test drive, or compare with other models.",
        primaryCta: {
          text: "Get Pricing",
          href: "#pricing",
        },
        secondaryCta: {
          text: "Schedule Test Drive",
          href: "#test-drive",
        },
      },
    ],
    seo: {
      canonical: `https://example.com/articles/${slug}`,
      ogImage: "/diverse-city-street.png",
    },
  }
}
