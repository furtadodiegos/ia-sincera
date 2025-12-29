import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

type WebVitalMetric = {
  name: 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

const KEYS = {
  CLS: 'vitals:cls',
  FCP: 'vitals:fcp',
  INP: 'vitals:inp',
  LCP: 'vitals:lcp',
  TTFB: 'vitals:ttfb',
}

export async function POST(request: Request) {
  try {
    const metric: WebVitalMetric = await request.json()

    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
    }

    const key = KEYS[metric.name]
    if (!key) {
      return NextResponse.json({ error: 'Unknown metric' }, { status: 400 })
    }

    const pipeline = redis.pipeline()
    pipeline.lpush(key, metric.value)
    pipeline.ltrim(key, 0, 99)
    await pipeline.exec()

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save metric' }, { status: 500 })
  }
}
