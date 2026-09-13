'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { requireRole } from '@/lib/auth/session'
import { articleSchema, type ArticleInput } from '@/validation/article'
import readingTime from 'reading-time'

export async function createArticle(input: ArticleInput) {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])

  const parsed = articleSchema.parse(input)
  const { tagIds, ...articleData } = parsed

  const stats = readingTime(parsed.content)

  const publishedAt =
    parsed.status === 'PUBLISHED' ? new Date() : null

  const article = await prisma.article.create({
    data: {
      ...articleData,
      canonicalUrl: articleData.canonicalUrl || null,
      publishedAt,
      readingTime: Math.ceil(stats.minutes),
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  })

  revalidatePath('/admin/articles')
  redirect(`/admin/articles/${article.id}/edit`)
}

export async function updateArticle(id: string, input: ArticleInput) {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])

  const parsed = articleSchema.parse(input)
  const { tagIds, ...articleData } = parsed

  const stats = readingTime(parsed.content)

  const existing = await prisma.article.findUniqueOrThrow({ where: { id } })

  // Only set publishedAt the first time an article transitions to PUBLISHED —
  // this keeps the original publish date stable even if the article is edited later.
  const publishedAt =
    parsed.status === 'PUBLISHED' && !existing.publishedAt
      ? new Date()
      : existing.publishedAt

  await prisma.article.update({
    where: { id },
    data: {
      ...articleData,
      canonicalUrl: articleData.canonicalUrl || null,
      publishedAt,
      readingTime: Math.ceil(stats.minutes),
      tags: {
        deleteMany: {},
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  })

  revalidatePath('/admin/articles')
  revalidatePath(`/admin/articles/${id}/edit`)
  revalidatePath(`/${existing.slug}`) // revalidate public page if slug unchanged
}

export async function deleteArticle(id: string) {
  await requireRole(['ADMIN', 'EDITOR'])

  await prisma.article.delete({ where: { id } })

  revalidatePath('/admin/articles')
}

export async function unpublishArticle(id: string) {
  await requireRole(['ADMIN', 'EDITOR'])

  await prisma.article.update({
    where: { id },
    data: { status: 'DRAFT' },
  })

  revalidatePath('/admin/articles')
}