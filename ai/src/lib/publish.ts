import type { Article } from "./articleSchema"
import { revalidateArticle } from "./revalidate"

const BASE_URL = process.env.BASE_URL || "http://localhost:3000"
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GITHUB_OWNER = process.env.GITHUB_OWNER
const GITHUB_REPO = process.env.GITHUB_REPO

export async function publishArticle(article: Article): Promise<{ url: string }> {
  const filePath = `content/articles/${article.slug}.json`
  const content = JSON.stringify(article, null, 2)

  // Check if we should use GitHub API (production)
  if (GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO) {
    await publishToGitHub(filePath, content, article.slug)
  } else {
    // Local file system (development)
    await publishToLocal(filePath, content)
  }

  // Revalidate the article pages
  revalidateArticle(article.slug)

  const url = `${BASE_URL}/articles/${article.slug}`
  return { url }
}

async function publishToLocal(filePath: string, content: string): Promise<void> {
  // Dynamic import to avoid issues in edge runtime
  const fs = await import("fs/promises")
  const path = await import("path")

  const fullPath = path.join(process.cwd(), filePath)
  const dir = path.dirname(fullPath)

  // Ensure directory exists
  await fs.mkdir(dir, { recursive: true })

  // Write file
  await fs.writeFile(fullPath, content, "utf-8")
}

async function publishToGitHub(filePath: string, content: string, slug: string): Promise<void> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`

  // First, try to get the file to see if it exists (for updates)
  let sha: string | undefined
  try {
    const getResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (getResponse.ok) {
      const data = await getResponse.json()
      sha = data.sha
    }
  } catch (error) {
    // File doesn't exist, that's okay
  }

  // Create or update the file
  const message = sha ? `feat(content): update ${slug}` : `feat(content): add ${slug}`

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      sha,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to publish to GitHub: ${error}`)
  }
}
