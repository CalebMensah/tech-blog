'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/actions/product-actions'
import type { ProductInput } from '@/validation/product'

export function ProductForm({
  productId,
  defaultValues,
  onDone,
}: {
  productId?: string
  defaultValues?: Partial<ProductInput>
  onDone?: () => void
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<ProductInput>>({
    name: '',
    slug: '',
    description: '',
    brand: '',
    websiteUrl: '',
    logoUrl: '',
    ...defaultValues,
  })

  function slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (productId) {
        await updateProduct(productId, form as ProductInput)
      } else {
        await createProduct(form as ProductInput)
      }
      router.refresh()
      onDone?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Name</label>
        <input
          value={form.name}
          onChange={(e) =>
            setForm((f) => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))
          }
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Slug</label>
        <input
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm font-mono"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Brand</label>
        <input
          value={form.brand ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={form.description ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Website URL</label>
        <input
          value={form.websiteUrl ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-neutral-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? 'Saving…' : productId ? 'Update' : 'Create'}
      </button>
    </form>
  )
}