export type Stats = {
  total_roasts: number
  today_roasts: number
  moderated_roasts: number
  avg_response_time_ms: number
  total_tokens: number
}

export type WebVitals = {
  lcp: number
  cls: number
  inp: number
  fcp: number
  ttfb: number
  samples: number
}

export type StatusData = {
  stats: Stats
  web_vitals: WebVitals
}

export type VitalRating = 'good' | 'needs-improvement' | 'poor'

export type VitalName = 'lcp' | 'cls' | 'inp' | 'fcp' | 'ttfb'

export const VITALS_THRESHOLDS: Record<VitalName, { good: number; poor: number; unit: string; label: string }> = {
  lcp: { good: 2500, poor: 4000, unit: 'ms', label: 'LCP' },
  cls: { good: 0.1, poor: 0.25, unit: '', label: 'CLS' },
  inp: { good: 200, poor: 500, unit: 'ms', label: 'INP' },
  fcp: { good: 1800, poor: 3000, unit: 'ms', label: 'FCP' },
  ttfb: { good: 800, poor: 1800, unit: 'ms', label: 'TTFB' },
}

export function getVitalRating(name: VitalName, value: number): VitalRating {
  const threshold = VITALS_THRESHOLDS[name]
  if (value <= threshold.good) {
    return 'good'
  }
  if (value <= threshold.poor) {
    return 'needs-improvement'
  }
  return 'poor'
}

export function getRatingColor(rating: VitalRating): string {
  switch (rating) {
    case 'good':
      return 'text-green-500'
    case 'needs-improvement':
      return 'text-yellow-500'
    case 'poor':
      return 'text-red-500'
  }
}

export function getRatingBg(rating: VitalRating): string {
  switch (rating) {
    case 'good':
      return 'bg-green-500/10 border-green-500/20'
    case 'needs-improvement':
      return 'bg-yellow-500/10 border-yellow-500/20'
    case 'poor':
      return 'bg-red-500/10 border-red-500/20'
  }
}
