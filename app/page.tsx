'use client'

import { useState } from 'react'
import { analytics } from '@/lib/posthog'

type RoastMode = 'tio_churrasco' | 'coach_quantico' | 'amigo_sincero'

type RoastResponse = {
  roast: string
  advice: string
  closing: string
  mode: RoastMode
  response_time_ms: number
  was_moderated?: boolean
  fallback?: boolean
}

const MODE_LABELS: Record<RoastMode, string> = {
  tio_churrasco: 'Tio do Churrasco',
  coach_quantico: 'Coach Quantico',
  amigo_sincero: 'Amigo Sincero',
}

export default function Home() {
  const [drama, setDrama] = useState('')
  const [mode, setMode] = useState<RoastMode>('tio_churrasco')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RoastResponse | null>(null)

  function handleModeChange(newMode: RoastMode) {
    setMode(newMode)
    analytics.modeSelected(newMode)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    analytics.roastRequested(mode, drama.length)

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drama, mode }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorType = res.status === 429 ? 'rate_limit' : 'api_error'
        analytics.roastError(errorType)
        setError(data.error || 'Erro ao gerar roast')
        return
      }

      analytics.roastCompleted(data.mode, data.response_time_ms, data.was_moderated ?? false)
      setResult(data)
      setDrama('')
    } catch {
      analytics.roastError('network_error')
      setError('Erro de conexao')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="mb-8 text-center text-2xl font-bold">IA Sincera</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="drama" className="mb-1 block text-sm font-medium">
            Drama do amigo
          </label>
          <textarea
            id="drama"
            value={drama}
            onChange={(e) => setDrama(e.target.value)}
            maxLength={140}
            rows={3}
            className="w-full rounded border border-zinc-300 p-2 dark:border-zinc-700 dark:bg-zinc-900"
            placeholder="Conta o drama..."
            required
          />
          <p className="mt-1 text-right text-xs text-zinc-500">{drama.length}/140</p>
        </div>

        <fieldset className="border-none p-0">
          <legend className="mb-1 block text-sm font-medium">Modo</legend>
          <div className="flex gap-2">
            {(Object.keys(MODE_LABELS) as RoastMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                className={`flex-1 rounded border p-2 text-sm ${
                  mode === m ? 'border-blue-500 bg-blue-500 text-white' : 'border-zinc-300 dark:border-zinc-700'
                }`}>
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={loading || drama.length === 0}
          className="w-full rounded bg-zinc-900 p-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
          {loading ? 'Gerando...' : 'Gerar Roast'}
        </button>
      </form>

      {error && <p className="mt-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      {result && (
        <div className="mt-6 space-y-4 rounded border border-zinc-200 p-4 dark:border-zinc-800">
          <div>
            <p className="text-xs text-zinc-500">Roast ({MODE_LABELS[result.mode]})</p>
            <p className="text-lg">{result.roast}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Conselho</p>
            <p>{result.advice}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">Fechamento</p>
            <p className="italic">{result.closing}</p>
          </div>
          <p className="text-xs text-zinc-400">
            {result.response_time_ms}ms
            {result.was_moderated && ' | moderado'}
            {result.fallback && ' | fallback'}
          </p>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-zinc-400">
        <a href="/status" className="underline">
          Ver metricas
        </a>
      </p>
    </main>
  )
}
