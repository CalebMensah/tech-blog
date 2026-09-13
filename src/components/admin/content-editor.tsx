'use client'

import { useRef, useState } from 'react'
import { MediaPicker } from './media-picker'

export function ContentEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  function insertAtCursor(text: string) {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const before = value.slice(0, start)
    const after = value.slice(end)

    // Add surrounding newlines so the image sits on its own line,
    // whether it's inserted mid-paragraph or on an empty line.
    const needsLeadingBreak = before.length > 0 && !before.endsWith('\n\n')
    const needsTrailingBreak = after.length > 0 && !after.startsWith('\n\n')

    const insertion = `${needsLeadingBreak ? '\n\n' : ''}${text}${needsTrailingBreak ? '\n\n' : ''}`
    const next = before + insertion + after

    onChange(next)

    // Restore focus and move cursor to just after the inserted text
    requestAnimationFrame(() => {
      textarea.focus()
      const cursorPos = start + insertion.length
      textarea.setSelectionRange(cursorPos, cursorPos)
    })
  }

  function handleImageSelect({ url, alt }: { url: string; alt: string }) {
    insertAtCursor(`![${alt || 'image'}](${url})`)
    setPickerOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Content (Markdown)</label>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="rounded-md border border-neutral-300 px-3 py-1 text-xs font-medium hover:bg-neutral-50"
        >
          Insert image
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={16}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 font-mono text-sm"
        required
      />

      <p className="text-xs text-neutral-500">
        Click into the content where you want an image, then click "Insert image."
      </p>

      {pickerOpen && (
        <MediaPicker onSelect={handleImageSelect} onClose={() => setPickerOpen(false)} />
      )}
    </div>
  )
}