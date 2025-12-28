# Redis

## Casos de Uso

### Rate Limit

Limitar requisicoes por IP.

Chave: `rl:ip:{ip}`

TTL: 1 hora

### Cache de Respostas

Cachear dramas frequentes para evitar chamadas repetidas a LLM.

Chave: `cache:roast:{hash_do_drama}:{mode}`

TTL: 24 horas

## Limites

| Operacao | Limite |
|----------|--------|
| Requisicoes por IP | 20/min |
| Roasts por IP | 5/hora |

## Implementacao

```typescript
// Rate limit check
async function checkRateLimit(ip: string, limit: number, windowSec: number) {
  const key = `rl:ip:${ip}`
  const current = await redis.incr(key)
  if (current === 1) {
    await redis.expire(key, windowSec)
  }
  return current <= limit
}

// Cache roast
async function getCachedRoast(drama: string, mode: string) {
  const hash = createHash(drama)
  const cached = await redis.get(`cache:roast:${hash}:${mode}`)
  if (cached) return JSON.parse(cached)
  return null
}

async function cacheRoast(drama: string, mode: string, response: RoastResponse) {
  const hash = createHash(drama)
  await redis.setex(`cache:roast:${hash}:${mode}`, 86400, JSON.stringify(response))
}
```
