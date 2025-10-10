import { z } from "zod"

// Block schemas
const IntroBlockSchema = z.object({
  type: z.literal("intro"),
  html: z.string(),
})

const ComparisonTableBlockSchema = z.object({
  type: z.literal("comparisonTable"),
  caption: z.string().optional(),
  columns: z.array(z.string()),
  rows: z.array(z.record(z.string())),
  highlightRule: z.enum(["max", "min"]).optional(),
})

const SpecGridBlockSchema = z.object({
  type: z.literal("specGrid"),
  groups: z.array(
    z.object({
      title: z.string(),
      items: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        }),
      ),
    }),
  ),
})

const ProsConsBlockSchema = z.object({
  type: z.literal("prosCons"),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
})

const GalleryBlockSchema = z.object({
  type: z.literal("gallery"),
  images: z.array(
    z.object({
      url: z.string(),
      alt: z.string(),
    }),
  ),
})

const FAQBlockSchema = z.object({
  type: z.literal("faq"),
  items: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    }),
  ),
})

const CTABannerBlockSchema = z.object({
  type: z.literal("ctaBanner"),
  heading: z.string(),
  sub: z.string().optional(),
  href: z.string(),
  label: z.string(),
})

const MarkdownBlockSchema = z.object({
  type: z.literal("markdown"),
  md: z.string(),
})

const ArticleBlockSchema = z.discriminatedUnion("type", [
  IntroBlockSchema,
  ComparisonTableBlockSchema,
  SpecGridBlockSchema,
  ProsConsBlockSchema,
  GalleryBlockSchema,
  FAQBlockSchema,
  CTABannerBlockSchema,
  MarkdownBlockSchema,
])

// Module schemas for AI-generated enhancement modules
const TLDRModuleSchema = z.object({
  type: z.literal("tldr"),
  content: z.string(),
})

const KeyTakeawaysModuleSchema = z.object({
  type: z.literal("key_takeaways"),
  items: z.array(z.string()),
})

const QuizModuleSchema = z.object({
  type: z.literal("quiz"),
  title: z.string(),
  questions: z.array(
    z.object({
      prompt: z.string(),
      choices: z.array(z.string()),
      correctIndex: z.number(),
      explanation: z.string().optional(),
    }),
  ),
})

const MpgCalculatorModuleSchema = z.object({
  type: z.literal("mpg_calculator"),
  label: z.string().optional(),
  defaults: z
    .object({
      cityMpg: z.number().optional(),
      hwyMpg: z.number().optional(),
      fuelPrice: z.number().optional(),
      miles: z.number().optional(),
    })
    .optional(),
})

const PullQuoteModuleSchema = z.object({
  type: z.literal("pull_quote"),
  quote: z.string(),
  attribution: z.string().optional(),
})

const DropdownModuleSchema = z.object({
  type: z.literal("dropdown"),
  title: z.string(),
  body: z.string(),
})

const ReviewsModuleSchema = z.object({
  type: z.literal("reviews"),
  sources: z.array(z.string()).optional(),
  entries: z.array(
    z.object({
      author: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      summary: z.string(),
      pros: z.array(z.string()).optional(),
      cons: z.array(z.string()).optional(),
    }),
  ),
})

const ModuleBlockSchema = z.discriminatedUnion("type", [
  TLDRModuleSchema,
  KeyTakeawaysModuleSchema,
  QuizModuleSchema,
  MpgCalculatorModuleSchema,
  PullQuoteModuleSchema,
  DropdownModuleSchema,
  ReviewsModuleSchema,
])

// Main article schema
export const ArticleSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  hero: z.object({
    eyebrow: z.string().optional(),
    headline: z.string(),
    subheadline: z.string().optional(),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    badges: z.array(z.object({ label: z.string() })).optional(),
    cta: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
  }),
  toc: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    }),
  ),
  blocks: z.array(ArticleBlockSchema),
  modules: z.array(ModuleBlockSchema).optional(), // New modules property
  seo: z
    .object({
      canonical: z.string().optional(),
      ogImage: z.string().optional(),
      schema: z.unknown().optional(),
    })
    .optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

// Export types
export type Article = z.infer<typeof ArticleSchema>
export type ArticleBlock = z.infer<typeof ArticleBlockSchema>
export type ModuleBlock = z.infer<typeof ModuleBlockSchema>

// Parser with detailed error messages
export function parseArticle(data: unknown): Article {
  try {
    return ArticleSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
      throw new Error(`Article validation failed: ${formattedErrors}`)
    }
    throw error
  }
}
