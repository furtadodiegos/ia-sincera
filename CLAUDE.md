# IA Sincera - Cursor Rules

## Project

A humor app where the user submits a "friend's drama" and receives a light roast plus a questionable piece of advice from the AI. Stack: Next.js (App Router), Cloudflare Workers, Supabase, Redis.

## Goals (Portfolio & Learning)

This project is for **study and portfolio** purposes, aimed at **senior** roles. It should demonstrate:

| Skill           | Implementation                                      |
| --------------- | --------------------------------------------------- |
| Observability   | Sentry (errors, traces, logs, metrics) + OTel       |
| Core Web Vitals | Monitoring via Sentry                               |
| Custom metrics  | Supabase + /status page                             |
| SSG             | Static landing page with isolated Client Components |
| Analytics       | PostHog + Mixpanel (already installed)              |
| LLM Integration | AI API with moderation                              |

### /status page (required)

Display real-time metrics:
- Uptime
- Total roasts generated
- Average LLM response time
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

- Maximum of 280 characters per drama
- 3 response modes: Barbecue Uncle, Quantum Coach, Sincere Friend
- Mandatory moderation (block violence, crime, hate)
- Fallback to neutral humor if moderation fails
- Save all prompts and responses for metrics

## Before Coding

1. Propose a plan before editing
2. Ask if you have less than 95% confidence
3. Read relevant files before proposing changes

## Avoid

- Over-engineering
- Unsolicited features
- Validations for impossible scenarios
- Premature abstractions

  ## Required Workflow

  - ALWAYS use TodoWrite to create a task list
  