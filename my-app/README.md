# Vehicle Intelligence Platform

A production-ready content generation system for creating rich, data-driven vehicle comparison and overview pages using OpenAI's GPT-4o-mini.

## Features

- **AI-Powered Content Generation**: Generate comprehensive vehicle articles with OpenAI
- **Rich Interactive Components**: Comparison tables, spec grids, pros/cons, FAQs, galleries, and CTA banners
- **Dual Backend Support**: Local file system for development, GitHub API for production
- **Live Preview**: Real-time preview with schema validation
- **Sticky ToC**: Scroll-spy navigation with progress bar
- **Keyboard Shortcuts**: ⌘G to generate, ⌘P to publish
- **Dark Mode**: Full dark mode support
- **SEO Optimized**: JSON-LD schema, OpenGraph tags, and semantic HTML

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Add your environment variables:

\`\`\`env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini

# TEMP DEV ONLY: if 'true' and not production, the OpenAI SDK will set dangerouslyAllowBrowser
# WARNING: Never set this to 'true' in production! Only for local testing.
ALLOW_BROWSER_OPENAI=false

BASE_URL=http://localhost:3000

# Optional: For GitHub publishing
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
GITHUB_RAW_BASE=https://raw.githubusercontent.com/owner/repo/main
\`\`\`

4. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Generate Content

1. Navigate to `/admin/generate`
2. Enter a title (e.g., "2026 Toyota Camry vs Honda Accord")
3. Optionally add vehicle data in JSON format
4. Click "Generate" or press ⌘G
5. Preview the generated article
6. Click "Publish" or press ⌘P to make it live

### API Endpoints

#### Generate Article

\`\`\`bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2026 Toyota Camry vs Honda Accord",
    "models": [
      {"name": "Camry LE AWD", "hp": 225, "mpg": 44, "price": 27950},
      {"name": "Accord EX", "hp": 192, "mpg": 38, "price": 28990}
    ]
  }'
\`\`\`

Response:

\`\`\`json
{
  "ok": true,
  "article": {
    "title": "2026 Toyota Camry vs Honda Accord",
    "slug": "2026-toyota-camry-vs-honda-accord",
    "description": "...",
    "hero": { ... },
    "blocks": [ ... ]
  }
}
\`\`\`

#### Publish Article

\`\`\`bash
curl -X POST http://localhost:3000/api/publish \
  -H "Content-Type: application/json" \
  -d '{
    "article": { ... }
  }'
\`\`\`

Response:

\`\`\`json
{
  "ok": true,
  "url": "http://localhost:3000/articles/2026-toyota-camry-vs-honda-accord"
}
\`\`\`

#### Health Check

\`\`\`bash
curl http://localhost:3000/api/health
\`\`\`

Response:

\`\`\`json
{
  "ok": true,
  "time": "2025-01-09T12:00:00.000Z"
}
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── admin/generate/      # Admin interface
│   ├── api/                 # API routes
│   │   ├── generate/        # Content generation
│   │   ├── publish/         # Publishing
│   │   └── health/          # Health check
│   ├── articles/            # Article pages
│   │   ├── [slug]/          # Individual article
│   │   └── page.tsx         # Article listing
│   └── page.tsx             # Homepage
├── src/
│   ├── components/
│   │   ├── ArticleView.tsx  # Main article renderer
│   │   └── blocks/          # Block components
│   └── lib/
│       ├── articleSchema.ts # Zod schema
│       ├── slugify.ts       # Slug generation
│       ├── publish.ts       # Publishing logic
│       └── revalidate.ts    # Cache revalidation
├── content/
│   ├── articles/            # Published articles (JSON)
│   └── examples/            # Example data
└── tests/                   # Vitest tests
\`\`\`

## Content Schema

Articles follow a structured schema with the following block types:

- **intro**: Rich HTML introduction
- **comparisonTable**: Sortable comparison table with highlighting
- **specGrid**: Specification cards in a grid layout
- **prosCons**: Pros and cons lists
- **gallery**: Image gallery
- **faq**: Accordion FAQ section
- **ctaBanner**: Call-to-action banner
- **markdown**: Markdown content

## Testing

Run tests with Vitest:

\`\`\`bash
npm test
\`\`\`

### Manual API Testing

Test the generate API endpoint manually to verify it always returns JSON:

#### 1. Diagnostics (should return JSON)

\`\`\`bash
curl -i http://localhost:3000/api/generate?diag=1
\`\`\`

Expected response:
\`\`\`json
{
  "ok": true,
  "diag": "generate-api",
  "runtime": "nodejs",
  "hasKey": true,
  "model": "gpt-4o-mini",
  "time": "2025-01-09T12:00:00.000Z"
}
\`\`\`

#### 2. No API key (should return ok:false JSON, not HTML)

\`\`\`bash
# Temporarily unset OPENAI_API_KEY
curl -s -X POST http://localhost:3000/api/generate \
  -H "content-type: application/json" \
  -d '{"title":"2026 Toyota Camry vs Honda Accord"}' | jq
\`\`\`

Expected response:
\`\`\`json
{
  "ok": true,
  "article": { ... },
  "usedFallback": true,
  "reason": "OPENAI_API_KEY missing",
  "tookMs": 5
}
\`\`\`

#### 3. With valid API key

\`\`\`bash
# With OPENAI_API_KEY set
curl -s -X POST http://localhost:3000/api/generate \
  -H "content-type: application/json" \
  -d '{"title":"2026 Toyota Camry vs Honda Accord"}' | jq
\`\`\`

Expected response:
\`\`\`json
{
  "ok": true,
  "article": { ... },
  "usedFallback": false,
  "tookMs": 2500
}
\`\`\`

#### 4. With models data

\`\`\`bash
curl -s -X POST http://localhost:3000/api/generate \
  -H "content-type: application/json" \
  -d '{
    "title": "2026 Mid-Size Sedan Comparison",
    "models": [
      {"name": "Toyota Camry LE AWD", "hp": 225, "mpg": 44, "price": 27950},
      {"name": "Honda Accord EX", "hp": 192, "mpg": 38, "price": 28990}
    ]
  }' | jq
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### GitHub Publishing

For production deployments with GitHub publishing:

1. Create a GitHub personal access token with `repo` scope
2. Add environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
3. Published articles will be committed to your repository

## License

MIT

## Troubleshooting

**Issue**: Getting HTML error pages instead of JSON

**Solution**: Ensure you've deleted any duplicate route files (e.g., `app/api/generate/route.tsx`). Only `route.ts` should exist. Restart the dev server after deleting duplicates.

**Issue**: "browser-like environment" error from OpenAI SDK

**Solution**: The API route now automatically falls back to REST API when the SDK fails. If both fail, it returns a deterministic fallback article. Check the response for `usedFallback: true` and `reason` field.

**Issue**: Need to test with OpenAI SDK in browser-like environment

**Solution**: Set `ALLOW_BROWSER_OPENAI=true` in your `.env.local` file for local testing only. This enables `dangerouslyAllowBrowser` in the OpenAI SDK when `NODE_ENV !== 'production'`. **Never enable this in production** as it exposes your API key to the browser. The API will automatically fall back to REST API or deterministic fallback if the SDK fails.

**Issue**: Client component crashes with "Non-JSON response"

**Solution**: The admin page uses `safeFetchJson` helper that catches non-JSON responses and displays them in an error panel instead of crashing.
