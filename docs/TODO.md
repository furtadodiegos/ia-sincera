# TODO - IA Sincera

## Redis (Rate Limiting)

- [x] Instalar @upstash/redis e @upstash/ratelimit
- [x] Criar lib/redis com client, rate-limit, stats
- [x] Criar conta no Upstash e adicionar env vars
- [x] Integrar rate limit na API /api/roast
- [x] Integrar contadores na API
- [x] Testar rate limiting (10 req/hora funcionando)
- [ ] Testar em producao

## Sentry (Observabilidade)

- [ ] Configurar error boundaries com contexto do roast
- [ ] Adicionar spans customizados para chamadas LLM
- [ ] Monitorar rate limits da API
- [ ] Alertas para latencia > 3s
- [ ] Dashboard de erros por modo

## PostHog (Analytics)

- [ ] Evento: roast_requested (mode, drama_length)
- [ ] Evento: roast_completed (response_time, was_moderated)
- [ ] Evento: roast_shared quando usuario compartilha
- [ ] Funil: Landing -> Escolher modo -> Submeter drama -> Ver resultado
- [ ] Feature flag para novos modos
- [ ] A/B test de prompts diferentes

## Web Vitals (Performance)

- [ ] Integrar web-vitals lib com Sentry
- [ ] Monitorar LCP da landing page (target < 2.5s)
- [ ] Monitorar CLS durante carregamento (target < 0.1)
- [ ] Monitorar INP nas interacoes (target < 200ms)
- [ ] Dashboard no Sentry com metricas agregadas

## Banco de Dados

- [x] Adicionar input_tokens, output_tokens
- [x] Adicionar model_version
- [x] Adicionar was_moderated, moderation_reason
- [x] Criar roast.service.ts com tipagem
- [ ] Criar view materializada para metricas da /status
- [ ] Implementar soft delete (deleted_at) se necessario para LGPD

## API

- [x] Criar /api/roast com rate limiting
- [x] Criar /api/status com metricas do Redis
- [x] Integrar moderacao antes de gerar roast (Gemini)
- [x] Integrar chamada LLM (Gemini 1.5 Flash)
- [ ] Adicionar spans do Sentry nas chamadas LLM
