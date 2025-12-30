import { redis } from '@/lib/redis'

export type LLMProvider = 'openai' | 'gemini'

const TTL_SECONDS = 60 * 60 * 24 // 24 hours

function getRedisKey(identifier: string): string {
  return `llm:counter:${identifier}`
}

export async function selectProvider(identifier: string): Promise<LLMProvider> {
  const key = getRedisKey(identifier)
  const counter = (await redis.get<number>(key)) ?? 0

  // Ratio 2:1 - positions 0,1 = openai, position 2 = gemini
  return counter % 3 === 2 ? 'gemini' : 'openai'
}

export async function incrementProviderCounter(identifier: string): Promise<void> {
  const key = getRedisKey(identifier)

  await redis.incr(key)
  await redis.expire(key, TTL_SECONDS)
}
