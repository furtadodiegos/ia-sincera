# PostHog - Analytics

## Configuracao

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_sua_chave
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Eventos Implementados

| Evento | Quando | Propriedades |
|--------|--------|--------------|
| `$pageview` | Auto | url, referrer |
| `$pageleave` | Auto | url, time_on_page |
| `mode_selected` | Clica em modo | mode |
| `roast_requested` | Submete form | mode, drama_length |
| `roast_completed` | Recebe resposta | mode, response_time_ms, was_moderated |
| `roast_error` | Erro na API | error_type |
| `roast_shared` | Compartilha (futuro) | mode |

## Como Usar o Dashboard

### 1. Live Events
- **Activity > Live Events**
- Ver eventos em tempo real
- Util para debug

### 2. Criar Funil
1. **Product Analytics > Funnels > New Insight**
2. Adicionar steps:
   - Step 1: `$pageview`
   - Step 2: `mode_selected`
   - Step 3: `roast_requested`
   - Step 4: `roast_completed`
3. Salvar como "Funil Principal"

### 3. Metricas por Modo
1. **Product Analytics > Trends**
2. Event: `roast_completed`
3. Breakdown by: `mode`

### 4. Taxa de Erro
1. **Trends > New Insight**
2. Formula: `roast_error` / `roast_requested`

### 5. Tempo de Resposta
1. **Trends > New Insight**
2. Event: `roast_completed`
3. Aggregation: Average of `response_time_ms`

## Feature Flags (Futuro)

Para A/B test de prompts:

```typescript
import { posthog } from '@/lib/posthog'

const variant = posthog.getFeatureFlag('prompt-experiment')
// variant = 'control' | 'variant-a' | 'variant-b'
```

## Arquivos

```
lib/posthog/
├── client.ts      # Inicializacao do PostHog
├── events.ts      # Funcoes tipadas para cada evento
├── provider.tsx   # React provider (useEffect init)
└── index.ts       # Exports
```
