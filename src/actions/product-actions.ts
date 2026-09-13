'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db/prisma'
import { requireRole } from '@/lib/auth/session'
import { productSchema, type ProductInput } from '@/validation/product'

export async function createProduct(input: ProductInput) {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])
  const parsed = productSchema.parse(input)

  const product = await prisma.product.create({
    data: {
      ...parsed,
      websiteUrl: parsed.websiteUrl || null,
      logoUrl: parsed.logoUrl || null,
    },
  })

  revalidatePath('/admin/products')
  return product
}

export async function updateProduct(id: string, input: ProductInput) {
  await requireRole(['ADMIN', 'EDITOR', 'AUTHOR'])
  const parsed = productSchema.parse(input)

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed,
      websiteUrl: parsed.websiteUrl || null,
      logoUrl: parsed.logoUrl || null,
    },
  })

  revalidatePath('/admin/products')
}

export async function deleteProduct(id: string) {
  await requireRole(['ADMIN'])

  const [reviewCount, comparisonItemCount] = await Promise.all([
    prisma.review.count({ where: { productId: id } }),
    prisma.comparisonItem.count({ where: { productId: id } }),
  ])

  if (reviewCount + comparisonItemCount > 0) {
    throw new Error(
      `Cannot delete: this product is used in ${reviewCount} review(s) and ${comparisonItemCount} comparison(s).`
    )
  }

  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
}