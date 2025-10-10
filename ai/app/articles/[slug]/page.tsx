import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getArticle } from "@/lib/storage"
import { ArticleView } from "@/components/ArticleView"

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: "Article Not Found" }
  }

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: article.seo?.ogImage ? [article.seo.ogImage] : [],
      url: article.seo?.canonical,
    },
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  return <ArticleView article={article} />
}
