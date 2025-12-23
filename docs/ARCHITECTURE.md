# Arquitetura Geral

Frontend:

- Next.js 16+ (App Router)
- React 19
- Tailwind CSS 4
- TypeScript 5
- UI simples, foco em leitura e compartilhamento

Backend:

- Cloudflare Workers
- Responsável por:
  - geração de respostas
  - moderação básica
  - rate limit

Persistência:

- Supabase (Postgres)
- Armazena histórico e likes

Cache / Controle:

- Redis
- Rate limit
- Evitar respostas duplicadas

Tooling:

- Biome (lint + format)
- Bun (package manager)

Fluxo:
User → Next.js → Worker → LLM → Worker → Supabase → UI
