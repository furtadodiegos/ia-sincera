<div align="center">

# Ironizi.app

**A IA mais sincera que você vai encontrar.**

Uma aplicação de humor onde você conta o drama e recebe um roast leve com conselhos questionáveis.

[![Live Demo](https://img.shields.io/badge/demo-ironizi.app-indigo?style=for-the-badge)](https://ironizi.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## Por que este projeto existe?

Este é um **projeto de portfolio** desenvolvido para demonstrar skills de **desenvolvedor senior** em um cenário real de produção. Não é apenas um CRUD — é uma aplicação completa com:

- **Multi-provider LLM** (GPT-4o-mini + Gemini) com load balancing por usuário
- **Observabilidade full-stack** (Sentry, PostHog, métricas custom)
- **Performance otimizada** (Core Web Vitals monitorados)
- **Arquitetura escalável** (rate limiting, caching, fallbacks)

---

## Stack Técnica

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | Next.js 15, React 19, Tailwind 4 | App Router, Server Components, streaming |
| **Backend** | Next.js API Routes | Serverless, edge-ready |
| **Database** | Supabase (Postgres) | RLS, real-time, auth integrado |
| **Cache** | Upstash Redis | Rate limiting, contadores, sessão |
| **LLM** | OpenAI + Gemini | Multi-provider com fallback automático |
| **Observability** | Sentry | Errors, traces, Web Vitals, releases |
| **Analytics** | PostHog | Eventos, funnels, feature flags |
| **Deploy** | Vercel | Edge functions, preview deploys |

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         Cliente (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router │ React 19 │ Tailwind 4 │ Web Vitals        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes (Serverless)                     │
├─────────────────────────────────────────────────────────────────┤
│  Rate Limit (Redis) → Moderation (LLM) → Generation (LLM)       │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Upstash    │    │   OpenAI     │    │   Gemini     │       │
│  │   Redis      │    │  gpt-4o-mini │    │  2.5-flash   │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│         │                    │                   │               │
│         │              ┌─────┴─────┐             │               │
│         │              │  LLM Load │◄────────────┘               │
│         │              │  Balancer │  Ratio 2:1 (GPT:Gemini)     │
│         │              └───────────┘                             │
└─────────┼───────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase (Postgres)                       │
├─────────────────────────────────────────────────────────────────┤
│  roasts │ users │ testimonials │ RLS policies │ migrations      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features Técnicas

### Multi-Provider LLM com Load Balancing

```typescript
// lib/llm/selector.ts
// Ratio 2:1 por usuário, persistido no Redis por 24h
const provider = counter % 3 === 2 ? 'gemini' : 'openai'
```

- **Fallback automático**: se um provider falha, usa resposta pré-definida
- **Tracking por usuário**: cada user tem seu próprio contador
- **Métricas separadas**: PostHog rastreia performance por provider

### Observabilidade Completa

| Ferramenta | O que monitora |
|------------|----------------|
| **Sentry** | Errors, traces, LLM spans, Web Vitals, releases |
| **PostHog** | Eventos (roast_requested, roast_completed, roast_shared) |
| **Redis** | Contadores em tempo real para /status |
| **Supabase** | Tokens consumidos, response times, moderation rate |

### Rate Limiting Inteligente

```typescript
// Sliding window por IP
roasts: 10 requests/hora
requests: 60 requests/minuto
```

### Moderação de Conteúdo

- Cada input passa por moderação antes da geração
- Conteúdo inapropriado retorna resposta genérica (nunca erro)
- Logs de moderação para análise posterior

### Core Web Vitals

Métricas coletadas e enviadas para Sentry + endpoint próprio:
- **LCP** < 2.5s
- **CLS** < 0.1
- **INP** < 200ms

---

## Estrutura de Pastas

```
├── app/
│   ├── (main)/              # Grupo de rotas principais
│   │   ├── components/      # Componentes da feature
│   │   ├── page.tsx         # Landing page (SSG)
│   │   └── page.hooks.ts    # Lógica client-side
│   ├── api/
│   │   ├── roast/           # Endpoint principal
│   │   ├── status/          # Métricas em tempo real
│   │   └── vitals/          # Core Web Vitals
│   └── status/              # Dashboard público
│
├── lib/
│   ├── llm/                 # Abstração multi-provider
│   ├── openai/              # Provider OpenAI
│   ├── gemini/              # Provider Gemini
│   ├── supabase/            # Database client + services
│   ├── redis/               # Rate limit + stats
│   ├── posthog/             # Analytics tipado
│   └── web-vitals/          # Coleta de métricas
│
└── docs/                    # Documentação técnica
```

---

## Rodando Localmente

```bash
# Clone
git clone https://github.com/seu-usuario/ia-sincera.git
cd ia-sincera

# Instale dependências
bun install

# Configure variáveis de ambiente
cp .env.example .env.local

# Rode o projeto
bun dev
```

### Variáveis de Ambiente

```env
# LLM Providers
GEMINI_API_KEY=
OPENAI_API_KEY=

# Database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Cache
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Observability
SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

---

## Decisões Técnicas

| Decisão | Alternativa | Por que escolhi |
|---------|-------------|-----------------|
| Next.js App Router | Pages Router | Server Components, streaming, melhor DX |
| Supabase | PlanetScale, Neon | Auth integrado, RLS, real-time |
| Upstash Redis | Redis Cloud | Serverless, HTTP API, preço |
| Dual LLM | Só OpenAI | Redundância, comparação de custos |
| Sentry | Datadog, New Relic | Melhor integração Next.js, Web Vitals |
| PostHog | Mixpanel, Amplitude | Open source, self-host option |

---

## Métricas de Produção

A página `/status` mostra em tempo real:

- Total de roasts gerados
- Response time médio (P75)
- Taxa de moderação
- Core Web Vitals (LCP, CLS, INP)
- Distribuição por modo

---

## Próximos Passos

- [ ] A/B testing de prompts via PostHog
- [ ] Cache de moderação no Redis
- [ ] Perfis públicos com histórico
- [ ] API pública com rate limiting por API key

---

## Autor

Desenvolvido como projeto de portfolio para demonstrar arquitetura moderna de aplicações web.

---

<div align="center">

**[Ver Demo](https://ironizi.app)** · **[Documentação](./docs/)**

</div>
