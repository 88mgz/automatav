import { describe, it, expect } from "vitest"
import { publishArticle } from "../src/lib/publish"
import type { Article } from "../src/lib/articleSchema"
import { promises as fs } from "fs"
import path from "path"

describe("Publish", () => {
  const testArticle: Article = {
    title: "Test Article",
    slug: "test-article",
    description: "A test article for unit testing",
    hero: {
      headline: "Test Headline",
      subheadline: "Test subheadline",
    },
    toc: [{ id: "intro", label: "Introduction" }],
    blocks: [
      {
        type: "intro",
        html: "<p>This is a test article.</p>",
      },
    ],
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  it("should publish article to local file system", async () => {
    const result = await publishArticle(testArticle)

    expect(result.url).toContain("/articles/test-article")

    // Verify file exists
    const filePath = path.join(process.cwd(), "content", "articles", "test-article.json")
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false)

    expect(fileExists).toBe(true)

    // Verify content
    const content = await fs.readFile(filePath, "utf-8")
    const savedArticle = JSON.parse(content)
    expect(savedArticle.title).toBe("Test Article")
    expect(savedArticle.slug).toBe("test-article")
  })

  it("should update existing article", async () => {
    const updatedArticle = {
      ...testArticle,
      title: "Updated Test Article",
    }

    const result = await publishArticle(updatedArticle)
    expect(result.url).toContain("/articles/test-article")

    const filePath = path.join(process.cwd(), "content", "articles", "test-article.json")
    const content = await fs.readFile(filePath, "utf-8")
    const savedArticle = JSON.parse(content)
    expect(savedArticle.title).toBe("Updated Test Article")
  })
})
