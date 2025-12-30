# Performance Audit Guide

Guia completo para coleta de métricas de performance em web apps.
Ferramentas: Lighthouse, Vercel Analytics, Sentry, React DevTools.

---

## Visão Geral do Fluxo

```
1. LIGHTHOUSE        →  Diagnóstico inicial (lab)
       ↓
2. VERCEL ANALYTICS  →  Dados reais de usuários (field)
       ↓
3. SENTRY            →  Erros + traces em produção
       ↓
4. REACT DEVTOOLS    →  Profiling de componentes
       ↓
5. OTIMIZAR          →  Aplicar fixes baseado em dados
       ↓
6. MEDIR NOVAMENTE   →  Validar melhorias
```

---

## Conceito: Lab vs Field

| Tipo | O que é | Ferramentas | Quando usar |
|------|---------|-------------|-------------|
| **Lab** | Teste controlado (sua máquina) | Lighthouse, DevTools | Desenvolvimento, debugging |
| **Field** | Dados reais de usuários | Vercel, Sentry, CrUX | Produção, decisões de negócio |

**Sempre cruze dados de Lab com Field** - Lab não captura variações de dispositivos e conexões reais.

---

## Passo 1: Lighthouse (Diagnóstico Inicial)

### Quando usar
- Início de projeto/auditoria
- Antes de deploy
- Após mudanças significativas

### Como executar
```
Chrome → F12 → Lighthouse → Analyze page load
```

### Métricas para coletar

| Métrica | O que mede | Meta |
|---------|-----------|------|
| **LCP** | Largest Contentful Paint | <2.5s |
| **FID/INP** | Interatividade | <200ms |
| **CLS** | Cumulative Layout Shift | <0.1 |
| **FCP** | First Contentful Paint | <1.8s |
| **TTFB** | Time to First Byte | <800ms |
| **TBT** | Total Blocking Time | <200ms |

### O que anotar
1. Score geral (0-100)
2. Core Web Vitals (LCP, INP, CLS)
3. Oportunidades listadas (com estimativa de ganho)
4. Diagnósticos (problemas específicos)

### Output esperado
```
"Lighthouse identificou LCP de 3.2s.
Principal causa: imagem hero sem lazy loading.
Oportunidade: -1.2s com otimização de imagens."
```

---

## Passo 2: Vercel Analytics (Dados Reais)

### Quando usar
- App já em produção
- Validar se Lab reflete realidade
- Monitoramento contínuo

### Como acessar
```
Vercel Dashboard → Projeto → Analytics → Web Vitals
```

### Métricas para coletar

| Métrica | Segmentar por |
|---------|---------------|
| **LCP** | Rota, dispositivo, país |
| **INP** | Rota, dispositivo |
| **CLS** | Rota, dispositivo |
| **FCP** | Rota, país |

### O que anotar
1. P75 de cada métrica (percentil 75)
2. Rotas problemáticas
3. Diferença mobile vs desktop
4. Tendência (melhorando ou piorando?)

### Output esperado
```
"Vercel mostra LCP P75 de 2.8s em mobile.
Rota /dashboard é a mais lenta (3.5s).
Desktop está ok (1.9s).
Foco: otimizar experiência mobile."
```

---

## Passo 3: Sentry (Erros + Traces)

### Quando usar
- Investigar problemas específicos
- Correlacionar erros com performance
- Entender impacto real em usuários

### Como acessar
```
Sentry Dashboard → Performance → Web Vitals
Sentry Dashboard → Performance → Traces
```

### Métricas para coletar

| Área | O que buscar |
|------|-------------|
| **Web Vitals** | Distribuição por página |
| **Transactions** | Tempo de cada operação |
| **Spans** | Breakdown de onde gasta tempo |
| **Errors** | Erros correlacionados com lentidão |

### O que anotar
1. Transações mais lentas
2. Spans que consomem mais tempo
3. Erros que impactam performance
4. Sessões afetadas (% de usuários)

