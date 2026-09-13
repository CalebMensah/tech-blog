'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteArticle } from '@/actions/article-actions'

export function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  async function handleDelete() {
    await deleteArticle(articleId)
    router.push('/admin/articles')
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span>Are you sure?</span>
        <button onClick={handleDelete} className="font-medium text-red-600">
          Yes, delete
        </button>
        <button onClick={() => setConfirming(false)} className="text-neutral-500">
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-red-600 hover:underline"
    >
      Delete
    </button>
  )
}