"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Eye,
  Upload,
  Loader2,
  Download,
  Copy,
  Check,
  AlertCircle,
  Wand2,
  FileJson,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArticleView } from "@/components/ArticleView"
import { parseArticle, type Article } from "@/lib/articleSchema"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LiquidBlobs } from "@/components/visual/LiquidBlobs"

const SAMPLE_DATA = {
  title: "2026 Midsize Sedan Comparison: Honda Accord vs Toyota Camry vs Mazda6",
  tldr: "The 2026 Honda Accord, Toyota Camry, and Mazda6 represent the best midsize sedans on the market. The Accord excels in fuel economy and cargo space, the Camry offers legendary reliability and available AWD, while the Mazda6 provides upscale styling at the lowest price.",
  keyTakeaways: [
    "Honda Accord leads in cargo space with 16.7 cubic feet",
    "Toyota Camry achieves best highway fuel economy at 39 MPG",
    "Mazda6 offers lowest starting price at $26,950",
    "All three sedans feature standard advanced safety systems",
  ],
  quizInstructions:
    "Create a 4-question quiz to help users determine which sedan best fits their needs. Focus on priorities like fuel economy, cargo space, AWD, and budget.",
  calculatorInstructions:
    "MPG calculator with defaults: City MPG: 30, Highway MPG: 38, Fuel Price: $3.50, Annual Miles: 12,000",
  pullQuote:
    "The Honda Accord continues to set the benchmark for midsize sedans with its perfect blend of efficiency, space, and driving dynamics.",
  pullQuoteAttribution: "Car and Driver, 2026 Review",
  dropdownTitle: "Understanding CVT Transmissions",
  dropdownBody:
    "Continuously Variable Transmissions (CVTs) are used in both the Honda Accord and Toyota Camry. Unlike traditional automatic transmissions with fixed gears, CVTs use a belt and pulley system to provide seamless acceleration and optimal fuel efficiency.",
  reviewsInstructions:
    "Generate 3 expert reviews from Car and Driver, Motor Trend, and Edmunds. Include ratings, pros, cons, and summaries for each vehicle.",
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
      >
        <span className="font-medium text-sm">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Build a strict prompt that asks for JSON only, matching our Article schema.
 * The server /api/generate route expects: { prompt: string }
 */
function buildPrompt(input: {
  title: string

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  models?: any[]

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  customInstructions: {
    tldr?: string
    keyTakeaways?: string[]
    quizInstructions?: string
    calculatorInstructions?: string
    pullQuote?: string
    pullQuoteAttribution?: string
    dropdownTitle?: string
    dropdownBody?: string
    reviewsInstructions?: string
  }

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

}) {

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const { title, models, customInstructions } = input

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const prettyModels = models && models.length ? JSON.stringify(models) : "[]"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const prettyInstructions = JSON.stringify(customInstructions)

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  // IMPORTANT: we require the model to output ONLY JSON (no prose),

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  // and match our parseArticle schema expectations.

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  return `

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

You are a content generator that outputs ONLY valid JSON matching this TypeScript shape (no markdown, no explanations):

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

type Article = {
  title: string
  slug: string
  intent: "comparison" | "review" | "guide" | "localized_dealer"
  hero?: {
    headline?: string
    subheadline?: string
    subtitle?: string
    image?: string | { url: string; alt?: string }
  }
  blocks: any[]
  modules?: {
    tldr?: any
    keyTakeaways?: any
    quiz?: any
    mpgCalculator?: any
    pullQuote?: any
    dropdown?: any
    reviews?: any
  }
  description?: string
}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

Constraints:

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

- The value must be STRICT JSON, no comments, no trailing commas.

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

- Keep fields aligned with the schema above.

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

- For image fields, you may use a string URL or an object { url, alt }.

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

- Slug should be a URL-friendly version of the title (lowercase, hyphens).

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

- Build blocks/modules appropriate for a ${JSON.stringify(input.customInstructions?.reviewsInstructions ? "comparison" : "guide")} article.

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

- Use the provided "models" data when useful.

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

INPUT TITLE:

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

${title}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

MODELS (example vehicle data):

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

${prettyModels}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

CUSTOM INSTRUCTIONS:

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

${prettyInstructions}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

Return ONLY the JSON object (no other text).

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

`.trim()

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

}

export default function GeneratePage() {

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const [formData, setFormData] = useState({
    title: "",
    tldr: "",
    keyTakeaways: "",
    quizInstructions: "",
    calculatorInstructions: "",
    pullQuote: "",
    pullQuoteAttribution: "",
    dropdownTitle: "",
    dropdownBody: "",
    reviewsInstructions: "",
    modelsJson: "",
  })

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const [loading, setLoading] = useState(false)

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const [publishing, setPublishing] = useState(false)

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const [error, setError] = useState("")

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const [generatedArticle, setGeneratedArticle] = useState<Article | null>(null)

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const [validationErrors, setValidationErrors] = useState<string[]>([])

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const [publishedUrl, setPublishedUrl] = useState("")

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const [copied, setCopied] = useState(false)

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const { toast } = useToast()

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault()
        handleGenerate()
      }
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault()
        if (generatedArticle) handlePublish()
      }
      if (e.ctrlKey && e.key === "l") {
        e.preventDefault()
        loadSampleData()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [formData, generatedArticle])

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const loadSampleData = () => {
    setFormData({
      title: SAMPLE_DATA.title,
      tldr: SAMPLE_DATA.tldr,
      keyTakeaways: SAMPLE_DATA.keyTakeaways.join("\n"),
      quizInstructions: SAMPLE_DATA.quizInstructions,
      calculatorInstructions: SAMPLE_DATA.calculatorInstructions,
      pullQuote: SAMPLE_DATA.pullQuote,
      pullQuoteAttribution: SAMPLE_DATA.pullQuoteAttribution,
      dropdownTitle: SAMPLE_DATA.dropdownTitle,
      dropdownBody: SAMPLE_DATA.dropdownBody,
      reviewsInstructions: SAMPLE_DATA.reviewsInstructions,
      modelsJson: JSON.stringify(
        [
          { name: "2026 Honda Accord", hp: 192, mpg: 38, price: 27950 },
          { name: "2026 Toyota Camry", hp: 203, mpg: 39, price: 27950 },
          { name: "2026 Mazda6", hp: 187, mpg: 35, price: 26950 },
        ],
        null,
        2,
      ),
    })
    toast({
      title: "Sample data loaded",
      description: "All fields have been populated with example content",
    })
  }

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const handleGenerate = async () => {
    if (!formData.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your article",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError("")
    setPublishedUrl("")
    setGeneratedArticle(null)
    setValidationErrors([])

    try {
      let models: any[] = []
      if (formData.modelsJson.trim()) {
        try {
          models = JSON.parse(formData.modelsJson)
        } catch (err) {
          throw new Error("Invalid JSON in models field. Please check your syntax.")
        }
      }

      const prompt = buildPrompt({
        title: formData.title,
        models: models.length > 0 ? models : undefined,
        customInstructions: {
          tldr: formData.tldr,
          keyTakeaways: formData.keyTakeaways.split("\n").filter(Boolean),
          quizInstructions: formData.quizInstructions,
          calculatorInstructions: formData.calculatorInstructions,
          pullQuote: formData.pullQuote,
          pullQuoteAttribution: formData.pullQuoteAttribution,
          dropdownTitle: formData.dropdownTitle,
          dropdownBody: formData.dropdownBody,
          reviewsInstructions: formData.reviewsInstructions,
        },
      })

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate article")
      }

      const raw = (data?.output ?? "").trim()
      if (!raw) throw new Error("Model returned empty output")

      // Try strict JSON parse
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        // Sometimes models wrap JSON in ``` blocks — try to extract
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
        if (match?.[1]) {
          parsed = JSON.parse(match[1])
        } else {
          throw new Error("Model did not return valid JSON")
        }
      }

      const validatedArticle = parseArticle(coerceForSchema(parsed))
      setGeneratedArticle(validatedArticle)

      toast({
        title: "Article generated",
        description: "Your article has been generated successfully",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Generation failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const handlePublish = async () => {
    if (!generatedArticle) return

    setPublishing(true)
    setError("")

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ article: generatedArticle }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      setPublishedUrl(data.url)
      toast({
        title: "Published successfully",
        description: "Your article is now live",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Publish failed",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setPublishing(false)
    }
  }

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const copyJSON = () => {
    if (!generatedArticle) return
    navigator.clipboard.writeText(JSON.stringify(generatedArticle, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied to clipboard",
      description: "Article JSON has been copied",
    })
  }

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  const downloadJSON = () => {
    if (!generatedArticle) return
    const blob = new Blob([JSON.stringify(generatedArticle, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${generatedArticle.slug}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded",
      description: "Article JSON has been downloaded",
    })
  }

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  return (

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

    <div className="min-h-screen bg-slate-950 relative overflow-hidden">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

      <LiquidBlobs />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

      <div className="relative z-10 py-12">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

        <div className="container mx-auto px-4 max-w-7xl">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              Generate Content

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            </h1>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            <p className="text-slate-400 mb-3">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              Create rich vehicle intelligence pages with custom instructions for AI modules

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            </p>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded">Ctrl+G</kbd>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <span>Generate</span>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded">Ctrl+P</kbd>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <span>Publish</span>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded">Ctrl+L</kbd>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <span>Load Sample</span>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

          </motion.div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

          <div className="grid lg:grid-cols-3 gap-8">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            <motion.div

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              initial={{ opacity: 0, x: -20 }}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              animate={{ opacity: 1, x: 0 }}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              className="lg:col-span-1 space-y-4 h-fit sticky top-8"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            >

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              {/* Basic Info */}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <h3 className="text-lg font-semibold mb-4 text-slate-200">Article Info</h3>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <div className="space-y-4">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    <Label htmlFor="title" className="text-slate-300">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      Title *

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    </Label>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    <Input

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      id="title"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      value={formData.title}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      placeholder="2026 Toyota Camry vs Honda Accord"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      className="mt-2 bg-slate-800 border-slate-700"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    <Label htmlFor="modelsJson" className="text-slate-300">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      Models Data (JSON)

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    </Label>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    <Textarea

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      id="modelsJson"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      value={formData.modelsJson}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      onChange={(e) => setFormData({ ...formData, modelsJson: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      placeholder='[{"name": "Camry", "hp": 225, "mpg": 44}]'

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      rows={6}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                      className="mt-2 font-mono text-xs bg-slate-800 border-slate-700"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Button

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onClick={loadSampleData}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    variant="outline"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="w-full border-slate-700 hover:bg-slate-800 bg-transparent"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  >

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    <FileJson className="w-4 h-4 mr-2" />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    Load Sample Data (Ctrl+L)

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  </Button>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 space-y-3">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <h3 className="text-lg font-semibold mb-4 text-slate-200">AI Module Instructions</h3>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <CollapsibleSection title="TL;DR" defaultOpen>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Textarea

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.tldr}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, tldr: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="Brief summary of the article..."

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    rows={3}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </CollapsibleSection>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <CollapsibleSection title="Key Takeaways">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Textarea

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.keyTakeaways}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, keyTakeaways: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="One takeaway per line..."

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    rows={4}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <p className="text-xs text-slate-500">Enter one takeaway per line</p>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </CollapsibleSection>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <CollapsibleSection title="Quiz">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Textarea

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.quizInstructions}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, quizInstructions: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="Instructions for quiz generation..."

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    rows={3}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </CollapsibleSection>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <CollapsibleSection title="Calculator">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Textarea

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.calculatorInstructions}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, calculatorInstructions: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="Calculator defaults and instructions..."

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    rows={3}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </CollapsibleSection>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <CollapsibleSection title="Pull Quote">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Textarea

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.pullQuote}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, pullQuote: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="Quote text..."

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    rows={2}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Input

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.pullQuoteAttribution}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, pullQuoteAttribution: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="Attribution (e.g., Car and Driver)"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </CollapsibleSection>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <CollapsibleSection title="Dropdown/FAQ">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Input

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.dropdownTitle}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, dropdownTitle: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="Dropdown title..."

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Textarea

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.dropdownBody}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, dropdownBody: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="Dropdown content..."

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    rows={3}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </CollapsibleSection>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <CollapsibleSection title="Reviews">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  <Textarea

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    value={formData.reviewsInstructions}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    onChange={(e) => setFormData({ ...formData, reviewsInstructions: e.target.value })}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    placeholder="Instructions for review generation..."

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    rows={3}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                    className="bg-slate-800 border-slate-700 text-sm"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  />

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </CollapsibleSection>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 space-y-3">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                <Button

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  onClick={handleGenerate}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  disabled={loading || !formData.title}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                >

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Article
                    </>
                  )}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                </Button>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                {generatedArticle && (
                  <>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyJSON}
                        variant="outline"
                        className="flex-1 border-slate-700 bg-transparent"
                        size="sm"
                      >
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        Copy
                      </Button>
                      <Button
                        onClick={downloadJSON}
                        variant="outline"
                        className="flex-1 border-slate-700 bg-transparent"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>

                    <Button
                      onClick={handlePublish}
                      disabled={publishing || validationErrors.length > 0}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      {publishing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Publish Article
                        </>
                      )}
                    </Button>
                  </>
                )}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

                {publishedUrl && (
                  <Alert className="bg-green-500/10 border-green-500/50">
                    <AlertDescription className="text-green-400">
                      Published!{" "}
                      <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="underline">
                        View article →
                      </a>
                    </AlertDescription>
                  </Alert>
                )}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            </motion.div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}



