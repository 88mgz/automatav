"use client"

interface MarkdownBlockProps {
  block: {
    md: string
  }
}

export function MarkdownBlock({ block }: MarkdownBlockProps) {
  // Simple markdown rendering - in production, use a proper markdown library
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div dangerouslySetInnerHTML={{ __html: block.md.replace(/\n/g, "<br />") }} />
    </div>
  )
}
