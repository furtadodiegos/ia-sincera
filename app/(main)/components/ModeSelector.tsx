'use client'

import Image from 'next/image'

import { MODE_LABELS, type RoastMode } from '@/lib/types'

type ModeSelectorProps = {
  value: RoastMode
  onChange: (mode: RoastMode) => void
}

const MODE_IMAGES: Record<RoastMode, string> = {
  tio_churrasco: '/tio_churrasco.jpg',
  coach_quantico: '/coach_quantico.jpg',
  amigo_sincero: '/amigo_sincero.jpg',
}

const MODE_DESCRIPTIONS: Record<RoastMode, string> = {
  tio_churrasco: 'Debochado e sem filtro',
  coach_quantico: 'Místico e exagerado',
  amigo_sincero: 'Sarcástico e direto',
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  return (
    <fieldset className="border-none p-0">
      <legend className="mb-4 block text-sm font-semibold text-slate-700">Quem vai te julgar?</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(MODE_LABELS) as RoastMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            className={`group relative cursor-pointer rounded-xl border-2 p-4 text-left transition-all ${
              value === mode
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
            }`}>
            <div className="mb-2">
              <Image
                src={MODE_IMAGES[mode]}
                alt={MODE_LABELS[mode]}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <div className={`font-semibold ${value === mode ? 'text-indigo-700' : 'text-slate-700'}`}>
              {MODE_LABELS[mode]}
            </div>
            <div className="mt-1 text-xs text-slate-500">{MODE_DESCRIPTIONS[mode]}</div>
            {value === mode && (
              <div className="absolute right-3 top-3">
                <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
