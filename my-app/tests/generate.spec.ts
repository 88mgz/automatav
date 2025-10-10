import { describe, it, expect } from "vitest"
import { parseArticle } from "../src/lib/articleSchema"

describe("Generate API", () => {
  it("should generate valid article from API", async () => {
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "2026 Toyota Camry vs Honda Accord",
        models: [
          { name: "Camry LE AWD 2026", hp: 225, mpg: 44, price: 27950 },
          { name: "Accord EX 2026", hp: 192, mpg: 38, price: 28990 },
        ],
      }),
    })

    expect(response.ok).toBe(true)

    const data = await response.json()
    expect(data.ok).toBe(true)
    expect(data.article).toBeDefined()

    // Validate against schema
    const article = parseArticle(data.article)
    expect(article.title).toBe("2026 Toyota Camry vs Honda Accord")
    expect(article.slug).toBeTruthy()
    expect(article.blocks).toBeInstanceOf(Array)
    expect(article.blocks.length).toBeGreaterThan(0)
  })

  it("should return error for missing title", async () => {
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    expect(response.ok).toBe(false)
    const data = await response.json()
    expect(data.ok).toBe(false)
    expect(data.error).toContain("Title")
  })
})
