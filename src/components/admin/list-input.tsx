'use client'

import { useState } from 'react'

export function ListInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string
  values: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState('')

  function addItem() {
    if (!draft.trim()) return
    onChange([...values, draft.trim()])
    setDraft('')
  }

  function removeItem(index: number) {
    onChange(values.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addItem()
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addItem}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          Add
        </button>
      </div>
      <ul className="space-y-1">
        {values.map((v, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-1.5 text-sm"
          >
            {v}
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-neutral-400 hover:text-red-600"
              aria-label="Remove"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}