/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            {/* Preview */}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

              {generatedArticle ? (
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-6 px-4">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <h2 className="text-2xl font-bold text-purple-400">Preview</h2>
                    <span className="text-sm text-slate-500 ml-auto">{generatedArticle.slug}</span>
                  </div>
                  <div className="bg-slate-950 rounded-xl overflow-hidden">
                    <ArticleView article={generatedArticle} />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-12 border border-slate-800 text-center">
                  <Wand2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500">Generate content to see preview</p>
                </div>
              )}

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

            </motion.div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

          </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

        </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

      </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

    </div>

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

  )

/**
 * Coerce model output to match articleSchema expectations.
 * - ensure toc exists
 * - remove modules if it is an object (schema expects array)
 * - remap unknown block types to markdown
 * - add minimal fields for intro/markdown blocks
 */
function coerceForSchema(input: any): any {
  const allowed = new Set([
    "intro","comparisonTable","specGrid","prosCons","gallery","faq","ctaBanner","markdown"
  ]);
  const a = (input && typeof input === "object") ? { ...input } : {};
  // toc required
  if (!("toc" in a) || a.toc == null) a.toc = [];
  // modules must be array; if object, drop it (optional field)
  if (a.modules && !Array.isArray(a.modules)) {
    delete a.modules;
  }
  // blocks normalize
  if (!Array.isArray(a.blocks)) a.blocks = [];
  a.blocks = a.blocks.map((b: any) => {
    const t = b?.type;
    if (!allowed.has(t)) {
      const content = typeof b === "string" ? b : (b?.content ?? b?.text ?? JSON.stringify(b));
      return { type: "markdown", content: String(content || "") };
    }
    if (t === "intro") {
      const text = b?.text ?? b?.content ?? "";
      return { ...b, type: "intro", text };
    }
    if (t === "markdown" && !("content" in b)) {
      const content = b?.content ?? b?.text ?? "";
      return { ...b, type: "markdown", content };
    }
    return b;
  });
  return a;
}

}
