import Link from 'next/link'
import { prisma } from '@/lib/db/prisma'

export default async function ArticlesListPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { author: true, category: true },
    take: 50,
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Articles</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          New Article
        </Link>
      </div>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500">
            <th className="py-2">Title</th>
            <th className="py-2">Author</th>
            <th className="py-2">Category</th>
            <th className="py-2">Status</th>
            <th className="py-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article: Awaited<ReturnType<typeof prisma.article.findMany>>[number]) => (
            <tr key={article.id} className="border-b border-neutral-100">
              <td className="py-2">
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="font-medium hover:underline"
                >
                  {article.title}
                </Link>
              </td>
              <td className="py-2 text-neutral-600">{article.author.name}</td>
              <td className="py-2 text-neutral-600">{article.category.name}</td>
              <td className="py-2">
                <StatusBadge status={article.status} />
              </td>
              <td className="py-2 text-neutral-500">
                {article.updatedAt.toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {articles.length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">
          No articles yet. Create your first one.
        </p>
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