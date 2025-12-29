'use client'

import { useStatusPolling } from '../page.hooks'
import { StatCard } from './StatCard'
import { VitalCard } from './VitalCard'

export function StatusDashboard() {
  const { data, loading, error } = useStatusPolling()

  if (loading) {
    return <p className="text-center text-zinc-500">Carregando...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>
  }

  const stats = data?.stats
  const vitals = data?.web_vitals

  return (
    <>
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
    </>
  )
}
