'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createArticle, updateArticle } from '@/actions/article-actions'
import type { ArticleInput } from '@/validation/article'

type Category = { id: string; name: string }
type Author = { id: string; name: string }
type Tag = { id: string; name: string }

type ArticleFormProps = {
  articleId?: string
  categories: Category[]
  authors: Author[]
  tags: Tag[]
  defaultValues?: Partial<ArticleInput>
}

export function ArticleForm({
  articleId,
  categories,
  authors,
  tags,
  defaultValues,
}: ArticleFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<Partial<ArticleInput>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'DRAFT',
    featured: false,
    pinned: false,
    noIndex: false,
    tagIds: [],
    ...defaultValues,
  })

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (articleId) {
        await updateArticle(articleId, form as ArticleInput)
      } else {
        await createArticle(form as ArticleInput)
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
            setForm((f) => ({
              ...f,
              title: e.target.value,
              slug: f.slug || slugify(e.target.value),
            }))
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

      <div className="space-y-1">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const checked = form.tagIds?.includes(tag.id)
            return (
              <label
                key={tag.id}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${
                  checked
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-neutral-300 text-neutral-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      tagIds: e.target.checked
                        ? [...(f.tagIds ?? []), tag.id]
                        : (f.tagIds ?? []).filter((id) => id !== tag.id),
                    }))
                  }}
                  className="hidden"
                />
                {tag.name}
              </label>
            )
          })}
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

        <div className="space-y-1">
          <label className="text-sm">Canonical URL</label>
          <input
            value={form.canonicalUrl ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, canonicalUrl: e.target.value }))}
            placeholder="Leave blank unless this content is duplicated elsewhere"
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
              setForm((f) => ({ ...f, status: e.target.value as ArticleInput['status'] }))
            }
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {form.status === 'SCHEDULED' && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Scheduled for</label>
            <input
              type="datetime-local"
              onChange={(e) =>
                setForm((f) => ({ ...f, scheduledFor: new Date(e.target.value) }))
              }
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
          />
          Pinned
        </label>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-neutral-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? 'Saving…' : articleId ? 'Update Article' : 'Create Article'}
      </button>
    </form>
  )
}