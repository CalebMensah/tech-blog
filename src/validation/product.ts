import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2).max(150),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, hyphen-separated'),
  description: z.string().max(500).optional().nullable(),
  brand: z.string().max(100).optional().nullable(),
  websiteUrl: z.string().url().optional().nullable().or(z.literal('')),
  logoUrl: z.string().url().optional().nullable().or(z.literal('')),
})

export type ProductInput = z.infer<typeof productSchema>