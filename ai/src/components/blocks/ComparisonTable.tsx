import { ThreadedGrid } from "../skins/ThreadedGrid"
import type { ArticleBlock } from "@/lib/articleSchema"

interface ComparisonTableProps {
  block: Extract<ArticleBlock, { type: "comparisonTable" }>
}

export function ComparisonTable({ block }: ComparisonTableProps) {
  return <ThreadedGrid block={block} />
}
