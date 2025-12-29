'use client'

import { MODE_LABELS, type RoastMode } from '@/lib/types'

type ModeSelectorProps = {
  value: RoastMode
  onChange: (mode: RoastMode) => void
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <fieldset className="border-none p-0">
      <legend className="mb-1 block text-sm font-medium">Modo</legend>
      <div className="flex gap-2">
        {(Object.keys(MODE_LABELS) as RoastMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`flex-1 rounded border p-2 text-sm ${
              value === mode ? 'border-blue-500 bg-blue-500 text-white' : 'border-zinc-300 dark:border-zinc-700'
            }`}>
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
