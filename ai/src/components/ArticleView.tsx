"use client"
import type { ReactNode } from "react"

import { useEffect, useState, useMemo } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import type { Article, ArticleBlock } from "@/lib/articleSchema"
import { ArrowUp, LinkIcon, Check } from "lucide-react"
import { ComparisonTable } from "./blocks/ComparisonTable"
import { SpecGrid } from "./blocks/SpecGrid"
import { ProsCons } from "./blocks/ProsCons"
import { Gallery } from "./blocks/Gallery"
import { CTABanner } from "./blocks/CTABanner"
import { MarkdownBlock } from "./blocks/MarkdownBlock"
import { TLDR } from "./modules/TLDR"
import { Quiz } from "./modules/Quiz"
import { MpgCalculator } from "./modules/MpgCalculator"
import { PullQuote } from "./modules/PullQuote"
import { Dropdown } from "./modules/Dropdown"
import { Reviews } from "./modules/Reviews"
import { FluidHero } from "./layout/FluidHero"
import { StickyRail } from "./layout/StickyRail"
import { LiquidBlobs } from "./visual/LiquidBlobs"
import { FuelEconomy } from "./blocks/FuelEconomy"

interface ArticleViewProps {
  article: Article
}

export function ArticleView({ article }: ArticleViewProps) {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [copiedAnchor, setCopiedAnchor] = useState<string | null>(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  const firstTableIndex = useMemo(() => {
    return article.blocks.findIndex((block) => block.type === "comparisonTable" || block.type === "specGrid")
  }, [article.blocks])

  const fuelEconomyData = useMemo(() => {
    const comparisonTable = article.blocks.find((block) => block.type === "comparisonTable")
    if (!comparisonTable || comparisonTable.type !== "comparisonTable") return null

    const cityMpgRow = comparisonTable.rows.find((row) => row.Metric === "City MPG")
    const hwyMpgRow = comparisonTable.rows.find((row) => row.Metric === "Highway MPG")

    if (!cityMpgRow || !hwyMpgRow) return null

    const vehicles = comparisonTable.columns.slice(1).map((vehicleName) => ({
      name: vehicleName,
      cityMpg: cityMpgRow[vehicleName] || "N/A",
      highwayMpg: hwyMpgRow[vehicleName] || "N/A",
    }))

    return vehicles
  }, [article.blocks])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const copyAnchorLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url)
    setCopiedAnchor(id)
    setTimeout(() => setCopiedAnchor(null), 2000)
  }

  const keyTakeaways = article.modules?.find((m) => m.type === "key_takeaways")?.items as string[] | undefined

  return (
    <div className="min-h-screen bg-background relative">
      <LiquidBlobs />

      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-50 origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, var(--pair-1-a), var(--pair-1-b))",
          boxShadow: "0 0 8px rgba(37, 99, 235, 0.4)",
        }}
      />

      <FluidHero
        eyebrow={article.hero.eyebrow}
        headline={article.hero.headline}
        subheadline={article.hero.subheadline}
        badges={article.hero.badges}
        cta={article.hero.cta}
        stockArtVariant="sedan"
      />

      <div className="container mx-auto px-4 max-w-4xl -mt-20 mb-12 relative z-20"></div>

      {article.modules && article.modules.find((m) => m.type === "tldr") && (
        <div className="w-full relative z-20 mb-12">
          <TLDR content={article.modules.find((m) => m.type === "tldr")!.content as string} />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        <div className="flex gap-12">
          <StickyRail toc={article.toc} keyTakeaways={keyTakeaways} />

          <main className="flex-1 min-w-0">
            <article className="space-y-12">
              {article.blocks.map((block, index) => {
                const elements: ReactNode[] = []

                const sectionId = article.toc[index]?.id || `section-${index}`

                elements.push(
                  <BlockRenderer
                    key={`block-${index}`}
                    block={block}
                    sectionId={sectionId}
                    onCopyAnchor={copyAnchorLink}
                    copiedAnchor={copiedAnchor}
                  />,
                )

                if (index === 0 && article.modules) {
                  const pullQuote = article.modules.find((m) => m.type === "pull_quote")
                  if (pullQuote && pullQuote.type === "pull_quote") {
                    elements.push(
                      <motion.div
                        key="pull-quote"
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.24 }}
                      >
                        <PullQuote quote={pullQuote.quote} attribution={pullQuote.attribution} />
                      </motion.div>,
                    )
                  }
                }

                if (index === firstTableIndex && firstTableIndex !== -1 && article.modules) {
                  const calculator = article.modules.find((m) => m.type === "mpg_calculator")
                  if (calculator && calculator.type === "mpg_calculator") {
                    elements.push(
                      <motion.div
                        key="mpg-calc"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.24 }}
                      >
                        <MpgCalculator label={calculator.label} defaults={calculator.defaults} />
                      </motion.div>,
                    )
                  }
                }

                if (
                  block.type === "comparisonTable" &&
                  index === article.blocks.findIndex((b) => b.type === "comparisonTable") &&
                  fuelEconomyData
                ) {
                  elements.push(
                    <motion.div
                      key="fuel-economy"
                      id="fuel-economy"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.24 }}
                      className="scroll-mt-24"
                    >
                      <FuelEconomy vehicles={fuelEconomyData} />
                    </motion.div>,
                  )
                }

                return elements
              })}

              {article.modules && article.modules.find((m) => m.type === "reviews") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.24 }}
                >
                  <Reviews
                    sources={article.modules.find((m) => m.type === "reviews")!.sources as string[] | undefined}
                    entries={
                      article.modules.find((m) => m.type === "reviews")!.entries as Array<{
                        author?: string
                        rating?: number
                        summary: string
                        pros?: string[]
                        cons?: string[]
                      }>
                    }
                  />
                </motion.div>
              )}

              {article.modules && article.modules.filter((m) => m.type === "dropdown").length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.24 }}
                >
                  <Dropdown
                    items={article.modules
                      .filter((m) => m.type === "dropdown")
                      .map((m) => ({ title: m.title as string, body: m.body as string }))}
                  />
                </motion.div>
              )}

              {article.modules && article.modules.find((m) => m.type === "quiz") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.24 }}
                >
                  <Quiz
                    title={article.modules.find((m) => m.type === "quiz")!.title as string}
                    questions={
                      article.modules.find((m) => m.type === "quiz")!.questions as Array<{
                        prompt: string
                        choices: string[]
                        correctIndex: number
                        explanation?: string
                      }>
                    }
                  />
                </motion.div>
              )}
            </article>
          </main>
        </div>
      </div>

      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="u-hover fixed bottom-8 right-8 p-4 rounded-lg border-hairline minimal-card shadow-sm z-40"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      {Boolean(((article as any)?.seo?.schema)) && (
        <script
          type="application/ld+json"
          // TS: schema may be unknown; stringify is runtime-safe
          dangerouslySetInnerHTML={{ __html: JSON.stringify(((article as any).seo.schema)) }}
        />
      )}
    </div>
  )
}

