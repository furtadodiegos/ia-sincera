'use client'

import { useCallback, useEffect, useState } from 'react'

type Stats = {
  total_roasts: number
  today_roasts: number
  moderated_roasts: number
  avg_response_time_ms: number
  total_tokens: number
}

type WebVitals = {
  lcp: number
  cls: number
  inp: number
  fcp: number
  ttfb: number
  samples: number
}

type StatusData = {
  stats: Stats
  web_vitals: WebVitals
}

const VITALS_THRESHOLDS = {
  lcp: { good: 2500, poor: 4000, unit: 'ms', label: 'LCP' },
  cls: { good: 0.1, poor: 0.25, unit: '', label: 'CLS' },
  inp: { good: 200, poor: 500, unit: 'ms', label: 'INP' },
  fcp: { good: 1800, poor: 3000, unit: 'ms', label: 'FCP' },
  ttfb: { good: 800, poor: 1800, unit: 'ms', label: 'TTFB' },
}

function getVitalRating(name: keyof typeof VITALS_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = VITALS_THRESHOLDS[name]
  if (value <= threshold.good) {
    return 'good'
  }
  if (value <= threshold.poor) {
    return 'needs-improvement'
  }
  return 'poor'
}

function getRatingColor(rating: 'good' | 'needs-improvement' | 'poor'): string {
  switch (rating) {
    case 'good':
      return 'text-green-500'
    case 'needs-improvement':
      return 'text-yellow-500'
    case 'poor':
      return 'text-red-500'
  }
}

function getRatingBg(rating: 'good' | 'needs-improvement' | 'poor'): string {
  switch (rating) {
    case 'good':
      return 'bg-green-500/10 border-green-500/20'
    case 'needs-improvement':
      return 'bg-yellow-500/10 border-yellow-500/20'
    case 'poor':
      return 'bg-red-500/10 border-red-500/20'
  }
}

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/status')
      if (!res.ok) {
        throw new Error('Erro ao buscar metricas')
      }
      const json = await res.json()
      setData({ stats: json.stats, web_vitals: json.web_vitals })
      setError(null)
    } catch {
      setError('Erro ao carregar metricas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [fetchStats])

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <h1 className="mb-8 text-center text-2xl font-bold">Status</h1>
        <p className="text-center text-zinc-500">Carregando...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <h1 className="mb-8 text-center text-2xl font-bold">Status</h1>
        <p className="text-center text-red-500">{error}</p>
      </main>
    )
  }

  const stats = data?.stats
  const vitals = data?.web_vitals

  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-2 text-center text-2xl font-bold">Status</h1>
      <p className="mb-8 text-center text-sm text-zinc-500">Monitoramento de Performance</p>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Core Web Vitals</h2>
        {vitals && vitals.samples > 0 ? (
          <>
            <div className="grid grid-cols-3 gap-3">
              <VitalCard name="lcp" value={vitals.lcp} />
              <VitalCard name="cls" value={vitals.cls} />
              <VitalCard name="inp" value={vitals.inp} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <VitalCard name="fcp" value={vitals.fcp} />
              <VitalCard name="ttfb" value={vitals.ttfb} />
            </div>
            <p className="mt-2 text-center text-xs text-zinc-500">P75 de {vitals.samples} amostras</p>
          </>
        ) : (
          <div className="rounded border border-zinc-200 p-6 text-center dark:border-zinc-800">
            <p className="text-zinc-500">Aguardando amostras...</p>
            <p className="mt-1 text-xs text-zinc-400">Navegue pelo site para coletar metricas</p>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">API Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total de Roasts" value={stats?.total_roasts ?? 0} />
          <StatCard label="Roasts Hoje" value={stats?.today_roasts ?? 0} />
          <StatCard label="Moderados" value={stats?.moderated_roasts ?? 0} />
          <StatCard label="Tokens Usados" value={stats?.total_tokens ?? 0} />
        </div>
        <div className="mt-3">
          <StatCard label="Tempo Medio LLM" value={`${stats?.avg_response_time_ms ?? 0}ms`} />
        </div>
      </section>

      <p className="text-center text-xs text-zinc-400">
        <a href="/" className="underline">
          Voltar
        </a>
      </p>
    </main>
  )
}

function VitalCard({ name, value }: { name: keyof typeof VITALS_THRESHOLDS; value: number }) {
  const config = VITALS_THRESHOLDS[name]
  const rating = getVitalRating(name, value)
  const colorClass = getRatingColor(rating)
  const bgClass = getRatingBg(rating)

  const displayValue = name === 'cls' ? value.toFixed(3) : Math.round(value)

  return (
    <div className={`rounded border p-3 text-center ${bgClass}`}>
      <p className="text-xs font-medium text-zinc-500">{config.label}</p>
      <p className={`text-xl font-bold ${colorClass}`}>
        {displayValue}
        {config.unit}
      </p>
      <p className="text-xs text-zinc-400">
        target: &lt;{config.good}
        {config.unit}
      </p>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded border border-zinc-200 p-3 text-center dark:border-zinc-800">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  )
}
