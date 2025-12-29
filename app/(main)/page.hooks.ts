'use client'

import { useState } from 'react'
import { analytics } from '@/lib/posthog'
import type { RoastMode, RoastResponse } from '@/lib/types'

export function useRoastForm() {
  const [drama, setDrama] = useState('')
  const [mode, setMode] = useState<RoastMode>('tio_churrasco')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RoastResponse | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

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
        if (data.require_login) {
          setShowLoginModal(true)
          analytics.roastError('limit_reached')
          return
        }
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

  return {
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
  }
}
