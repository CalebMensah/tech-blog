'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCategory } from '@/actions/category-actions'
import { CategoryForm } from './category-form'
import type { CategoryInput } from '@/validation/category'

export function CategoryListItem({
  category,
  articleCount,
}: {
  category: { id: string } & CategoryInput
  articleCount: number
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    try {
      await deleteCategory(category.id)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (editing) {
    return (
      <div className="rounded-md border border-neutral-200 p-4">
        <CategoryForm
          categoryId={category.id}
          defaultValues={category}
          onDone={() => setEditing(false)}
        />
        <button
          onClick={() => setEditing(false)}
          className="mt-2 text-xs text-neutral-500"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-200 p-3">
      <div>
        <div className="text-sm font-medium">{category.name}</div>
        <div className="text-xs text-neutral-500">
          /{category.slug} · {articleCount} article{articleCount !== 1 ? 's' : ''}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex gap-3 text-xs">
        <button onClick={() => setEditing(true)} className="text-neutral-600 hover:underline">
          Edit
        </button>
        <button onClick={handleDelete} className="text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  )
}