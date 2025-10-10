import { z } from "zod"

// Section type discriminated union
const RichSectionSchema = z.object({
  type: z.literal("rich"),
  html: z.string(),
})

const SpecTableSchema = z.object({
  type: z.literal("spec_table"),
  title: z.string().optional(),
  rows: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
})

const ComparisonMatrixSchema = z.object({
  type: z.literal("comparison_matrix"),
  title: z.string().optional(),
  columns: z.array(z.string()),
  rows: z.array(
    z.object({
      label: z.string(),
      values: z.array(z.union([z.string(), z.number()])),
    }),
  ),
})

const FAQSchema = z.object({
  type: z.literal("faq"),
  items: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    }),
  ),
})

const QuizSchema = z.object({
  type: z.literal("quiz"),
  title: z.string(),
  questions: z.array(
    z.object({
      prompt: z.string(),
      choices: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
          score: z.number().optional(),
        }),
      ),
      correct: z.string().optional(),
    }),
  ),
  scoring: z
    .object({
      correctPoints: z.number().optional(),
      wrongPoints: z.number().optional(),
      showResults: z.boolean().optional(),
    })
    .optional(),
})

const CalculatorSchema = z.object({
  type: z.literal("calculator"),
  title: z.string(),
  inputs: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      defaultValue: z.number().optional(),
    }),
  ),
  formula: z.string(),
  outputLabel: z.string(),
  units: z.string().optional(),
})

const ChartSchema = z.object({
  type: z.literal("chart"),
  title: z.string().optional(),
  kind: z.enum(["bar", "line", "pie"]),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    }),
  ),
  xLabel: z.string().optional(),
  yLabel: z.string().optional(),
})

// Discriminated union of all section types
const SectionSchema = z.discriminatedUnion("type", [
  RichSectionSchema,
  SpecTableSchema,
  ComparisonMatrixSchema,
  FAQSchema,
  QuizSchema,
  CalculatorSchema,
  ChartSchema,
])

// Main content document schema
export const ContentDocSchema = z.object({
  meta: z.object({
    slug: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    vertical: z.enum(["vehicles", "generic"]),
    brand: z.object({
      primary: z.string(),
      secondary: z.string().optional(),
    }),
    hero: z
      .object({
        image: z.string().optional(),
        tagline: z.string().optional(),
      })
      .optional(),
  }),
  sections: z.array(SectionSchema),
  ctas: z
    .array(
      z.object({
        label: z.string(),
        href: z.string(),
      }),
    )
    .optional(),
})

export type ContentDoc = z.infer<typeof ContentDocSchema>
export type Section = z.infer<typeof SectionSchema>
export type RichSection = z.infer<typeof RichSectionSchema>
export type SpecTableSection = z.infer<typeof SpecTableSchema>
export type ComparisonMatrixSection = z.infer<typeof ComparisonMatrixSchema>
export type FAQSection = z.infer<typeof FAQSchema>
export type QuizSection = z.infer<typeof QuizSchema>
export type CalculatorSection = z.infer<typeof CalculatorSchema>
export type ChartSection = z.infer<typeof ChartSchema>
