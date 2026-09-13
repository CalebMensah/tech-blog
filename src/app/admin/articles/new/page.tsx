import { prisma } from '@/lib/db/prisma'
import { ArticleForm } from '@/components/admin/article-form'

export default async function NewArticlePage() {
  const [categories, authors, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.author.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-semibold">New Article</h1>
      <div className="mt-6">
        <ArticleForm categories={categories} authors={authors} tags={tags} />
      </div>
    </div>
  )
}