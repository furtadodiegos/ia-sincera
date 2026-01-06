'use client'

import { useEffect, useState } from 'react'

import { analytics } from '@/lib/posthog'
import type { DailyLimitError, LLMProvider, RoastMode, RoastResponse } from '@/lib/types'

const STORAGE_KEY = 'ia-sincera-draft'

function loadDraft(): { drama: string; mode: RoastMode } {
  if (typeof window === 'undefined') {
    return { drama: '', mode: 'tio_churrasco' }
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { drama: parsed.drama || '', mode: parsed.mode || 'tio_churrasco' }
    }
  } catch {
    // Ignore localStorage errors
  }
  return { drama: '', mode: 'tio_churrasco' }
}

function saveDraft(drama: string, mode: RoastMode) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ drama, mode }))
  } catch {
    // Ignore localStorage errors
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore localStorage errors
  }
}

export function useRoastForm() {
  const [drama, setDrama] = useState('')
  const [mode, setMode] = useState<RoastMode>('tio_churrasco')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RoastResponse | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [dailyRemaining, setDailyRemaining] = useState<number | null>(null)
  const [dailyLimitInfo, setDailyLimitInfo] = useState<DailyLimitError | null>(null)

  useEffect(() => {
    const draft = loadDraft()
    if (draft.drama) {
      setDrama(draft.drama)
    }
    if (draft.mode) {
      setMode(draft.mode)
    }
  }, [])

  useEffect(() => {
    if (drama || mode !== 'tio_churrasco') {
      saveDraft(drama, mode)
    }
  }, [drama, mode])

  function handleModeChange(newMode: RoastMode) {
    setMode(newMode)
  }

  type ApiResponse = { ok: boolean; status: number; data: Record<string, unknown> }

  function handleApiError({ status, data }: ApiResponse) {
    if (data.require_login) {
      setShowLoginModal(true)
      analytics.roastError('limit_reached')
      return
    }
    if (data.daily_limit_reached) {
      setDailyLimitInfo(data as unknown as DailyLimitError)
      setDailyRemaining(0)
      analytics.roastError('daily_limit')
      return
    }
    const errorType = status === 429 ? 'rate_limit' : 'api_error'
    analytics.roastError(errorType)
    setError((data.error as string) || 'Erro ao gerar roast')
  }

  function handleApiSuccess(data: Record<string, unknown>) {
    analytics.roastCompleted(
      data.mode as RoastMode,
      data.response_time_ms as number,
      (data.was_moderated as boolean) ?? false,
      data.provider as LLMProvider,
    )
    setResult({ ...data, drama } as unknown as RoastResponse)
    if (typeof data.daily_remaining === 'number') {
      setDailyRemaining(data.daily_remaining)
    }
    setDrama('')
    clearDraft()
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
        handleApiError({ ok: res.ok, status: res.status, data })
        return
      }

      handleApiSuccess(data)
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
    dailyRemaining,
    dailyLimitInfo,
    setDailyLimitInfo,
    handleModeChange,
    handleSubmit,
  }
}
