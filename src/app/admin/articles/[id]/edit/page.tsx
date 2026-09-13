import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ArticleForm } from '@/components/admin/article-form'
import { DeleteArticleButton } from '@/components/admin/delete-article-button'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [article, categories, authors, tags] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { tags: true },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.author.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!article) notFound()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Article</h1>
        <DeleteArticleButton articleId={article.id} />
      </div>
      <div className="mt-6">
        <ArticleForm
          articleId={article.id}
          categories={categories}
          authors={authors}
          tags={tags}
          defaultValues={{
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt ?? '',
            content: article.content,
            categoryId: article.categoryId,
            authorId: article.authorId,
            tagIds: article.tags.map((t: { tagId: string }) => t.tagId),
            status: article.status,
            featured: article.featured,
            pinned: article.pinned,
            seoTitle: article.seoTitle ?? '',
            seoDescription: article.seoDescription ?? '',
            canonicalUrl: article.canonicalUrl ?? '',
            noIndex: article.noIndex,
          }}
        />
      </div>
    </div>
  )
}