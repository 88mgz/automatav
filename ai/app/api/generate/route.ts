import { NextResponse } from "next/server"
import { getOpenAI, defaultModel } from "@/lib/ai"

type ReqBody = {
  prompt?: string
  system?: string
  model?: string
  temperature?: number
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""
    let body: ReqBody = {}

    if (contentType.includes("application/json")) {
      body = await req.json()
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData()
      body = {
        prompt: String(form.get("prompt") || ""),
        system: form.get("system") ? String(form.get("system")) : undefined,
        model: form.get("model") ? String(form.get("model")) : undefined,
        temperature: form.get("temperature")
          ? Number(form.get("temperature"))
          : undefined,
      }
    } else {
      // Try query param as a last resort
      const url = new URL(req.url)
      const q = url.searchParams.get("prompt") || undefined
      body = { prompt: q }
    }

    const prompt = (body.prompt || "").trim()
    if (!prompt || prompt.length < 5) {
      return NextResponse.json(
        { error: "Missing or invalid prompt (need a non-empty string ≥ 5 chars)" },
        { status: 400 }
      )
    }

    // If no key present, return a friendly error (dev UX)
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server" },
        { status: 500 }
      )
    }

    const openai = getOpenAI()
    const model = body.model || defaultModel
    const temperature =
      typeof body.temperature === "number" ? body.temperature : 0.7

    const system = body.system || "You are a helpful assistant that writes clean, factual content."

    // Responses API (chat/completions) — choose either one depending on your SDK version.
    // Using "responses" for current SDKs:
    const resp = await openai.responses.create({
      model,
      temperature,
      input: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
    } as any) // 'as any' to avoid strict version friction

    // Extract text (works with current SDK objects)
    const text =
      (resp as any)?.output_text ??
      (resp as any)?.content?.[0]?.text ??
      JSON.stringify(resp)

    return NextResponse.json({
      ok: true,
      model,
      temperature,
      promptLength: prompt.length,
      output: text,
    })
  } catch (err: any) {
    console.error("Generate API error:", err)
    return NextResponse.json(
      { error: err?.message || "Generation failed" },
      { status: 500 }
    )
  }
}
