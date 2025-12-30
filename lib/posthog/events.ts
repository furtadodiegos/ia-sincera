import { posthog } from './client'

type RoastMode = 'tio_churrasco' | 'coach_quantico' | 'amigo_sincero'
type LLMProvider = 'openai' | 'gemini'

export const analytics = {
  roastRequested: (mode: RoastMode, dramaLength: number) => {
    posthog.capture('roast_requested', { mode, drama_length: dramaLength })
  },

  roastCompleted: (mode: RoastMode, responseTimeMs: number, wasModerated: boolean, provider: LLMProvider) => {
    posthog.capture('roast_completed', {
      mode,
      response_time_ms: responseTimeMs,
      was_moderated: wasModerated,
      provider,
    })
  },

  roastError: (errorType: 'rate_limit' | 'api_error' | 'network_error' | 'limit_reached') => {
    posthog.capture('roast_error', { error_type: errorType })
  },

  roastShared: (mode: RoastMode, provider: LLMProvider) => {
    posthog.capture('roast_shared', { mode, provider })
  },
}
