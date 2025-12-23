# Code Quality

Ferramenta: **Biome** (substitui ESLint + Prettier)

## Scripts

```bash
bun run lint        # verifica erros
bun run lint:fix    # corrige automaticamente
bun run format      # formata código
```

## Formatação

| Regra | Valor |
|-------|-------|
| Aspas | single |
| Largura | 120 |
| Indentação | 2 espaços |
| Trailing comma | all |
| Semicolons | apenas quando necessário |
| Bracket same line | true |

## Regras de Lint

### Complexidade
- `noExcessiveCognitiveComplexity`: max 15
- `useSimplifiedLogicExpression`: simplifica expressões booleanas

### Correctness
- `noInvalidUseBeforeDeclaration`: proíbe uso antes de declarar
- `useHookAtTopLevel`: hooks no topo do componente
- `useExhaustiveDependencies`: deps completas em useEffect (warn)

### Suspicious
- `noConsole`: warn (permite warn/error)
- `noShadowRestrictedNames`: proíbe shadowing
- `noEmptyBlockStatements`: proíbe blocos vazios
- `noDoubleEquals`: sempre usar ===

### Style
- `useCollapsedElseIf`: else if em vez de else { if }
- `noNegationElse`: evita negação com else
- `noUselessElse`: remove else desnecessário
- `useBlockStatements`: sempre usar { }
- `useConst`: preferir const
- `useExportType`: export type quando possível
- `useImportType`: import type quando possível

### A11y
- `useAltText`: alt obrigatório em imagens
- `useValidAnchor`: links válidos

### Security
- `noDangerouslySetInnerHtml`: proíbe dangerouslySetInnerHTML

### Performance
- `noAccumulatingSpread`: warn em spread acumulativo
- `noDelete`: warn ao usar delete

## Organize Imports

Automático via `assist.organizeImports`. Ordem:
1. Side-effects (`import "./styles.css"`)
2. Dependências externas (`react`, `next`)
3. Aliases internos (`@/lib/...`)
4. Imports relativos (`./`, `../`)

## VS Code

Configuração em `.vscode/settings.json`:
- Formata ao salvar
- Organiza imports ao salvar
- Prettier desabilitado

Extensão recomendada: `biomejs.biome`
