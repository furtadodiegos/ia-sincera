# IA Sincera - Cursor Rules

## Project

Humor app that does light roasts + questionable advice. Stack: Next.js (App Router), Cloudflare Workers, Supabase, Redis.

## Goals (Portfolio & Learning)

Este projeto é para **estudo e portfolio**, focado em vagas **senior**. Deve demonstrar:

| Skill | Implementação |
| ----- | ------------- |
| Observabilidade | Sentry (errors, traces, logs, metrics) + OTel |
| Core Web Vitals | Monitoramento via Sentry |
| Métricas custom | Supabase + página /status |
| SSG | Landing page estática com Client Components isolados |
| Analytics | PostHog + Mixpanel (já instalados) |

### Página /status (obrigatória)

Mostrar métricas em tempo real:
- Uptime
- Total de roasts gerados
- Tempo médio de resposta
- Taxa de erros
- Core Web Vitals (LCP, FID, CLS)

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
Frontend: Next.js 14+ (App Router), TypeScript, Tailwind
Backend: Cloudflare Workers
Database: Supabase (Postgres)
Cache: Redis
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

## Convex (if applicable)

- Minimal and focused APIs
- Return only necessary data
- Validate all inputs
- Never destructive commands without confirmation

## Before Coding

1. Propose a plan before editing
2. Ask if you have less than 95% confidence
3. Read relevant files before proposing changes

## Avoid

- Over-engineering
- Unsolicited features
- Validations for impossible scenarios
- Premature abstractions
