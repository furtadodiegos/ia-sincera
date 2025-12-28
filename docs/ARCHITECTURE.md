# Arquitetura

## Frontend

- Next.js 15+ (App Router)
- React 19
- Tailwind CSS 4
- TypeScript 5

## Backend

- Cloudflare Workers
  - Moderação de conteúdo
  - Rate limit
  - Chamadas à LLM

## Persistência

- Supabase (Postgres)
  - Roasts (prompts + respostas)
  - Métricas

## Cache

- Redis
  - Rate limit por IP
  - Cache de respostas frequentes

## Tooling

- Biome (lint + format)
- Bun (package manager)

## Fluxo Principal

```
Visitante → Next.js → Landing Page
         ↓
    Digita drama do amigo (max 280 chars)
         ↓
    Escolhe modo (Tio, Coach, Amigo)
         ↓
    Next.js → Worker (moderação + LLM) → Supabase
         ↓
    Exibe: Roast + Conselho + Fechamento
```

## Páginas

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | SSG + Client | Landing page com input |
| `/status` | SSR | Métricas em tempo real |
