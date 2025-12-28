# Arquitetura

## Stack

| Camada | Tecnologia | Uso |
|--------|------------|-----|
| Frontend | Next.js 15+, React 19, Tailwind 4 | UI e SSG |
| Backend | Next.js API Routes | Endpoints |
| Rate Limit | Upstash Redis | Limitar requests por IP |
| Database | Supabase (Postgres) | Roasts, users, metricas |
| LLM | Gemini 1.5 Flash | Geracao de roasts + moderacao |
| Observability | Sentry | Erros, performance, Web Vitals |
| Analytics | PostHog | Funis, eventos, comportamento |

## Persistencia

### Supabase (Postgres)

- `roasts` - Dramas, respostas, tokens, moderacao
- `users` - Perfis de usuario
- `testimonials` - Depoimentos entre usuarios

### Upstash (Redis)

- Rate limiting por IP
- Contadores para /status
- Cache de moderacao (futuro)

## Observabilidade

| Ferramenta | O que vai la |
|------------|--------------|
| Supabase | Dados de produto (roasts, tokens, custos) |
| Sentry | Erros, spans, Web Vitals |
| PostHog | Eventos de usuario, funis, A/B tests |

## Fluxo Principal

```
Usuario
   │
   ▼
Next.js (Landing)
   │
   ├──> Web Vitals ──────> Sentry
   ├──> Pageview ────────> PostHog
   │
   ▼
POST /api/roast
   │
   ├──> Rate Limit ──────> Upstash Redis
   │       │
   │       └── [BLOQUEADO] → 429 Too Many Requests
   │
   ├──> Moderacao ───────> OpenAI
   │       │
   │       └── [BLOQUEADO] → Salva no Supabase (was_moderated=true)
   │
   ├──> Gera Roast ──────> OpenAI
   │
   ├──> Salva ───────────> Supabase (roasts)
   │
   ├──> Incrementa ──────> Upstash Redis (stats)
   │
   └──> Retorna resposta
```

## Paginas

| Rota | Tipo | Descricao |
|------|------|-----------|
| `/` | SSG + Client | Landing page com formulario |
| `/status` | SSR | Metricas em tempo real (Redis + Sentry) |
| `/login` | Client | Autenticacao via Google |
| `/:username` | SSR | Perfil publico do usuario |

## Libs Internas

```
lib/
├── supabase/
│   ├── client.ts      # Browser client
│   ├── server.ts      # Server client
│   ├── database.types.ts  # Types gerados
│   └── roast.service.ts   # CRUD de roasts
│
├── redis/
│   ├── client.ts      # Upstash client
│   ├── rate-limit.ts  # Rate limiters
│   └── stats.ts       # Contadores para /status
│
└── gemini/
    ├── client.ts      # Gemini client
    ├── prompts.ts     # Prompts por modo
    └── roast.ts       # Geracao e moderacao
```
