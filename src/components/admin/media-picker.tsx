'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { listMedia, uploadMedia } from '@/actions/media-actions'

type MediaItem = { id: string; url: string; altText: string | null }

export function MediaPicker({
  onSelect,
  onClose,
}: {
  onSelect: (item: { url: string; alt: string }) => void
  onClose: () => void
}) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    listMedia()
      .then(setMedia)
      .catch(() => setError('Failed to load media'))
      .finally(() => setLoading(false))
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.set('file', file)
      const newMedia = await uploadMedia(formData)
      setMedia((prev) => [{ id: newMedia.id, url: newMedia.url, altText: newMedia.altText }, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Insert image</h2>
          <button onClick={onClose} className="text-sm text-neutral-500">
            Close
          </button>
        </div>

        <label className="mt-4 inline-block cursor-pointer rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          {uploading ? 'Uploading…' : 'Upload new image'}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-6 text-sm text-neutral-500">Loading media…</p>
        ) : (
          <div className="mt-6 grid grid-cols-4 gap-3">
            {media.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect({ url: item.url, alt: item.altText ?? '' })}
                className="relative aspect-square overflow-hidden rounded-md border border-neutral-200 hover:ring-2 hover:ring-neutral-900"
              >
                <Image src={item.url} alt={item.altText ?? ''} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {!loading && media.length === 0 && (
          <p className="mt-6 text-sm text-neutral-500">No images uploaded yet.</p>
        )}
      </div>
    </div>
  )
}