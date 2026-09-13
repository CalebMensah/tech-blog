'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createAuthor, updateAuthor, uploadAuthorAvatar } from '@/actions/author-actions'
import type { AuthorInput } from '@/validation/author'

export function AuthorForm({
  authorId,
  defaultValues,
}: {
  authorId?: string
  defaultValues?: Partial<AuthorInput>
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Partial<AuthorInput>>({
    name: '',
    slug: '',
    bio: '',
    avatarUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    ...defaultValues,
  })

  function slugify(value: string) {
    return value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set('file', file)
      const url = await uploadAuthorAvatar(formData)
      setForm((f) => ({ ...f, avatarUrl: url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (authorId) {
        await updateAuthor(authorId, form as AuthorInput)
      } else {
        await createAuthor(form as AuthorInput)
      }
      router.push('/admin/authors')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        {form.avatarUrl ? (
          <Image
            src={form.avatarUrl}
            alt=""
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-neutral-200" />
        )}
        <div>
          <label className="cursor-pointer text-sm text-neutral-700 underline">
            {uploading ? 'Uploading…' : 'Upload avatar'}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>
      </div>

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
        <label className="text-sm font-medium">Bio</label>
        <textarea
          value={form.bio ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
          rows={3}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-sm">Twitter/X URL</label>
          <input
            value={form.twitterUrl ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, twitterUrl: e.target.value }))}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">LinkedIn URL</label>
          <input
            value={form.linkedinUrl ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Website URL</label>
          <input
            value={form.websiteUrl ?? ''}
            onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-neutral-900 px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {saving ? 'Saving…' : authorId ? 'Update Author' : 'Create Author'}
      </button>
    </form>
  )
}