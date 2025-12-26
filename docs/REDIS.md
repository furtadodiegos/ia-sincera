# Redis

## Casos de Uso

### Rate Limit

Limitar requisições por IP e por usuário.

Chaves:
- `rl:ip:{ip}` — contador por IP
- `rl:user:{user_id}` — contador por usuário

TTL: 1 hora

### Cache de Perfis

Cachear perfis populares para reduzir queries.

Chave: `profile:{username}`

TTL: 5 minutos

Invalidar: quando receber novo depoimento ou atualizar about.

### Sessões (opcional)

Se precisar de sessões fora do Supabase Auth.

Chave: `session:{token}`

TTL: 7 dias

## Limites

| Operação | Limite |
|----------|--------|
| Requisições por IP | 100/min |
| Depoimentos por usuário | 10/hora |
| Perfis cacheados | 1000 |

## Implementação

```typescript
// Rate limit check
async function checkRateLimit(key: string, limit: number, windowSec: number) {
  const current = await redis.incr(key)
  if (current === 1) {
    await redis.expire(key, windowSec)
  }
  return current <= limit
}

// Cache profile
async function getCachedProfile(username: string) {
  const cached = await redis.get(`profile:${username}`)
  if (cached) return JSON.parse(cached)
  return null
}

async function cacheProfile(username: string, data: Profile) {
  await redis.setex(`profile:${username}`, 300, JSON.stringify(data))
}
```
