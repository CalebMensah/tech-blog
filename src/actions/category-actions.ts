'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { requireRole } from '@/lib/auth/session'
import { categorySchema, type CategoryInput } from '@/validation/category'

export async function createCategory(input: CategoryInput) {
  await requireRole(['ADMIN', 'EDITOR'])
  const parsed = categorySchema.parse(input)

  await prisma.category.create({ data: parsed })

  revalidatePath('/admin/categories')
}

export async function updateCategory(id: string, input: CategoryInput) {
  await requireRole(['ADMIN', 'EDITOR'])
  const parsed = categorySchema.parse(input)

  await prisma.category.update({ where: { id }, data: parsed })

  revalidatePath('/admin/categories')
}

export async function deleteCategory(id: string) {
  await requireRole(['ADMIN'])

  const articleCount = await prisma.article.count({ where: { categoryId: id } })
  if (articleCount > 0) {
    throw new Error(
      `Cannot delete: ${articleCount} article(s) still use this category. Reassign them first.`
    )
  }

  await prisma.category.delete({ where: { id } })

  revalidatePath('/admin/categories')
}