export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getArticle, saveArticle } from "@/lib/storage"
import type { ModuleBlock } from "@/lib/articleSchema"

const RequestSchema = z.object({
  slug: z.string().optional(),
  html: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, html } = RequestSchema.parse(body)

    if (!slug && !html) {
      return NextResponse.json({ error: "Either slug or html is required" }, { status: 400 })
    }

    let article = null
    let articleContent = html || ""

    if (slug) {
      article = await getArticle(slug)
      if (!article) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }
      // Extract content from blocks for context
      articleContent = article.blocks
        .map((block: any) => {
          if (block.type === "intro") return block.html
          if (block.type === "markdown") return block.md
          return ""
        })
        .join("\n")
    }

    // Try OpenAI SDK first
    let modules: ModuleBlock[] | null = null
    let usedFallback = false
    let method = "none"

    try {
      const OpenAI = (await import("openai")).default
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      const systemPrompt = `You are an expert automotive content editor. Generate structured enhancement modules that increase engagement and decision clarity on a midsize-sedan comparison page. Output MUST be pure JSON matching the ModuleBlock[] TypeScript union provided (no markdown, no prose outside JSON). Keep to factual, generic, non-defamatory statements. For quizzes, include explanations. For calculators, prefer sensible defaults derived from the article when possible.`

      const userPrompt = `Article context:
- Title: "${article?.title || "Vehicle Comparison"}"
- Subtitle: "${article?.hero?.subheadline || ""}"
- Badges: ${JSON.stringify(article?.hero?.badges || [])}
- Content: ${articleContent.substring(0, 2000)}

Required modules (return as an array in this order if possible):
1) { "type": "tldr" } – 3-6 sentence summary.
2) { "type": "key_takeaways" } – 3-7 bullets of concrete insights (no fluff).
3) { "type": "mpg_calculator" } – include defaults using any MPG mentioned; otherwise leave defaults empty.
4) { "type": "quiz" } – 3-5 multiple-choice questions about the page's content; each with 4 choices, one correctIndex, brief explanation.
5) { "type": "pull_quote" } – 1 impactful buyer-oriented quote (no brand slander).
6) { "type": "dropdown" } – 2-3 expandable sections (e.g., "Which model is best for commuters?", "Which offers most cargo space?"); titles should be concise; body 1-3 paragraphs.
7) { "type": "reviews" } – 2-4 short synthesized review blurbs (generic, non-branded sources unless sources provided), optional rating 3.5–5.0, optional pros/cons arrays.

Output rules:
- Return ONLY valid JSON array of ModuleBlock objects.
- No markdown fences. No keys outside the schema.
- Avoid hallucinating exact prices/MPG/horsepower beyond the input; if unsure, generalize.
- Keep copy tight, scannable, and consistent with a professional dealer content tone.`

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content
      if (content) {
        const parsed = JSON.parse(content)
        modules = Array.isArray(parsed) ? parsed : parsed.modules || []
        method = "sdk"
      }
    } catch (sdkError: any) {
      console.log("[AI Modules] SDK failed, using fallback:", sdkError.message)
      usedFallback = true
    }

    // Fallback modules if OpenAI fails
    if (!modules) {
      modules = [
        {
          type: "tldr",
          content:
            "This comprehensive comparison analyzes the latest midsize sedans, evaluating performance, fuel efficiency, safety features, and value. We examine key specifications, real-world driving dynamics, and total cost of ownership to help you make an informed decision. Whether you prioritize fuel economy, technology, or driving engagement, this guide provides the insights you need.",
        },
        {
          type: "key_takeaways",
          items: [
            "Hybrid models offer significantly better fuel economy without sacrificing performance",
            "All-wheel drive is now available across most trim levels for improved traction",
            "Advanced safety features are standard, including adaptive cruise control and lane keeping",
            "Interior space and cargo capacity vary significantly between models",
            "Total cost of ownership should factor in fuel savings and maintenance costs",
          ],
        },
        {
          type: "mpg_calculator",
          label: "Estimate Your Fuel Costs",
          defaults: {
            cityMpg: 32,
            hwyMpg: 42,
            fuelPrice: 3.5,
            miles: 12000,
          },
        },
        {
          type: "quiz",
          title: "Test Your Knowledge",
          questions: [
            {
              prompt: "Which drivetrain configuration typically offers the best fuel economy?",
              choices: ["All-Wheel Drive", "Front-Wheel Drive", "Rear-Wheel Drive", "Four-Wheel Drive"],
              correctIndex: 1,
              explanation:
                "Front-wheel drive vehicles are typically lighter and have less drivetrain loss, resulting in better fuel economy compared to AWD or RWD configurations.",
            },
            {
              prompt: "What is the primary benefit of a hybrid powertrain in midsize sedans?",
              choices: [
                "Increased horsepower",
                "Lower purchase price",
                "Improved fuel efficiency",
                "Faster acceleration",
              ],
              correctIndex: 2,
              explanation:
                "Hybrid powertrains combine electric motors with gasoline engines to significantly improve fuel efficiency, especially in city driving conditions.",
            },
            {
              prompt: "Which factor has the biggest impact on long-term ownership costs?",
              choices: ["Paint color", "Fuel economy", "Wheel size", "Sunroof option"],
              correctIndex: 1,
              explanation:
                "Fuel economy directly affects your ongoing costs over the life of the vehicle, potentially saving thousands of dollars compared to less efficient models.",
            },
          ],
        },
        {
          type: "pull_quote",
          quote:
            "The modern midsize sedan segment offers an impressive blend of efficiency, technology, and comfort that rivals luxury vehicles from just a few years ago.",
          attribution: "Automotive Industry Analysis",
        },
        {
          type: "dropdown",
          title: "Which model is best for daily commuters?",
          body: "For daily commuting, prioritize fuel efficiency, comfort, and reliability. Hybrid models excel in stop-and-go traffic, offering significantly better city MPG. Look for features like adaptive cruise control, lane keeping assist, and comfortable seating for long drives. Models with lower maintenance costs and strong reliability ratings will save money over time.",
        },
        {
          type: "dropdown",
          title: "What about cargo space and practicality?",
          body: "Trunk capacity varies from 14 to 17 cubic feet across the segment. Consider your typical cargo needs - golf clubs, luggage, or grocery shopping. Some models offer split-folding rear seats for longer items. Also evaluate rear seat legroom if you frequently carry passengers. The most practical choice balances passenger comfort with cargo flexibility.",
        },
        {
          type: "reviews",
          sources: ["Automotive Press", "Consumer Reports", "Industry Analysis"],
          entries: [
            {
              author: "Professional Review",
              rating: 4.5,
              summary:
                "Excellent balance of efficiency and performance with a refined interior and advanced safety features. The hybrid powertrain is smooth and responsive.",
              pros: ["Outstanding fuel economy", "Comfortable ride", "Comprehensive safety suite"],
              cons: ["Higher initial cost", "Limited cargo space"],
            },
            {
              author: "Consumer Feedback",
              rating: 4.0,
              summary:
                "Reliable daily driver with low maintenance costs. The technology is intuitive and the build quality feels solid. Great value for the price point.",
              pros: ["Reliable", "Good value", "Easy to use tech"],
              cons: ["Road noise at highway speeds", "Base trim lacks features"],
            },
          ],
        },
      ]
      method = "fallback"
    }

// Save modules to article if slug provided
if (slug && article) {
  const updatedArticle = {
    ...article,
    modules,
    updatedAt: new Date().toISOString(),
  }
  // saveArticle expects a single payload; include slug on the object
  await saveArticle({ ...updatedArticle, slug })
}

    return NextResponse.json({
      ok: true,
      modules,
      usedFallback,
      method,
      message: usedFallback ? "Generated fallback modules" : "Generated modules successfully",
    })
  } catch (error: any) {
    console.error("[AI Modules Error]", error)
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Failed to generate modules",
      },
      { status: 500 },
    )
  }
}
