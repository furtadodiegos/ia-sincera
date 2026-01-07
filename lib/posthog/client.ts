export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || ''
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

let posthogInstance: typeof import('posthog-js').default | null = null

export async function getPostHog() {
  if (!posthogInstance) {
    const { default: posthog } = await import('posthog-js')
    posthogInstance = posthog
  }

  return posthogInstance
}

export function initPostHog() {
  if (typeof window === 'undefined' || !POSTHOG_KEY) {
    return
  }

  const init = async () => {
    const posthog = await getPostHog()
    if (!posthog.__loaded) {
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only',
        capture_pageview: true,
        capture_pageleave: true,
        loaded: (ph) => {
          if (process.env.NODE_ENV === 'development') {
            ph.debug()
          }
        },
      })
    }
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => init(), { timeout: 5000 })
  } else {
    setTimeout(init, 100)
  }
}
