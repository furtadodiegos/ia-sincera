'use client'

import type { DailyLimitError } from '@/lib/types'

type Props = {
  limitInfo: DailyLimitError | null
  onClose: () => void
}

function formatResetTime(resetTimestamp: number): string {
  const resetDate = new Date(resetTimestamp)
  const now = new Date()

  const diffMs = resetDate.getTime() - now.getTime()
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))

  if (diffHours <= 1) {
    return 'menos de 1 hora'
  }
  if (diffHours < 24) {
    return `${diffHours} horas`
  }
  return 'amanha'
}

export function DailyLimitModal({ limitInfo, onClose }: Props) {
  if (!limitInfo) {
    return null
  }

  const resetText = formatResetTime(limitInfo.daily_reset)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-limit-modal-title"
        className="animate-slide-up relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-linear-to-r from-orange-500 to-red-500 p-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
            🔥
          </div>

          <h2 id="daily-limit-modal-title" className="text-xl font-bold">
            Cota diaria esgotada!
          </h2>
        </div>

        <div className="p-6">
          <p className="mb-4 text-center text-slate-600">
            Voce ja usou todas as 5 zoeiras de hoje. A IA tambem precisa descansar!
          </p>

          <div className="mb-6 rounded-lg bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-500">Proximas zoeiras disponiveis em</p>
            <p className="text-lg font-semibold text-slate-700">{resetText}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-3 font-medium text-white shadow-sm transition-all hover:shadow-md">
            Entendi, volto depois
          </button>
        </div>
      </div>
    </div>
  )
}
