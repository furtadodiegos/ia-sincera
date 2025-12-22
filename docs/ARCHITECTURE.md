# Arquitetura Geral

Frontend:

- Next.js (App Router)
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

Fluxo:
User → Next.js → Worker → LLM → Worker → Supabase → UI
