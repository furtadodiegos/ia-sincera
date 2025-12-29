import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'
import { getStats } from '@/lib/redis'

export const revalidate = 10

export async function GET() {
  try {
    const stats = await getStats()

    return NextResponse.json({
      status: 'ok',
      uptime: process.uptime(),
      stats: {
        total_roasts: stats.totalRoasts,
        today_roasts: stats.todayRoasts,
        moderated_roasts: stats.moderatedRoasts,
        avg_response_time_ms: stats.avgResponseTimeMs,
        total_tokens: stats.totalTokens,
      },
      web_vitals: {
        lcp: stats.webVitals.lcp,
        cls: stats.webVitals.cls,
        inp: stats.webVitals.inp,
        fcp: stats.webVitals.fcp,
        ttfb: stats.webVitals.ttfb,
        samples: stats.webVitals.samples,
      },
    })
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: 'status' } })
    return NextResponse.json(
      {
        status: 'error',
        message: 'Erro ao buscar metricas',
      },
      { status: 500 },
    )
  }
}
