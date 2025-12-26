# Depoimentos - Cursor Rules

## Project

Rede social de depoimentos onde seu perfil é construído pelos seus amigos. Stack: Next.js (App Router), Cloudflare Workers, Supabase, Redis.

## Goals (Portfolio & Learning)

Este projeto é para **estudo e portfolio**, focado em vagas **senior**. Deve demonstrar:

| Skill | Implementação |
| ----- | ------------- |
| Observabilidade | Sentry (errors, traces, logs, metrics) + OTel |
| Core Web Vitals | Monitoramento via Sentry |
| Métricas custom | Supabase + página /status |
| SSG | Landing page estática com Client Components isolados |
| Analytics | PostHog + Mixpanel (já instalados) |
| Auth | Supabase Auth (Google) |

### Página /status (obrigatória)

Mostrar métricas em tempo real:
- Uptime
- Total de usuários
- Total de depoimentos
- Tempo médio de resposta
- Core Web Vitals (LCP, CLS, INP)

## Language

Always respond in **Brazilian Portuguese**.

## Principles

| Rule          | Description                        |
| ------------- | ---------------------------------- |
| KISS          | Always the simplest solution       |
| DRY           | Reuse existing abstractions        |
| No Comments   | Self-documenting code              |
| Max 170 lines | Split responsibilities if exceeded |

## Stack & Conventions

```text
Frontend: Next.js 15+ (App Router), TypeScript, Tailwind
Backend: Cloudflare Workers
Database: Supabase (Postgres)
Cache: Redis
Auth: Supabase Auth
```

## React Folder Structure

```text
/feature
  ├─ components/
  │   ├─ List.tsx
  │   └─ ListItem.tsx
  ├─ index.ts          (entrypoint)
  ├─ Feature.tsx       (Container)
  ├─ Feature.hooks.ts  (logic with side-effects)
  ├─ Feature.services.ts (pure/static logic)
  └─ Feature.schema.ts (form validation)
```

## Component Pattern

| Type      | Usage                                   |
| --------- | --------------------------------------- |
| Container | Layout/Template, orchestrates organisms |
| Organism  | Complex components with logic           |
| Molecule  | Combination of atoms                    |
| Atom      | Basic elements (Button, Input)          |

## Hooks vs Services

| File           | When to use                                   |
| -------------- | --------------------------------------------- |
| `.hooks.ts`    | useState, useEffect, mutations, side-effects  |
| `.services.ts` | Pure functions, transformations, calculations |

## Domain Rules

- 1 depoimento por autor por perfil
- Máximo 140 caracteres por depoimento
- Perfis públicos por link
- Moderação obrigatória antes de salvar

## Before Coding

1. Propose a plan before editing
2. Ask if you have less than 95% confidence
3. Read relevant files before proposing changes

## Avoid

- Over-engineering
- Unsolicited features
- Validations for impossible scenarios
- Premature abstractions
