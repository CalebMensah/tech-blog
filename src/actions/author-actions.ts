'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { requireRole } from '@/lib/auth/session'
import { authorSchema, type AuthorInput } from '@/validation/author'
import { uploadFile } from '@/lib/cloudinary/storage'

export async function createAuthor(input: AuthorInput) {
  await requireRole(['ADMIN', 'EDITOR'])
  const parsed = authorSchema.parse(input)

  await prisma.author.create({
    data: {
      ...parsed,
      twitterUrl: parsed.twitterUrl || null,
      linkedinUrl: parsed.linkedinUrl || null,
      websiteUrl: parsed.websiteUrl || null,
    },
  })

  revalidatePath('/admin/authors')
}

export async function updateAuthor(id: string, input: AuthorInput) {
  await requireRole(['ADMIN', 'EDITOR'])
  const parsed = authorSchema.parse(input)

  await prisma.author.update({
    where: { id },
    data: {
      ...parsed,
      twitterUrl: parsed.twitterUrl || null,
      linkedinUrl: parsed.linkedinUrl || null,
      websiteUrl: parsed.websiteUrl || null,
    },
  })

  revalidatePath('/admin/authors')
}

export async function deleteAuthor(id: string) {
  await requireRole(['ADMIN'])

  const contentCount = await prisma.article.count({ where: { authorId: id } })
  if (contentCount > 0) {
    throw new Error(`Cannot delete: this author has ${contentCount} article(s). Reassign them first.`)
  }

  await prisma.author.delete({ where: { id } })
  revalidatePath('/admin/authors')
}

export async function uploadAuthorAvatar(formData: FormData) {
  await requireRole(['ADMIN', 'EDITOR'])

  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  const { url } = await uploadFile(file, 'authors')
  return url
}