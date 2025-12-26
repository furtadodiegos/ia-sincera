# Arquitetura

## Frontend

- Next.js 15+ (App Router)
- React 19
- Tailwind CSS 4
- TypeScript 5

## Backend

- Cloudflare Workers
  - Moderação de depoimentos
  - Rate limit
  - Validações

## Persistência

- Supabase (Postgres)
  - Usuários
  - Depoimentos
  - Auth

## Cache

- Redis
  - Rate limit
  - Cache de perfis populares

## Tooling

- Biome (lint + format)
- Bun (package manager)

## Fluxo Principal

```
Visitante → Next.js → Supabase Auth
         ↓
    Escreve depoimento
         ↓
    Next.js → Worker (moderação) → Supabase
         ↓
    Perfil atualizado
```

## Páginas

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | SSG | Landing page |
| `/login` | Client | Auth com Supabase |
| `/[username]` | SSR/ISR | Perfil público |
