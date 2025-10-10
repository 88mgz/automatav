import { z } from "zod"
import type { Article } from "@/lib/types"

export const QCRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["duplicate", "accessibility", "seo", "schema", "content"]),
  severity: z.enum(["error", "warning", "info"]),
  enabled: z.boolean(),
  description: z.string(),
})

export type QCRule = z.infer<typeof QCRuleSchema>

export const QCResultSchema = z.object({
  ruleId: z.string(),
  passed: z.boolean(),
  severity: z.enum(["error", "warning", "info"]),
  message: z.string(),
  details: z.any().optional(),
  location: z.string().optional(),
})

export type QCResult = z.infer<typeof QCResultSchema>

// QC Rule Definitions
export const QC_RULES: QCRule[] = [
  // Duplicate Detection
  {
    id: "duplicate-title",
    name: "Duplicate Title Check",
    category: "duplicate",
    severity: "error",
    enabled: true,
    description: "Checks if article title already exists in published articles",
  },
  {
    id: "duplicate-slug",
    name: "Duplicate Slug Check",
    category: "duplicate",
    severity: "error",
    enabled: true,
    description: "Checks if article slug already exists",
  },
  {
    id: "content-similarity",
    name: "Content Similarity Check",
    category: "duplicate",
    severity: "warning",
    enabled: true,
    description: "Checks for high similarity with existing articles (>80%)",
  },

  // Accessibility
  {
    id: "alt-text",
    name: "Image Alt Text",
    category: "accessibility",
    severity: "error",
    enabled: true,
    description: "All images must have descriptive alt text",
  },
  {
    id: "heading-hierarchy",
    name: "Heading Hierarchy",
    category: "accessibility",
    severity: "warning",
    enabled: true,
    description: "Headings must follow proper hierarchy (h1 → h2 → h3)",
  },
  {
    id: "aria-labels",
    name: "ARIA Labels",
    category: "accessibility",
    severity: "warning",
    enabled: true,
    description: "Interactive elements must have ARIA labels",
  },
  {
    id: "color-contrast",
    name: "Color Contrast",
    category: "accessibility",
    severity: "error",
    enabled: true,
    description: "Text must meet WCAG AA contrast ratio (4.5:1)",
  },

  // SEO
  {
    id: "meta-title",
    name: "Meta Title",
    category: "seo",
    severity: "error",
    enabled: true,
    description: "Meta title must be 50-60 characters",
  },
  {
    id: "meta-description",
    name: "Meta Description",
    category: "seo",
    severity: "error",
    enabled: true,
    description: "Meta description must be 150-160 characters",
  },
  {
    id: "h1-tag",
    name: "H1 Tag",
    category: "seo",
    severity: "error",
    enabled: true,
    description: "Article must have exactly one H1 tag",
  },
  {
    id: "internal-links",
    name: "Internal Links",
    category: "seo",
    severity: "warning",
    enabled: true,
    description: "Article should have 2-5 internal links",
  },

  // Schema Parity
  {
    id: "required-fields",
    name: "Required Fields",
    category: "schema",
    severity: "error",
    enabled: true,
    description: "All required schema fields must be present",
  },
  {
    id: "field-types",
    name: "Field Types",
    category: "schema",
    severity: "error",
    enabled: true,
    description: "All fields must match expected types",
  },
  {
    id: "module-structure",
    name: "Module Structure",
    category: "schema",
    severity: "error",
    enabled: true,
    description: "AI modules must match expected structure",
  },

  // Content Quality
  {
    id: "readability",
    name: "Readability Score",
    category: "content",
    severity: "warning",
    enabled: true,
    description: "Content should have Flesch reading ease score > 60",
  },
  {
    id: "word-count",
    name: "Word Count",
    category: "content",
    severity: "warning",
    enabled: true,
    description: "Article should be 800-2000 words",
  },
  {
    id: "completeness",
    name: "Content Completeness",
    category: "content",
    severity: "error",
    enabled: true,
    description: "All sections must have content (no empty blocks)",
  },
  {
    id: "accuracy",
    name: "Data Accuracy",
    category: "content",
    severity: "error",
    enabled: true,
    description: "Numerical data must be realistic and consistent",
  },
]

// QC Rule Execution Functions
export async function runQCChecks(article: Article, existingArticles: Article[]): Promise<QCResult[]> {
  const results: QCResult[] = []

  // Run each enabled rule
  for (const rule of QC_RULES.filter((r) => r.enabled)) {
    try {
      const result = await executeRule(rule, article, existingArticles)
      results.push(result)
    } catch (error) {
      results.push({
        ruleId: rule.id,
        passed: false,
        severity: "error",
        message: `Rule execution failed: ${error}`,
      })
    }
  }

  return results
}

async function executeRule(rule: QCRule, article: Article, existingArticles: Article[]): Promise<QCResult> {
  switch (rule.id) {
    case "duplicate-title":
      return checkDuplicateTitle(article, existingArticles)
    case "duplicate-slug":
      return checkDuplicateSlug(article, existingArticles)
    case "content-similarity":
      return checkContentSimilarity(article, existingArticles)
    case "alt-text":
      return checkAltText(article)
    case "heading-hierarchy":
      return checkHeadingHierarchy(article)
    case "meta-title":
      return checkMetaTitle(article)
    case "meta-description":
      return checkMetaDescription(article)
    case "h1-tag":
      return checkH1Tag(article)
    case "required-fields":
      return checkRequiredFields(article)
    case "completeness":
      return checkCompleteness(article)
    case "word-count":
      return checkWordCount(article)
    default:
      return {
        ruleId: rule.id,
        passed: true,
        severity: "info",
        message: "Rule not implemented yet",
      }
  }
}

