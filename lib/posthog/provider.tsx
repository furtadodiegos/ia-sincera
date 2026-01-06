'use client'

import { useEffect } from 'react'

import { initPostHog } from './client'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        async () => {
          const { reportWebVitals } = await import('@/lib/web-vitals')
          reportWebVitals()
        },
        { timeout: 5000 },
      )
    } else {
      setTimeout(async () => {
        const { reportWebVitals } = await import('@/lib/web-vitals')
        reportWebVitals()
      }, 100)
    }
  }, [])

  return <>{children}</>
}
