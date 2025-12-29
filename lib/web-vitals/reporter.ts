'use client'

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'

type WebVitalMetric = {
  name: 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

function sendMetric(metric: WebVitalMetric) {
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', JSON.stringify(metric))
  } else {
    fetch('/api/vitals', {
      method: 'POST',
      body: JSON.stringify(metric),
      keepalive: true,
    })
  }
}

export function reportWebVitals() {
  onCLS((metric) => {
    sendMetric({ name: 'CLS', value: metric.value, rating: metric.rating })
  })

  onFCP((metric) => {
    sendMetric({ name: 'FCP', value: metric.value, rating: metric.rating })
  })

  onINP((metric) => {
    sendMetric({ name: 'INP', value: metric.value, rating: metric.rating })
  })

  onLCP((metric) => {
    sendMetric({ name: 'LCP', value: metric.value, rating: metric.rating })
  })

  onTTFB((metric) => {
    sendMetric({ name: 'TTFB', value: metric.value, rating: metric.rating })
  })
}
