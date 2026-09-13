'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteReview } from '@/actions/review-actions'

export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  async function handleDelete() {
    await deleteReview(reviewId)
    router.push('/admin/reviews')
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
    <button onClick={() => setConfirming(true)} className="text-sm text-red-600 hover:underline">
      Delete
    </button>
  )
}