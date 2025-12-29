'use client'

import { useRoastForm } from '../page.hooks'
import { ModeSelector } from './ModeSelector'
import { RoastResult } from './RoastResult'

export function RoastForm() {
  const { drama, setDrama, mode, loading, error, result, handleModeChange, handleSubmit } = useRoastForm()

  return (
    <>
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

        <ModeSelector value={mode} onChange={handleModeChange} />

        <button
          type="submit"
          disabled={loading || drama.length === 0}
          className="w-full rounded bg-zinc-900 p-3 font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
          {loading ? 'Gerando...' : 'Gerar Roast'}
        </button>
      </form>

      {error && <p className="mt-4 rounded bg-red-100 p-3 text-red-700">{error}</p>}

      {result && <RoastResult result={result} />}
    </>
  )
}
