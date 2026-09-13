'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTag, deleteTag } from '@/actions/tag-actions'

type Tag = { id: string; name: string; slug: string; articleCount: number }

export function TagManager({ tags }: { tags: Tag[] }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    await createTag({ name: name.trim(), slug })
    setName('')
    setSaving(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    await deleteTag(id)
    router.refresh()
  }

  return (
    <div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center gap-2 rounded-full border border-neutral-300 px-3 py-1 text-xs"
          >
            {tag.name}
            <span className="text-neutral-400">({tag.articleCount})</span>
            <button
              onClick={() => handleDelete(tag.id)}
              className="text-neutral-400 hover:text-red-600"
              aria-label={`Delete ${tag.name}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}