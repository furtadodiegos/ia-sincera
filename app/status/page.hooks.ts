'use client'

import { useCallback, useEffect, useState } from 'react'

import type { StatusData } from './status.types'

export function useStatusPolling(intervalMs = 10000) {
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
    const interval = setInterval(fetchStats, intervalMs)
    return () => clearInterval(interval)
  }, [fetchStats, intervalMs])

  return { data, loading, error }
}
