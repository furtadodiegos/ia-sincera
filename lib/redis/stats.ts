import { redis } from './client'

const KEYS = {
  totalRoasts: 'stats:roasts:total',
  todayRoasts: 'stats:roasts:today',
  moderatedRoasts: 'stats:roasts:moderated',
  responseTimes: 'stats:response_times',
  totalTokens: 'stats:tokens:total',
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

export async function getStats() {
  const [totalRoasts, todayRoasts, moderatedRoasts, responseTimes, totalTokens] = await Promise.all([
    redis.get<number>(KEYS.totalRoasts),
    redis.get<number>(KEYS.todayRoasts),
    redis.get<number>(KEYS.moderatedRoasts),
    redis.lrange<number>(KEYS.responseTimes, 0, -1),
    redis.get<number>(KEYS.totalTokens),
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
  }
}
