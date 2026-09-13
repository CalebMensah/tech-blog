'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { uploadMedia } from '@/actions/media-actions'

export function MediaUploader() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set('file', file)
      await uploadMedia(formData)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="inline-block cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
        {uploading ? 'Uploading…' : 'Upload Image'}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}