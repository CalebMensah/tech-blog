import { z } from 'zod'

export const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, hyphen-separated'),
  excerpt: z.string().max(300).optional().nullable(),
  content: z.string().min(50, 'Content is too short'),
  categoryId: z.string().uuid('Select a category'),
  authorId: z.string().uuid('Select an author'),
  tagIds: z.array(z.string().uuid()).optional().default([]),
  featuredImageId: z.string().uuid().optional().nullable(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED']),
  scheduledFor: z.coerce.date().optional().nullable(),
  featured: z.boolean().default(false),
  pinned: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  canonicalUrl: z.string().url().optional().nullable().or(z.literal('')),
  noIndex: z.boolean().default(false),
})

export type ArticleInput = z.infer<typeof articleSchema>