import { prisma } from '@/lib/db/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { articles: true, reviews: true, comparisons: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Authors</h1>
        <Link
          href="/admin/authors/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          New Author
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {authors.map((author:any) => (
          <Link
            key={author.id}
            href={`/admin/authors/${author.id}/edit`}
            className="flex items-center gap-3 rounded-md border border-neutral-200 p-3 hover:bg-neutral-50"
          >
            {author.avatarUrl ? (
              <Image
                src={author.avatarUrl}
                alt=""
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-neutral-200" />
            )}
            <div>
              <div className="text-sm font-medium">{author.name}</div>
              <div className="text-xs text-neutral-500">
                {author._count.articles + author._count.reviews + author._count.comparisons} pieces
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}