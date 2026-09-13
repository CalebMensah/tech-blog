import { prisma } from '@/lib/db/prisma'
import { ReviewForm } from '@/components/admin/review-form'

export default async function NewReviewPage() {
  const [categories, authors, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.author.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-semibold">New Review</h1>
      <div className="mt-6">
        <ReviewForm categories={categories} authors={authors} products={products} />
      </div>
    </div>
  )
}