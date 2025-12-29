import { redis } from './client'

const KEYS = {
  totalRoasts: 'stats:roasts:total',
  todayRoasts: 'stats:roasts:today',
  moderatedRoasts: 'stats:roasts:moderated',
  responseTimes: 'stats:response_times',
  totalTokens: 'stats:tokens:total',
  vitalsCLS: 'vitals:cls',
  vitalsFCP: 'vitals:fcp',
  vitalsINP: 'vitals:inp',
  vitalsLCP: 'vitals:lcp',
  vitalsTTFB: 'vitals:ttfb',
}

export async function incrementRoastStats(params: { responseTimeMs: number; tokens: number; wasModerated: boolean }) {
  const pipeline = redis.pipeline()

  pipeline.incr(KEYS.totalRoasts)
  pipeline.incr(KEYS.todayRoasts)
  pipeline.lpush(KEYS.responseTimes, params.responseTimeMs)
  pipeline.ltrim(KEYS.responseTimes, 0, 99)
  pipeline.incrby(KEYS.totalTokens, params.tokens)

  if (params.wasModerated) {
    pipeline.incr(KEYS.moderatedRoasts)
  }

  await pipeline.exec()
}

function calcP75(values: number[]): number {
  if (!values || values.length === 0) {
    return 0
  }
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.floor(sorted.length * 0.75)
  return Math.round(sorted[index] * 100) / 100
}

export async function getStats() {
  const [totalRoasts, todayRoasts, moderatedRoasts, responseTimes, totalTokens, cls, fcp, inp, lcp, ttfb] =
    await Promise.all([
      redis.get<number>(KEYS.totalRoasts),
      redis.get<number>(KEYS.todayRoasts),
      redis.get<number>(KEYS.moderatedRoasts),
      redis.lrange<number>(KEYS.responseTimes, 0, -1),
      redis.get<number>(KEYS.totalTokens),
      redis.lrange<number>(KEYS.vitalsCLS, 0, -1),
      redis.lrange<number>(KEYS.vitalsFCP, 0, -1),
      redis.lrange<number>(KEYS.vitalsINP, 0, -1),
      redis.lrange<number>(KEYS.vitalsLCP, 0, -1),
      redis.lrange<number>(KEYS.vitalsTTFB, 0, -1),
    ])

  const avgResponseTime =
    responseTimes && responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0

  return {
    totalRoasts: totalRoasts ?? 0,
    todayRoasts: todayRoasts ?? 0,
    moderatedRoasts: moderatedRoasts ?? 0,
    avgResponseTimeMs: avgResponseTime,
    totalTokens: totalTokens ?? 0,
    webVitals: {
      cls: calcP75(cls ?? []),
      fcp: calcP75(fcp ?? []),
      inp: calcP75(inp ?? []),
      lcp: calcP75(lcp ?? []),
      ttfb: calcP75(ttfb ?? []),
      samples: (cls ?? []).length,
    },
  }
}
