# Redis - IA Sincera

## Por que NAO cachear roasts?

Roasts sao gerados por LLM com temperatura > 0, entao nunca sao iguais. Cachear resposta nao faz sentido.

## Casos de Uso Validos

| Uso | Prioridade | Beneficio |
|-----|------------|-----------|
| Rate Limiting | Alta | Evita abuso e custo de API |
| Contadores /status | Media | Metricas real-time sem query SQL |
| Cache de moderacao | Baixa | Economia pequena em dramas repetidos |

---

## 1. Rate Limiting (Alta Prioridade)

Limitar requisicoes por IP para evitar abuso.

### Chaves

| Chave | Descricao | TTL |
|-------|-----------|-----|
| `rl:ip:{ip}:req` | Requests gerais por minuto | 60s |
| `rl:ip:{ip}:roast` | Roasts por hora | 3600s |
| `rl:ip:{ip}:tokens` | Tokens consumidos hoje | 86400s |

### Limites

| Operacao | Limite | Janela |
|----------|--------|--------|
| Requests por IP | 60 | 1 min |
| Roasts por IP | 10 | 1 hora |
| Tokens por IP | 50.000 | 1 dia |

### Onde implementar

Cloudflare Worker na frente da API. Bloqueia antes de chegar no Next.js.

---

## 2. Contadores para /status (Media Prioridade)

Metricas em tempo real sem precisar de COUNT(*) no Postgres.

### Chaves

| Chave | Tipo | Descricao |
|-------|------|-----------|
| `stats:roasts:total` | String (counter) | Total de roasts |
| `stats:roasts:today` | String (counter) | Roasts hoje (TTL 24h) |
| `stats:roasts:moderated` | String (counter) | Total bloqueados |
| `stats:response_times` | List | Ultimos 100 tempos de resposta |
| `stats:tokens:total` | String (counter) | Total de tokens usados |

### Fluxo

```
API processa roast
    │
    ├──> INCR stats:roasts:total
    ├──> INCR stats:roasts:today
    ├──> LPUSH stats:response_times {tempo}
    ├──> LTRIM stats:response_times 0 99
    └──> INCRBY stats:tokens:total {tokens}
```

### Pagina /status le

```
GET stats:roasts:total      → "1.234"
GET stats:roasts:today      → "56"
LRANGE stats:response_times → [120, 95, 180, ...]
    → calcula media: 131ms
```

---

## 3. Cache de Moderacao (Baixa Prioridade)

Se o mesmo drama for enviado varias vezes, nao precisa chamar a API de moderacao de novo.

### Chave

`mod:{hash_sha256_do_drama}` → `{ blocked: bool, reason?: string }`

### TTL

24 horas (dramas problematicos continuam bloqueados por 1 dia)

### Quando usar

- Drama exato ja foi moderado? Usa cache
- Drama novo? Chama API, salva no cache

### Economia

Pequena. Maioria dos dramas sao unicos. Util apenas se tiver muito abuso repetido.

---

## Arquitetura

```
Usuario
   │
   ▼
Cloudflare Worker ──────────────> Redis (Rate Limit)
   │                                  │
   │ [SE OK]                          │
   ▼                                  │
Next.js API ─────────────────────────>│ (Contadores)
   │                                  │
   ▼                                  │
LLM (OpenAI) <────────────────────────┘ (Cache Moderacao)
```

---

## Recomendacao de Servico

| Opcao | Preco | Latencia | Recomendado |
|-------|-------|----------|-------------|
| Upstash | Free tier generoso | ~50ms | Sim, para comecar |
| Redis Cloud | Free 30MB | ~20ms | Sim |
| Cloudflare KV | Free tier | ~10ms | So para rate limit |

Upstash eh o mais simples pois tem SDK para Edge (Cloudflare Workers).

---

## Implementacao (Atual)

Libs criadas em `lib/redis/`:

| Arquivo | Descricao |
|---------|-----------|
| client.ts | Cliente Upstash configurado |
| rate-limit.ts | Rate limiters (requests e roasts) |
| stats.ts | Contadores para /status |
| index.ts | Exports |

### Env vars necessarias

```
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxx...
```

### Uso

```typescript
import { checkRateLimit, incrementRoastStats, getStats } from '@/lib/redis'

// Na API de roast
const result = await checkRateLimit(ip, 'roasts')
if (!result.success) {
  return Response.json({ error: 'Too many requests' }, { status: 429 })
}

// Apos gerar roast
await incrementRoastStats({
  responseTimeMs: 150,
  tokens: 500,
  wasModerated: false,
})

// Na pagina /status
const stats = await getStats()
// { totalRoasts: 1234, todayRoasts: 56, avgResponseTimeMs: 131, ... }
```
