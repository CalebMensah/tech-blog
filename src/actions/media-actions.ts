'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { requireRole } from '@/lib/auth/session'
import { uploadFile, deleteFile } from '@/lib/cloudinary/storage'

export async function uploadMedia(formData: FormData) {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])

  const file = formData.get('file') as File
  const altText = formData.get('altText') as string | null
  if (!file) throw new Error('No file provided')

  const { url, path, width, height } = await uploadFile(file, 'articles')

  const media = await prisma.media.create({
    data: {
      url,
      storagePath: path,
      altText: altText || null,
      mimeType: file.type,
      sizeBytes: file.size,
      width,
      height,
    },
  })

  revalidatePath('/admin/media')
  return media
}

export async function deleteMedia(id: string) {
  await requireRole(['ADMIN', 'EDITOR'])

  const media = await prisma.media.findUniqueOrThrow({ where: { id } })

  // Check it's not in use before deleting the file itself
  const [articleUse, reviewUse, comparisonUse] = await Promise.all([
    prisma.article.count({ where: { featuredImageId: id } }),
    prisma.review.count({ where: { featuredImageId: id } }),
    prisma.comparison.count({ where: { featuredImageId: id } }),
  ])

  if (articleUse + reviewUse + comparisonUse > 0) {
    throw new Error('Cannot delete: this image is currently used by published content.')
  }

  await deleteFile(media.storagePath)
  await prisma.media.delete({ where: { id } })
  revalidatePath('/admin/media')
}

export async function updateMediaAltText(id: string, altText: string) {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])
  await prisma.media.update({ where: { id }, data: { altText } })
  revalidatePath('/admin/media')
}

export async function listMedia() {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])

  return prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60,
    select: { id: true, url: true, altText: true },
  })
}