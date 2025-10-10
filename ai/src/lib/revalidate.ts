import { revalidatePath, revalidateTag } from "next/cache"

export function revalidateArticle(slug: string) {
  revalidatePath("/articles")
  revalidatePath(`/articles/${slug}`)
}

export function revalidateArticleTag(tag: string) {
  revalidateTag(tag)
}
