import { prisma } from '@/lib/db/prisma'
import { CategoryForm } from '@/components/admin/category-form'
import { CategoryListItem } from '@/components/admin/category-list-item'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true } } },
  })

  return (
    <div className="grid max-w-4xl grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <div className="mt-6 space-y-3">
          {categories.map(
            (c: {
              id: string
              name: string
              slug: string
              description: string | null
              seoTitle: string | null
              seoDescription: string | null
              _count: { articles: number }
            }) => (
            <CategoryListItem
              key={c.id}
              category={{
                id: c.id,
                name: c.name,
                slug: c.slug,
                description: c.description,
                seoTitle: c.seoTitle,
                seoDescription: c.seoDescription,
              }}
              articleCount={c._count.articles}
            />
            ),
          )}
          {categories.length === 0 && (
            <p className="text-sm text-neutral-500">No categories yet.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">New Category</h2>
        <div className="mt-4">
          <CategoryForm />
        </div>
      </div>
    </div>
  )
}