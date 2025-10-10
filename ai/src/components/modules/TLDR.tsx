import { EdgeBandTLDR } from "../skins/EdgeBandTLDR"

interface TLDRProps {
  content: string
}

export function TLDR({ content }: TLDRProps) {
  return <EdgeBandTLDR content={content} />
}
