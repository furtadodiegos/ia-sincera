# Fluxo de Dados - IA Sincera

## Diagrama do Fluxo

```
USUÁRIO                    FRONTEND                 BACKEND                  STORAGE
   │                          │                        │                        │
   │  1. Abre página          │                        │                        │
   │─────────────────────────>│                        │                        │
   │                          │──── Web Vitals ───────────────────────────────> SENTRY
   │                          │──── Pageview ─────────────────────────────────> POSTHOG
   │                          │                        │                        │
   │  2. Escolhe modo         │                        │                        │
   │─────────────────────────>│                        │                        │
   │                          │──── mode_selected ────────────────────────────> POSTHOG
   │                          │                        │                        │
   │  3. Digita drama         │                        │                        │
   │─────────────────────────>│                        │                        │
   │                          │     (nada salvo)       │                        │
   │                          │                        │                        │
   │  4. Clica "Enviar"       │                        │                        │
   │─────────────────────────>│                        │                        │
   │                          │──── roast_requested ──────────────────────────> POSTHOG
   │                          │──── Start span ───────────────────────────────> SENTRY
   │                          │                        │                        │
   │                          │  5. POST /api/roast    │                        │
   │                          │───────────────────────>│                        │
   │                          │                        │──── Modera drama ────> LLM
   │                          │                        │                        │
   │                          │                        │  [SE BLOQUEADO]        │
   │                          │                        │──── was_moderated ───> SUPABASE
   │                          │                        │<─── 200 + fallback ───│
   │                          │                        │                        │
   │                          │                        │  [SE OK]               │
   │                          │                        │──── Gera roast ──────> LLM
   │                          │                        │──── Salva tudo ──────> SUPABASE
   │                          │                        │                        │
   │                          │<── 200 + response ─────│                        │
   │                          │──── End span ─────────────────────────────────> SENTRY
   │                          │──── roast_completed ──────────────────────────> POSTHOG
   │                          │                        │                        │
   │  6. Vê resultado         │                        │                        │
   │<─────────────────────────│                        │                        │
   │                          │──── INP metric ───────────────────────────────> SENTRY
   │                          │                        │                        │
   │  7. Compartilha (opt)    │                        │                        │
   │─────────────────────────>│                        │                        │
   │                          │──── roast_shared ─────────────────────────────> POSTHOG
```

## Onde Cada Métrica é Salva

| Momento | Evento | Destino | Por quê |
|---------|--------|---------|---------|
| Abre página | LCP, FCP, TTFB | Sentry | Performance real |
| Abre página | Pageview | PostHog | Funil de conversão |
| Escolhe modo | mode_selected | PostHog | Qual modo é popular |
| Digita drama | - | Nada | Privacidade |
| Clica enviar | roast_requested | PostHog | Início do funil |
| API processa | Span de latência | Sentry | Debug de lentidão |
| Moderação bloqueia | was_moderated + reason | Supabase | Auditoria/métricas |
| LLM responde | tokens, tempo, resposta | Supabase | Custo/produto |
| Resposta chega | roast_completed | PostHog | Fim do funil |
| Erro na API | roast_error | PostHog | Taxa de falha |
| Interação | INP, CLS | Sentry | UX real |
| Compartilha | roast_shared | PostHog | Viralidade |
| Erro qualquer | Exception + stack | Sentry | Debug |

## Regra de Ouro

| Ferramenta | Pergunta que responde |
|------------|----------------------|
| Supabase | Quantos roasts? Quanto gastei em tokens? Quantos bloqueados? |
| PostHog | Onde os usuários abandonam? Qual modo converte mais? |
| Sentry | Por que está lento? O que deu erro? Qual página é pesada? |

## Dados Salvos no Supabase (tabela roasts)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| drama | text | Input do usuário (max 140 chars) |
| mode | text | tio_churrasco, coach_quantico, amigo_sincero |
| roast_response | text | Resposta principal da LLM |
| advice_response | text | Conselho da LLM |
| closing_response | text | Fechamento da LLM |
| response_time_ms | int | Latência total da API |
| input_tokens | int | Tokens enviados para LLM |
| output_tokens | int | Tokens recebidos da LLM |
| model_version | text | ID do modelo usado |
| was_moderated | bool | Se foi bloqueado |
| moderation_reason | text | Motivo do bloqueio |
| created_at | timestamp | Quando foi criado |
