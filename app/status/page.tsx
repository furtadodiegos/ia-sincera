'use client'

import { useCallback, useEffect, useState } from 'react'

type Stats = {
  total_roasts: number
  today_roasts: number
  moderated_count: number
  fallback_count: number
  avg_response_time_ms: number
  last_roast_at: string | null
}

export default function StatusPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/status')
      if (!res.ok) {
        throw new Error('Erro ao buscar metricas')
      }
      const data = await res.json()
      setStats(data)
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
      <main className="mx-auto max-w-xl p-4">
        <h1 className="mb-8 text-center text-2xl font-bold">Status</h1>
        <p className="text-center text-zinc-500">Carregando...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-xl p-4">
        <h1 className="mb-8 text-center text-2xl font-bold">Status</h1>
        <p className="text-center text-red-500">{error}</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="mb-8 text-center text-2xl font-bold">Status</h1>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total de Roasts" value={stats?.total_roasts ?? 0} />
        <StatCard label="Roasts Hoje" value={stats?.today_roasts ?? 0} />
        <StatCard label="Moderados" value={stats?.moderated_count ?? 0} />
        <StatCard label="Fallbacks" value={stats?.fallback_count ?? 0} />
        <StatCard label="Tempo Medio" value={`${stats?.avg_response_time_ms ?? 0}ms`} className="col-span-2" />
      </div>

      {stats?.last_roast_at && (
        <p className="mt-6 text-center text-xs text-zinc-500">
          Ultimo roast: {new Date(stats.last_roast_at).toLocaleString('pt-BR')}
        </p>
      )}

      <p className="mt-8 text-center text-xs text-zinc-400">
        <a href="/" className="underline">
          Voltar
        </a>
      </p>
    </main>
  )
}

function StatCard({ label, value, className = '' }: { label: string; value: string | number; className?: string }) {
  return (
    <div className={`rounded border border-zinc-200 p-4 text-center dark:border-zinc-800 ${className}`}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
