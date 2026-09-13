'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createReview, updateReview } from '@/actions/review-actions'
import { ListInput } from './list-input'
import type { ReviewInput } from '@/validation/review'

type Option = { id: string; name: string }

export function ReviewForm({
  reviewId,
  categories,
  authors,
  products,
  defaultValues,
}: {
  reviewId?: string
  categories: Option[]
  authors: Option[]
  products: Option[]
  defaultValues?: Partial<ReviewInput>
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<ReviewInput>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    rating: 4,
    pros: [],
    cons: [],
    verdict: '',
    status: 'DRAFT',
    featured: false,
    noIndex: false,
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
      if (reviewId) {
        await updateReview(reviewId, form as ReviewInput)
      } else {
        await createReview(form as ReviewInput)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSaving(false)
      return
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Title</label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm((f) => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))
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
        <label className="text-sm font-medium">Product being reviewed</label>
        <select
          value={form.productId ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          required
        >
          <option value="">Select…</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-neutral-500">
          Not listed? Create it first under Admin → Products.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Rating (0–5)</label>
        <input
          type="number"
          min={0}
          max={5}
          step={0.1}
          value={form.rating ?? 4}
          onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
          className="w-32 rounded-md border border-neutral-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ListInput
          label="Pros"
          values={form.pros ?? []}
          onChange={(pros) => setForm((f) => ({ ...f, pros }))}
          placeholder="e.g., Excellent free tier"
        />
        <ListInput
          label="Cons"
          values={form.cons ?? []}
          onChange={(cons) => setForm((f) => ({ ...f, cons }))}
          placeholder="e.g., Steep learning curve"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Verdict</label>
        <textarea
          value={form.verdict ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, verdict: e.target.value }))}
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          placeholder="One or two sentence bottom-line summary"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Excerpt</label>
        <textarea
          value={form.excerpt ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          rows={2}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Content (Markdown)</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          rows={16}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <select
            value={form.categoryId ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Author</label>
          <select
            value={form.authorId ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, authorId: e.target.value }))}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            required
          >
            <option value="">Select…</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="space-y-3 rounded-md border border-neutral-200 p-4">
        <legend className="px-1 text-sm font-medium">SEO</legend>
        <div className="space-y-1">
          <label className="text-sm">SEO Title (max 70 chars)</label>
          <input
            value={form.seoTitle ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
            maxLength={70}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Meta Description (max 160 chars)</label>
          <textarea
            value={form.seoDescription ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
            maxLength={160}
            rows={2}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.noIndex}
            onChange={(e) => setForm((f) => ({ ...f, noIndex: e.target.checked }))}
          />
          No-index this page
        </label>
      </fieldset>

      <div className="flex items-center gap-6">
        <div className="space-y-1">
          <label className="text-sm font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value as ReviewInput['status'] }))
            }
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          Featured
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-neutral-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? 'Saving…' : reviewId ? 'Update Review' : 'Create Review'}
      </button>
    </form>
  )
}