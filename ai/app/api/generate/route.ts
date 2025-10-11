import { NextResponse } from "next/server"

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const prompt = body?.prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing or invalid prompt" }, { status: 400 })
    }

    // Fallback stub (works without env)
    const titleLine = prompt.split("\n").find((l: string) => l.startsWith("Title:")) || ""
    const title = titleLine.replace(/^Title:\s*/, "").trim() || "Generated Vehicle Article"
    const slug = slugify(title || "vehicle-article")

    const article = {
      title,
      slug,
      description: "AI generated article (stub). Replace with OpenAI output when key is configured.",
      toc: ["Introduction", "Overview", "Details", "FAQ"],
      hero: {
        title,
        subtitle: "A concise overview generated from your prompt",
      },
      blocks: [
        { type: "intro", text: "This is an auto-generated introduction based on your prompt." },
        {
          type: "markdown",
          content:
            "### Overview\n\nThis content is produced by the stub generator so the UI can be exercised without an API key.",
        },
        {
          type: "comparisonTable",
          items: [
            { name: "Model A", hp: 200, mpg: 35, price: 25000 },
            { name: "Model B", hp: 210, mpg: 34, price: 26000 },
          ],
        },
        {
          type: "faq",
          items: [
            { q: "Is this real data?", a: "No, replace with OpenAI output once configured." },
            { q: "Why a stub?", a: "So the page can generate and preview immediately." },
          ],
        },
      ],
      modules: [],
    }

    return NextResponse.json({ article })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