interface BlockRendererProps {
  block: ArticleBlock
  sectionId: string
  onCopyAnchor: (id: string) => void
  copiedAnchor: string | null
}

function BlockRenderer({ block, sectionId, onCopyAnchor, copiedAnchor }: BlockRendererProps) {
  return (
    <motion.div
      id={sectionId}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.24 }}
      className="scroll-mt-24"
    >
      {block.type === "intro" && (
        <div className="relative group prose prose-lg dark:prose-invert max-w-none">
          <button
            onClick={() => onCopyAnchor(sectionId)}
            className="absolute -left-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded-lg"
            aria-label="Copy link"
          >
            {copiedAnchor === sectionId ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <div dangerouslySetInnerHTML={{ __html: (block as any).html }} />
        </div>
      )}

      {block.type === "comparisonTable" && (
        <div className="u-hover">
          <ComparisonTable block={block} />
        </div>
      )}

      {block.type === "specGrid" && (
        <div className="u-hover">
          <SpecGrid block={block} />
        </div>
      )}

      {block.type === "prosCons" && <ProsCons block={block} />}

      {block.type === "gallery" && <Gallery block={block} />}

      {block.type === "faq" && <Dropdown items={block.items.map((item) => ({ title: item.q, body: item.a }))} />}

      {block.type === "ctaBanner" && (
        <div className="u-hover">
          <CTABanner block={block} />
        </div>
      )}

      {block.type === "markdown" && <MarkdownBlock block={block} />}
    </motion.div>
  )
}
