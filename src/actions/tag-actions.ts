'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { requireRole } from '@/lib/auth/session'
import { tagSchema, type TagInput } from '@/validation/tag'

export async function createTag(input: TagInput) {
  await requireRole(['ADMIN', 'EDITOR'])
  const parsed = tagSchema.parse(input)
  await prisma.tag.create({ data: parsed })
  revalidatePath('/admin/tags')
}

export async function deleteTag(id: string) {
  await requireRole(['ADMIN', 'EDITOR'])
  // Tags use a cascading join table (ArticleTag), so deleting is always safe —
  // it just removes the tag from any articles that had it, no orphaned data.
  await prisma.tag.delete({ where: { id } })
  revalidatePath('/admin/tags')
}