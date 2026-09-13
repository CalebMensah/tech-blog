'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { deleteMedia, updateMediaAltText } from '@/actions/media-actions'

type MediaItem = {
  id: string
  url: string
  altText: string | null
  createdAt: string
}

export function MediaGrid({ media }: { media: MediaItem[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<MediaItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-6 gap-3">
        {media.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className="relative aspect-square overflow-hidden rounded-md border border-neutral-200"
          >
            <Image src={item.url} alt={item.altText ?? ''} fill className="object-cover" />
          </button>
        ))}
      </div>

      {media.length === 0 && (
        <p className="text-sm text-neutral-500">No media uploaded yet.</p>
      )}

      {selected && (
        <MediaDetailModal
          item={selected}
          onClose={() => setSelected(null)}
          onChange={() => router.refresh()}
        />
      )}
    </>
  )
}

function MediaDetailModal({
  item,
  onClose,
  onChange,
}: {
  item: MediaItem
  onClose: () => void
  onChange: () => void
}) {
  const [altText, setAltText] = useState(item.altText ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSaveAlt() {
    setSaving(true)
    await updateMediaAltText(item.id, altText)
    setSaving(false)
    onChange()
  }

  async function handleDelete() {
    setError(null)
    try {
      await deleteMedia(item.id)
      onChange()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="relative aspect-video overflow-hidden rounded-md bg-neutral-100">
          <Image src={item.url} alt={altText} fill className="object-contain" />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-4 space-y-1">
          <label className="text-sm font-medium">Alt text</label>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            placeholder="Describe this image for accessibility and SEO"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={handleSaveAlt}
              disabled={saving}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save alt text'}
            </button>
            <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
              Delete image
            </button>
          </div>
          <button onClick={onClose} className="text-sm text-neutral-500">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}