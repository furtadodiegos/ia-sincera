import { getPostHog } from './client'

type RoastMode = 'tio_churrasco' | 'coach_quantico' | 'amigo_sincero'
type LLMProvider = 'openai' | 'gemini'

export const analytics = {
  roastRequested: async (mode: RoastMode, dramaLength: number) => {
    const posthog = await getPostHog()
    posthog.capture('roast_requested', { mode, drama_length: dramaLength })
  },

  roastCompleted: async (mode: RoastMode, responseTimeMs: number, wasModerated: boolean, provider: LLMProvider) => {
    const posthog = await getPostHog()
    posthog.capture('roast_completed', {
      mode,
      response_time_ms: responseTimeMs,
      was_moderated: wasModerated,
      provider,
    })
  },

  roastError: async (errorType: 'rate_limit' | 'api_error' | 'network_error' | 'limit_reached' | 'daily_limit') => {
    const posthog = await getPostHog()
    posthog.capture('roast_error', { error_type: errorType })
  },

  roastShared: async (mode: RoastMode, provider: LLMProvider) => {
    const posthog = await getPostHog()
    posthog.capture('roast_shared', { mode, provider })
  },
}