### Output esperado
```
"Sentry mostra que /api/roast tem P95 de 4.2s.
Span 'llm.generate' consome 89% do tempo.
12% das sessões tiveram erro de timeout.
Ação: implementar streaming ou aumentar timeout."
```

---

## Passo 4: React DevTools (Profiling)

### Quando usar
- UI travando/lenta
- Investigar re-renders
- Após identificar rota lenta no Vercel/Sentry

### Como executar
```
Chrome → F12 → Profiler → Record → Interagir → Stop
```

### Métricas para coletar

| Métrica | Onde ver | Problema se |
|---------|----------|-------------|
| **Render time** | Commit info | >16ms |
| **Re-renders** | Flamegraph | Cinza vira colorido sem motivo |
| **Causa** | "What caused" | Componente inesperado |

### O que anotar
1. Componentes com render >16ms
2. Componentes que re-renderizam demais
3. Causa raiz dos re-renders
4. Commits totais vs esperados

### Output esperado
```
"React Profiler mostra que <DataTable> renderiza em 45ms.
Causa: recalcula filtro a cada render.
32 re-renders ao digitar (esperado: 1).
Ação: useMemo no filtro, memo no componente."
```

---

## Passo 5: Matriz de Decisão

Cruzar dados das 4 ferramentas:

| Problema | Lighthouse | Vercel | Sentry | React DevTools | Ação |
|----------|------------|--------|--------|----------------|------|
| LCP alto | ✓ | ✓ | - | - | Otimizar imagens, fonts |
| INP alto | ✓ | ✓ | - | ✓ | Reduzir JS, memo |
| CLS alto | ✓ | ✓ | - | - | Dimensões explícitas |
| API lenta | - | - | ✓ | - | Cache, otimizar query |
| Re-renders | - | - | - | ✓ | memo, useCallback |
| Erros JS | - | - | ✓ | - | Fix bugs |

---

## Passo 6: Relatório de Auditoria

### Template

```markdown
# Performance Audit Report
**App:** [nome]
**Data:** [data]
**Auditor:** [nome]

## Executive Summary
- Score Lighthouse: X/100
- Core Web Vitals: X/3 passando
- Usuários impactados: X%

## Métricas Coletadas

### Lab (Lighthouse)
| Métrica | Valor | Meta | Status |
|---------|-------|------|--------|
| LCP | Xs | <2.5s | ✅/❌ |
| INP | Xms | <200ms | ✅/❌ |
| CLS | X | <0.1 | ✅/❌ |

### Field (Vercel/Sentry)
| Métrica | P75 | Pior rota |
|---------|-----|-----------|
| LCP | Xs | /rota |
| INP | Xms | /rota |

### Profiling (React DevTools)
| Componente | Render time | Re-renders |
|------------|-------------|------------|
| X | Xms | X |

## Problemas Identificados
1. [Problema] - Impacto: [alto/médio/baixo]
2. ...

## Recomendações
1. [Ação] - Ganho estimado: [X]
2. ...

## Próximos Passos
1. ...
```

---

## Técnicas de Otimização

### Reduzir Re-renders

**React.memo()** - Evita re-render se props não mudaram
```tsx
const ModeSelector = memo(({ mode, onSelect }) => { ... })
```

**useCallback()** - Estabiliza funções
```tsx
const handleSelect = useCallback((mode) => setMode(mode), [])
```

**useMemo()** - Cacheia cálculos pesados
```tsx
const filtered = useMemo(() => items.filter(x => x.active), [items])
```

### Regra de Ouro
```
Medir primeiro → Otimizar depois

Memoization tem custo (memória + comparação).
Só vale se o render for realmente lento (>16ms).
```


## Referências

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [React Profiler](https://react.dev/reference/react/Profiler)
- [Sentry Performance](https://docs.sentry.io/product/performance/)
