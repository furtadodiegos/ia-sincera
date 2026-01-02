<div align="center">

# Ironizi.app

**The most brutally honest AI you'll ever meet.**

A humor app where you submit your drama and get a light roast with questionable advice in return.

[![Live Demo](https://img.shields.io/badge/demo-ironizi.app-indigo?style=for-the-badge)](https://ironizi.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## Why does this project exist?

This is a **portfolio project** built to showcase **senior developer** skills in a production-like scenario. It's not just another CRUD — it's a complete application with:

- **Multi-provider LLM** (GPT-4o-mini + Gemini) with per-user load balancing
- **Full-stack observability** (Sentry, PostHog, custom metrics)
- **Performance optimized** (Core Web Vitals monitoring)
- **Scalable architecture** (rate limiting, caching, fallbacks)

---

## Tech Stack

| Layer      | Technology                        | Reason                           |
|------------|-----------------------------------|----------------------------------|
| **Frontend** | Next.js 15, React 19, Tailwind 4      | App Router, Server Components, streaming |
| **Backend**  | Next.js API Routes                    | Serverless, edge-ready           |
| **Database** | Supabase (Postgres)                   | RLS, real-time, integrated auth  |
| **Cache**    | Upstash Redis                         | Rate limiting, counters, session |
| **LLM**      | OpenAI + Gemini                       | Multi-provider with auto fallback|
| **Observability** | Sentry                           | Errors, traces, Web Vitals, releases |
| **Analytics**     | PostHog                         | Events, funnels, feature flags   |
| **Deploy**        | Vercel                          | Edge functions, preview deploys  |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                            Client (Browser)                    │
├─────────────────────────────────────────────────────────────────┤
│  Next.js App Router │ React 19 │ Tailwind 4 │ Web Vitals        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Routes (Serverless)                    │
├─────────────────────────────────────────────────────────────────┤
│  Rate Limit (Redis) → Moderation (LLM) → Generation (LLM)       │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│  │   Upstash    │    │   OpenAI     │    │   Gemini     │        │
│  │   Redis      │    │  gpt-4o-mini │    │  2.5-flash   │        │
│  └──────────────┘    └──────────────┘    └──────────────┘        │
│         │                    │                   │                │
│         │              ┌─────┴─────┐             │                │
│         │              │  LLM Load │◄────────────┘                │
│         │              │  Balancer │  Ratio 2:1 (GPT:Gemini)      │
│         │              └───────────┘                              │
└─────────┼────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Supabase (Postgres)                      │
├─────────────────────────────────────────────────────────────────┤
│  roasts │ users │ testimonials │ RLS policies │ migrations      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Features

### Multi-Provider LLM with Load Balancing

```typescript
// lib/llm/selector.ts
// 2:1 ratio per user, persisted in Redis for 24h
const provider = counter % 3 === 2 ? 'gemini' : 'openai'
```

- **Automatic fallback**: if a provider fails, a default response is returned
- **Per-user tracking**: each user has their own counter
- **Separate metrics**: PostHog tracks provider performance individually

### Complete Observability

| Tool      | What it tracks                                                              |
|-----------|-----------------------------------------------------------------------------|
| **Sentry**  | Errors, traces, LLM spans, Web Vitals, releases                           |
| **PostHog** | Events (roast_requested, roast_completed, roast_shared)                   |
| **Redis**   | Real-time counters for /status                                            |
| **Supabase**| Tokens consumed, response times, moderation rate                          |

### Smart Rate Limiting

```typescript
// Sliding window per IP
roasts: 10 requests/hour
requests: 60 requests/minute
```

### Content Moderation

- Every input goes through moderation before generation
- Inappropriate content gets a generic response (never an error)
- Moderation logs are saved for later analysis

### Core Web Vitals

Metrics are collected and sent to Sentry plus a custom endpoint:
- **LCP** < 2.5s
- **CLS** < 0.1
- **INP** < 200ms

---

## Folder Structure

```
├── app/
│   ├── (main)/              # Main route group
│   │   ├── components/      # Feature components
│   │   ├── page.tsx         # Landing page (SSG)
│   │   └── page.hooks.ts    # Client-side logic
│   ├── api/
│   │   ├── roast/           # Main endpoint
│   │   ├── status/          # Real-time metrics
│   │   └── vitals/          # Core Web Vitals
│   └── status/              # Public dashboard
│
├── lib/
│   ├── llm/                 # Multi-provider abstraction
│   ├── openai/              # OpenAI provider
│   ├── gemini/              # Gemini provider
│   ├── supabase/            # Database client + services
│   ├── redis/               # Rate limiting + stats
│   ├── posthog/             # Typed analytics
│   └── web-vitals/          # Metrics collection
│
└── docs/                    # Technical documentation
```

---

## Running Locally

```bash
# Clone
git clone https://github.com/seu-usuario/ia-sincera.git
cd ia-sincera

# Install dependencies
bun install

# Configure environment variables
cp .env.example .env.local

# Start the project
bun dev
```

### Environment Variables

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

## Technical Decisions

| Decision              | Alternative           | Why I chose it                                     |
|-----------------------|----------------------|----------------------------------------------------|
| Next.js App Router    | Pages Router         | Server Components, streaming, better DX            |
| Supabase              | PlanetScale, Neon    | Integrated auth, RLS, real-time capabilities       |
| Upstash Redis         | Redis Cloud          | Serverless, HTTP API, pricing                      |
| Dual LLM              | Only OpenAI          | Redundancy, cost comparison                        |
| Sentry                | Datadog, New Relic   | Best Next.js integration, Web Vitals support       |
| PostHog               | Mixpanel, Amplitude  | Open source, self-host option                      |

---

## Production Metrics

The `/status` page shows in real time:

- Total roasts generated
- Average response time (P75)
- Moderation rate
- Core Web Vitals (LCP, CLS, INP)
- Distribution by mode

---

## Next Steps

- [ ] A/B testing prompts via PostHog
- [ ] Moderation cache in Redis
- [ ] Public profiles with history
- [ ] Public API with per-API key rate limiting

---

## Author

Developed as a portfolio project to demonstrate modern web app architecture.

---

<div align="center">

**[See Demo](https://ironizi.app)** · **[Documentation](./docs/)**

</div>
