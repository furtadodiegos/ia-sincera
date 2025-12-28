'use client'

import { useEffect } from 'react'
import { initPostHog } from './client'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog()
  }, [])

  return <>{children}</>
}
