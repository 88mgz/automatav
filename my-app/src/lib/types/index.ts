import { z } from "zod"

// Article schema with all modules
export const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string().optional(),
  canonical: z.string().url().optional(),
  intent: z.enum(["comparison", "review", "guide", "localized_dealer"]),
  schemaTarget: z.enum(["ComparisonPage", "ReviewArticle", "ModelGuide", "LocalizedDealer"]).optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  locale: z.string().optional(),
  generatedAt: z.string().optional(),
  qcSummary: z
    .object({
      pass: z.number(),
      warn: z.number(),
      fail: z.number(),
    })
    .optional(),
  blocks: z.array(z.any()),
  modules: z
    .object({
      tldr: z.any().optional(),
      keyTakeaways: z.any().optional(),
      quiz: z.any().optional(),
      mpgCalculator: z.any().optional(),
      pullQuote: z.any().optional(),
      dropdown: z.any().optional(),
      reviews: z.any().optional(),
    })
    .optional(),
})

export type Article = z.infer<typeof ArticleSchema>

// Job status and schema
export const JobStatusSchema = z.enum(["queued", "running", "preview", "blocked", "published", "failed"])
export type JobStatus = z.infer<typeof JobStatusSchema>

export const JobSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  intent: z.string(),
  template: z.string().optional(),
  status: JobStatusSchema,
  qcSummary: z
    .object({
      pass: z.number(),
      warn: z.number(),
      fail: z.number(),
    })
    .optional(),
  article: ArticleSchema.optional(),
  qcReport: z.any().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.string().optional(),
})

export type Job = z.infer<typeof JobSchema>

// Roadmap item
export const RoadmapStatusSchema = z.enum(["idea", "drafting", "in_review", "qc_passed", "scheduled", "published"])
export type RoadmapStatus = z.infer<typeof RoadmapStatusSchema>

export const RoadmapItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  intent: z.string(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  locale: z.string().optional(),
  targetSchema: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  assignee: z.string().optional(),
  status: RoadmapStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  notes: z.string().optional(),
})

export type RoadmapItem = z.infer<typeof RoadmapItemSchema>

// QC Report
export const QCRuleSeveritySchema = z.enum(["info", "warn", "fail"])
export type QCRuleSeverity = z.infer<typeof QCRuleSeveritySchema>

export const QCRuleResultSchema = z.object({
  id: z.string(),
  category: z.enum(["duplicate", "a11y", "seo", "schema", "content_quality"]),
  severity: QCRuleSeveritySchema,
  ok: z.boolean(),
  message: z.string(),
  meta: z.any().optional(),
})

export type QCRuleResult = z.infer<typeof QCRuleResultSchema>

export const QCReportSchema = z.object({
  jobId: z.string(),
  results: z.array(QCRuleResultSchema),
  summary: z.object({
    pass: z.number(),
    warn: z.number(),
    fail: z.number(),
  }),
  ranAt: z.string(),
})

export type QCReport = z.infer<typeof QCReportSchema>

// Template
export const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  prompt: z.string(),
  zodOutput: z.string(), // JSON string of Zod schema
  defaults: z.any().optional(),
  version: z.number(),
  isPublished: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type Template = z.infer<typeof TemplateSchema>

// Publish target
export const PublishTargetSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  path: z.string(),
})

export type PublishTarget = z.infer<typeof PublishTargetSchema>

// Schedule
export const ScheduleSchema = z.object({
  cron: z.string().optional(),
  date: z.string().optional(),
  nextRun: z.string().optional(),
})

export type Schedule = z.infer<typeof ScheduleSchema>
