'use client'

import { useEffect } from 'react'
import { reportWebVitals } from '@/lib/web-vitals'
import { initPostHog } from './client'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()
    reportWebVitals()
  }, [])

  return <>{children}</>
}
