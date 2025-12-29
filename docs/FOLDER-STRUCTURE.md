# Estrutura de Pastas - IA Sincera

## Principio: Colocation

Arquivos relacionados ficam juntos. Componentes exclusivos de uma page ficam na pasta da page.

## Estrutura

```
app/
├── (main)/                     # Route Group - Landing
│   ├── page.tsx                # Server Component (URL: /)
│   ├── page.hooks.ts           # Hooks da landing
│   └── components/             # Componentes EXCLUSIVOS da landing
│       ├── RoastForm.tsx
│       ├── RoastResult.tsx
│       └── ModeSelector.tsx
│
├── status/
│   ├── page.tsx                # Server Component (URL: /status)
│   ├── page.hooks.ts           # useStatusPolling
│   ├── status.types.ts         # Types e utils de Web Vitals
│   └── components/
│       ├── VitalCard.tsx
│       ├── StatCard.tsx
│       └── StatusDashboard.tsx
│
├── login/
│   ├── page.tsx
│   └── login.actions.ts
│
├── [username]/                 # Perfis publicos (futuro)
│   └── page.tsx
│
└── api/
    ├── roast/
    │   └── route.ts
    ├── status/
    │   └── route.ts
    └── vitals/
        └── route.ts

components/                     # APENAS componentes compartilhados
├── Button.tsx                  # Usados em 2+ pages
├── Card.tsx
├── Input.tsx
└── ...

lib/                           # Logica de negocio e integrações
├── types.ts                   # Tipos centralizados
├── supabase/
├── redis/
├── gemini/
├── posthog/
└── web-vitals/
```

## Regras

### 1. Onde colocar componentes

| Situacao | Local |
|----------|-------|
| Usado em 1 page | `app/[page]/components/` |
| Usado em 2+ pages | `components/` |

### 2. Criterio de promocao

Quando um componente de `app/[page]/components/` passar a ser usado em outra page, mova para `components/`.

### 3. Nomenclatura de arquivos

| Tipo | Padrao | Exemplo |
|------|--------|---------|
| Page | `page.tsx` | `app/status/page.tsx` |
| Hook da page | `page.hooks.ts` | `app/status/page.hooks.ts` |
| Server Action | `[feature].actions.ts` | `login.actions.ts` |
| Componente | `PascalCase.tsx` | `RoastForm.tsx` |

### 4. Server vs Client Components

| Tipo | Uso |
|------|-----|
| Server Component | Page principal, layout, dados estaticos |
| Client Component | Interatividade, useState, eventos |

**Regra:** Page e Server Component por padrao. Componentes interativos sao importados como "ilhas".

```tsx
// app/page.tsx (Server Component)
import { RoastForm } from './components/RoastForm'

export default function Home() {
  return (
    <main>
      <h1>IA Sincera</h1>           {/* Server - estatico */}
      <RoastForm />                  {/* Client - interativo */}
      <footer>...</footer>           {/* Server - estatico */}
    </main>
  )
}
```

### 5. Hooks

| Arquivo | Conteudo |
|---------|----------|
| `page.hooks.ts` | Hooks especificos da page (useRoastForm) |
| `[Component].hooks.ts` | Hooks especificos de um componente |

Hooks compartilhados vao em `lib/hooks/`.
