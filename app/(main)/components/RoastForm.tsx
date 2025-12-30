'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'
import { useRoastForm } from '../page.hooks'
import { ModeSelector } from './ModeSelector'

const LoginModal = dynamic(() => import('./LoginModal').then((mod) => mod.LoginModal), {
  ssr: false,
})

const RoastResult = dynamic(() => import('./RoastResult').then((mod) => mod.RoastResult), {
  ssr: false,
})

export function RoastForm() {
  const {
    drama,
    setDrama,
    mode,
    loading,
    error,
    result,
    showLoginModal,
    setShowLoginModal,
    handleModeChange,
    handleSubmit,
  } = useRoastForm()

  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [result])

  function LoadingSpinner() {
    return (
      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="drama" className="mb-2 block text-sm font-semibold text-slate-700">
            Qual é o drama de hoje?
          </label>
          <div className="ai-input-wrapper">
            <textarea
              id="drama"
              value={drama}
              onChange={(e) => setDrama(e.target.value)}
              maxLength={140}
              rows={3}
              className="ai-input"
              placeholder="Ex: João trouxe Itaipava no churrasco de novo..."
              required
            />
          </div>
          <p className="mt-2 text-right text-xs text-slate-500">{drama.length}/140</p>
        </div>

        <ModeSelector value={mode} onChange={handleModeChange} />

        <button
          type="submit"
          disabled={loading || drama.length === 0}
          className="group relative w-full cursor-pointer overflow-hidden rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50">
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <LoadingSpinner />
                Gerando resposta...
              </>
            ) : (
              <>
                <span className="text-lg">🔥</span>
                Gerar resposta irônica
              </>
            )}
          </span>
          <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-purple-600 to-pink-600 transition-transform group-hover:translate-x-0" />
        </button>
      </form>

      {error && (
        <div className="animate-slide-down mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="flex items-center gap-2 text-red-700">
            <span>⚠️</span>
            {error}
          </p>
        </div>
      )}

      {result && (
        <div ref={resultRef}>
          <RoastResult result={result} />
        </div>
      )}

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
