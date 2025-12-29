export type RoastMode = 'tio_churrasco' | 'coach_quantico' | 'amigo_sincero'

export const VALID_MODES: RoastMode[] = ['tio_churrasco', 'coach_quantico', 'amigo_sincero']

export type RoastResponse = {
  roast: string
  advice: string
  closing: string
  mode: RoastMode
  response_time_ms: number
  was_moderated?: boolean
  fallback?: boolean
}

export const MODE_LABELS: Record<RoastMode, string> = {
  tio_churrasco: 'Tio do Churrasco',
  coach_quantico: 'Coach Quantico',
  amigo_sincero: 'Amigo Sincero',
}
