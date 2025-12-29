import { posthog } from './client'

type RoastMode = 'tio_churrasco' | 'coach_quantico' | 'amigo_sincero'

export const analytics = {
  modeSelected: (mode: RoastMode) => {
    posthog.capture('mode_selected', { mode })
  },

  roastRequested: (mode: RoastMode, dramaLength: number) => {
    posthog.capture('roast_requested', { mode, drama_length: dramaLength })
  },

  roastCompleted: (mode: RoastMode, responseTimeMs: number, wasModerated: boolean) => {
    posthog.capture('roast_completed', {
      mode,
      response_time_ms: responseTimeMs,
      was_moderated: wasModerated,
    })
  },

  roastError: (errorType: 'rate_limit' | 'api_error' | 'network_error' | 'limit_reached') => {
    posthog.capture('roast_error', { error_type: errorType })
  },

  roastShared: (mode: RoastMode) => {
    posthog.capture('roast_shared', { mode })
  },
}
