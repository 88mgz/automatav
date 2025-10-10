import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { articleData } = await request.json()
    const jobId = params.id

    console.log("[v0] Publishing job:", jobId)

    // TODO: Implement actual GitHub publishing
    // 1. Create/update file in GitHub repo
    // 2. Create commit with article data
    // 3. Push to branch
    // 4. Create PR if needed
    // 5. Return GitHub URL

    // Simulate publishing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock response
    const githubUrl = `https://github.com/owner/repo/blob/main/content/articles/${articleData.slug}.json`

    return NextResponse.json({
      success: true,
      githubUrl,
      commitSha: "abc123def456",
      branch: "main",
    })
  } catch (error) {
    console.error("[v0] Publishing error:", error)
    return NextResponse.json({ error: "Publishing failed" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id

    // TODO: Get publishing history from database
    const history = [
      {
        id: "1",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: "success" as const,
        githubUrl: "https://github.com/owner/repo/blob/main/content/articles/example.json",
        user: "admin",
      },
      {
        id: "2",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        status: "failed" as const,
        error: "GitHub API rate limit exceeded",
        user: "admin",
      },
    ]

    return NextResponse.json({ history })
  } catch (error) {
    console.error("[v0] Error fetching publish history:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
