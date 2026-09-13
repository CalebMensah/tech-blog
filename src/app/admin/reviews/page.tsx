import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'

export default async function ReviewsListPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { author: true, product: true },
    take: 50,
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reviews</h1>
        <Link
          href="/admin/reviews/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          New Review
        </Link>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500">
            <th className="py-2">Title</th>
            <th className="py-2">Product</th>
            <th className="py-2">Rating</th>
            <th className="py-2">Author</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r:any) => (
            <tr key={r.id} className="border-b border-neutral-100">
              <td className="py-2">
                <Link href={`/admin/reviews/${r.id}/edit`} className="font-medium hover:underline">
                  {r.title}
                </Link>
              </td>
              <td className="py-2 text-neutral-600">{r.product.name}</td>
              <td className="py-2 text-neutral-600">{r.rating.toString()} / 5</td>
              <td className="py-2 text-neutral-600">{r.author.name}</td>
              <td className="py-2">
                <StatusBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reviews.length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">No reviews yet.</p>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: 'bg-neutral-100 text-neutral-700',
    SCHEDULED: 'bg-amber-100 text-amber-700',
    PUBLISHED: 'bg-green-100 text-green-700',
    ARCHIVED: 'bg-neutral-100 text-neutral-500',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}