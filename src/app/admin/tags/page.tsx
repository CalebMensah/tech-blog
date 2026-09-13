import { prisma } from '@/lib/db/prisma'
import { TagManager } from '@/components/admin/tag-manager'

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  })

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Tags</h1>
      <div className="mt-6">
        <TagManager
          tags={tags.map((t: { id: string; name: string; slug: string; _count: { articles: number } }) => ({
            id: t.id,
            name: t.name,
            slug: t.slug,
            articleCount: t._count.articles,
          }))}
        />
      </div>
    </div>
  )
}