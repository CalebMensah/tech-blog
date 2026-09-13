import { z } from 'zod'

export const reviewSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, hyphen-separated'),
  excerpt: z.string().max(300).optional().nullable(),
  content: z.string().min(50, 'Content is too short'),
  productId: z.string().uuid('Select a product'),
  rating: z.coerce.number().min(0).max(5),
  pros: z.array(z.string().min(1)).min(1, 'Add at least one pro'),
  cons: z.array(z.string().min(1)).min(1, 'Add at least one con'),
  verdict: z.string().max(500).optional().nullable(),
  categoryId: z.string().uuid('Select a category'),
  authorId: z.string().uuid('Select an author'),
  featuredImageId: z.string().uuid().optional().nullable(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']),
  scheduledFor: z.coerce.date().optional().nullable(),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  canonicalUrl: z.string().url().optional().nullable().or(z.literal('')),
  noIndex: z.boolean().default(false),
})

export type ReviewInput = z.infer<typeof reviewSchema>