import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { AuthorForm } from '@/components/admin/author-form'

export default async function EditAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const author = await prisma.author.findUnique({ where: { id } })

  if (!author) notFound()

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit Author</h1>
      <div className="mt-6">
        <AuthorForm
          authorId={author.id}
          defaultValues={{
            name: author.name,
            slug: author.slug,
            bio: author.bio ?? '',
            avatarUrl: author.avatarUrl ?? '',
            twitterUrl: author.twitterUrl ?? '',
            linkedinUrl: author.linkedinUrl ?? '',
            websiteUrl: author.websiteUrl ?? '',
          }}
        />
      </div>
    </div>
  )
}