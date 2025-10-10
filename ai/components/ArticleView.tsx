"use client"

import type { ContentDoc } from "@/lib/content-schema"
import { SpecTable } from "./SpecTable"
import { ComparisonMatrix } from "./ComparisonMatrix"
import { Quiz } from "./Quiz"
import { Calculator } from "./Calculator"
import { Charts } from "./Charts"
import { Button } from "./ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Badge } from "./ui/badge"

interface ArticleViewProps {
  doc: ContentDoc
  mode?: "preview" | "live"
}

export function ArticleView({ doc, mode = "live" }: ArticleViewProps) {
  const brandPrimary = doc.meta.brand.primary || "#3b82f6"

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative py-16 px-4 md:py-24"
        style={{
          background: `linear-gradient(135deg, ${brandPrimary}15 0%, ${brandPrimary}05 100%)`,
        }}
      >
        <div className="container mx-auto max-w-5xl">
          {mode === "preview" && (
            <Badge variant="secondary" className="mb-4">
              Preview Mode
            </Badge>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">{doc.meta.title}</h1>
          {doc.meta.subtitle && <p className="text-xl text-muted-foreground text-balance">{doc.meta.subtitle}</p>}
          {doc.meta.hero?.tagline && (
            <p className="text-lg text-muted-foreground mt-4 text-balance">{doc.meta.hero.tagline}</p>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
        {doc.sections.map((section, idx) => {
          switch (section.type) {
            case "rich":
              return (
                <div key={idx} className="prose prose-lg dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: section.html }} />
                </div>
              )

            case "spec_table":
              return <SpecTable key={idx} section={section} brandColor={brandPrimary} />

            case "comparison_matrix":
              return <ComparisonMatrix key={idx} section={section} brandColor={brandPrimary} />

            case "faq":
              return (
                <div key={idx} className="space-y-4">
                  <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, faqIdx) => (
                      <AccordionItem key={faqIdx} value={`faq-${faqIdx}`}>
                        <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )

            case "quiz":
              return <Quiz key={idx} section={section} brandColor={brandPrimary} />

            case "calculator":
              return <Calculator key={idx} section={section} brandColor={brandPrimary} />

            case "chart":
              return <Charts key={idx} section={section} brandColor={brandPrimary} />

            default:
              return null
          }
        })}

        {/* CTAs */}
        {doc.ctas && doc.ctas.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center pt-8">
            {doc.ctas.map((cta, idx) => (
              <Button key={idx} asChild size="lg" style={{ backgroundColor: brandPrimary }}>
                <a href={cta.href} target="_blank" rel="noopener noreferrer">
                  {cta.label}
                </a>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
