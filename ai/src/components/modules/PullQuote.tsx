import { BreathingBar } from "../skins/BreathingBar"

interface PullQuoteProps {
  quote: string
  attribution?: string
}

export function PullQuote({ quote, attribution }: PullQuoteProps) {
  return <BreathingBar quote={quote} attribution={attribution} />
}
