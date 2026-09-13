import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { ReviewForm } from '@/components/admin/review-form'
import { DeleteReviewButton } from '@/components/admin/delete-review-button'

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [review, categories, authors, products] = await Promise.all([
    prisma.review.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.author.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!review) notFound()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Review</h1>
        <DeleteReviewButton reviewId={review.id} />
      </div>
      <div className="mt-6">
        <ReviewForm
          reviewId={review.id}
          categories={categories}
          authors={authors}
          products={products}
          defaultValues={{
            title: review.title,
            slug: review.slug,
            excerpt: review.excerpt ?? '',
            content: review.content,
            productId: review.productId,
            rating: Number(review.rating),
            pros: review.pros,
            cons: review.cons,
            verdict: review.verdict ?? '',
            categoryId: review.categoryId,
            authorId: review.authorId,
            status: review.status,
            featured: review.featured,
            seoTitle: review.seoTitle ?? '',
            seoDescription: review.seoDescription ?? '',
            canonicalUrl: review.canonicalUrl ?? '',
            noIndex: review.noIndex,
          }}
        />
      </div>
    </div>
  )
}