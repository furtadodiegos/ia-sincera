'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef } from 'react'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useRoastForm } from '../page.hooks'
import { ModeSelector } from './ModeSelector'

const LoginModal = dynamic(() => import('./LoginModal').then((mod) => mod.LoginModal), {
  ssr: false,
})

const DailyLimitModal = dynamic(() => import('./DailyLimitModal').then((mod) => mod.DailyLimitModal), {
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
    dailyRemaining,
    dailyLimitInfo,
    setDailyLimitInfo,
    handleModeChange,
    handleSubmit,
  } = useRoastForm()

  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [result])

  return (
    <>
      {dailyRemaining !== null && (
        <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-600">
          <span>🔥</span>
          <span>
            {dailyRemaining === 0
              ? 'Voce usou todas as zoeiras de hoje'
              : `${dailyRemaining} zoeira${dailyRemaining === 1 ? '' : 's'} restante${dailyRemaining === 1 ? '' : 's'} hoje`}
          </span>
        </div>
      )}

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
      <DailyLimitModal limitInfo={dailyLimitInfo} onClose={() => setDailyLimitInfo(null)} />
    </>
  )
}