// Individual rule implementations
function checkDuplicateTitle(article: Article, existing: Article[]): QCResult {
  const duplicate = existing.find((a) => a.title.toLowerCase() === article.title.toLowerCase())
  return {
    ruleId: "duplicate-title",
    passed: !duplicate,
    severity: "error",
    message: duplicate ? `Duplicate title found: "${duplicate.title}" (${duplicate.slug})` : "Title is unique",
  }
}

function checkDuplicateSlug(article: Article, existing: Article[]): QCResult {
  const duplicate = existing.find((a) => a.slug === article.slug)
  return {
    ruleId: "duplicate-slug",
    passed: !duplicate,
    severity: "error",
    message: duplicate ? `Duplicate slug found: ${duplicate.slug}` : "Slug is unique",
  }
}

function checkContentSimilarity(article: Article, existing: Article[]): QCResult {
  // Simplified similarity check - in production, use proper text similarity algorithm
  const articleText = JSON.stringify(article.blocks).toLowerCase()

  for (const existingArticle of existing) {
    const existingText = JSON.stringify(existingArticle.blocks).toLowerCase()
    const similarity = calculateSimilarity(articleText, existingText)

    if (similarity > 0.8) {
      return {
        ruleId: "content-similarity",
        passed: false,
        severity: "warning",
        message: `High similarity (${Math.round(similarity * 100)}%) with "${existingArticle.title}"`,
        details: { similarArticle: existingArticle.slug, similarity },
      }
    }
  }

  return {
    ruleId: "content-similarity",
    passed: true,
    severity: "info",
    message: "Content is unique",
  }
}

function calculateSimilarity(text1: string, text2: string): number {
  // Simple Jaccard similarity - replace with better algorithm in production
  const words1 = new Set(text1.split(/\s+/))
  const words2 = new Set(text2.split(/\s+/))
  const intersection = new Set([...words1].filter((x) => words2.has(x)))
  const union = new Set([...words1, ...words2])
  return intersection.size / union.size
}

function checkAltText(article: Article): QCResult {
  const issues: string[] = []

  // Check hero image
  if (article.hero?.image && !article.hero.image.alt) {
    issues.push("Hero image missing alt text")
  }

  // Check blocks for images
  article.blocks.forEach((block, index) => {
    if (block.type === "comparisonTable" || block.type === "specGrid") {
      block.items?.forEach((item, itemIndex) => {
        if (item.image && !item.image.alt) {
          issues.push(`Block ${index + 1}, item ${itemIndex + 1}: Missing alt text`)
        }
      })
    }
  })

  return {
    ruleId: "alt-text",
    passed: issues.length === 0,
    severity: "error",
    message: issues.length > 0 ? `${issues.length} image(s) missing alt text` : "All images have alt text",
    details: issues.length > 0 ? { issues } : undefined,
  }
}

function checkHeadingHierarchy(article: Article): QCResult {
  // Simplified check - in production, parse actual HTML/content
  return {
    ruleId: "heading-hierarchy",
    passed: true,
    severity: "info",
    message: "Heading hierarchy check not fully implemented",
  }
}

function checkMetaTitle(article: Article): QCResult {
  const length = article.title.length
  const passed = length >= 50 && length <= 60

  return {
    ruleId: "meta-title",
    passed,
    severity: "error",
    message: passed
      ? `Meta title length is optimal (${length} chars)`
      : `Meta title should be 50-60 chars (currently ${length})`,
  }
}

function checkMetaDescription(article: Article): QCResult {
  const desc = article.hero?.subtitle || ""
  const length = desc.length
  const passed = length >= 150 && length <= 160

  return {
    ruleId: "meta-description",
    passed,
    severity: "error",
    message: passed
      ? `Meta description length is optimal (${length} chars)`
      : `Meta description should be 150-160 chars (currently ${length})`,
  }
}

function checkH1Tag(article: Article): QCResult {
  // Article title serves as H1
  return {
    ruleId: "h1-tag",
    passed: !!article.title,
    severity: "error",
    message: article.title ? "H1 tag present" : "Missing H1 tag",
  }
}

function checkRequiredFields(article: Article): QCResult {
  const missing: string[] = []

  if (!article.title) missing.push("title")
  if (!article.slug) missing.push("slug")
  if (!article.hero) missing.push("hero")
  if (!article.blocks || article.blocks.length === 0) missing.push("blocks")

  return {
    ruleId: "required-fields",
    passed: missing.length === 0,
    severity: "error",
    message: missing.length > 0 ? `Missing required fields: ${missing.join(", ")}` : "All required fields present",
  }
}

function checkCompleteness(article: Article): QCResult {
  const emptyBlocks: number[] = []

  article.blocks.forEach((block, index) => {
    if (block.type === "comparisonTable" || block.type === "specGrid") {
      if (!block.items || block.items.length === 0) {
        emptyBlocks.push(index + 1)
      }
    }
  })

  return {
    ruleId: "completeness",
    passed: emptyBlocks.length === 0,
    severity: "error",
    message: emptyBlocks.length > 0 ? `Empty blocks found: ${emptyBlocks.join(", ")}` : "All blocks have content",
  }
}

function checkWordCount(article: Article): QCResult {
  // Estimate word count from blocks
  const text = JSON.stringify(article.blocks)
  const wordCount = text.split(/\s+/).length
  const passed = wordCount >= 800 && wordCount <= 2000

  return {
    ruleId: "word-count",
    passed,
    severity: "warning",
    message: passed
      ? `Word count is optimal (${wordCount} words)`
      : `Word count should be 800-2000 (currently ${wordCount})`,
  }
}
