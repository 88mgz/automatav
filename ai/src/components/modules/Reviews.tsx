import { MinimalRows } from "../skins/MinimalRows"

interface ReviewsProps {
  sources?: string[]
  entries: Array<{
    author?: string
    rating?: number
    summary: string
    pros?: string[]
    cons?: string[]
  }>
}

export function Reviews({ sources, entries }: ReviewsProps) {
  return <MinimalRows sources={sources} entries={entries} />
}
