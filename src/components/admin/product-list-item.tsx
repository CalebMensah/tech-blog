'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProduct } from '@/actions/product-actions'
import { ProductForm } from './product-form'
import type { ProductInput } from '@/validation/product'

export function ProductListItem({
  product,
  usageCount,
}: {
  product: { id: string } & ProductInput
  usageCount: number
}) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    try {
      await deleteProduct(product.id)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (editing) {
    return (
      <div className="rounded-md border border-neutral-200 p-4">
        <ProductForm
          productId={product.id}
          defaultValues={product}
          onDone={() => setEditing(false)}
        />
        <button onClick={() => setEditing(false)} className="mt-2 text-xs text-neutral-500">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-md border border-neutral-200 p-3">
      <div>
        <div className="text-sm font-medium">{product.name}</div>
        <div className="text-xs text-neutral-500">
          /{product.slug} · used {usageCount}×
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