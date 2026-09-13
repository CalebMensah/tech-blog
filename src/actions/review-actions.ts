'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { requireRole } from '@/lib/auth/session'
import { reviewSchema, type ReviewInput } from '@/validation/review'
import readingTime from 'reading-time'

export async function createReview(input: ReviewInput) {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])
  const parsed = reviewSchema.parse(input)
  const stats = readingTime(parsed.content)

  const review = await prisma.review.create({
    data: {
      ...parsed,
      canonicalUrl: parsed.canonicalUrl || null,
      publishedAt: parsed.status === 'PUBLISHED' ? new Date() : null,
      readingTime: Math.ceil(stats.minutes),
    },
  })

  revalidatePath('/admin/reviews')
  redirect(`/admin/reviews/${review.id}/edit`)
}

export async function updateReview(id: string, input: ReviewInput) {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])
  const parsed = reviewSchema.parse(input)
  const stats = readingTime(parsed.content)

  const existing = await prisma.review.findUniqueOrThrow({ where: { id } })
  const publishedAt =
    parsed.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt

  await prisma.review.update({
    where: { id },
    data: {
      ...parsed,
      canonicalUrl: parsed.canonicalUrl || null,
      publishedAt,
      readingTime: Math.ceil(stats.minutes),
    },
  })

  revalidatePath('/admin/reviews')
  revalidatePath(`/admin/reviews/${id}/edit`)
  revalidatePath(`/reviews/${existing.slug}`)
}

export async function deleteReview(id: string) {
  await requireRole(['ADMIN', 'EDITOR'])
  await prisma.review.delete({ where: { id } })
  revalidatePath('/admin/reviews')
}