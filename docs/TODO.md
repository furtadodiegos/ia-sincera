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

- [x] Configurar server/client configs com tracing
- [x] Adicionar spans customizados para chamadas LLM (moderation + roast)
- [x] Captura de erros com contexto (tags, extra)
- [ ] Alertas para latencia > 3s (configurar no dashboard)
- [ ] Dashboard de erros por modo (configurar no dashboard)

## PostHog (Analytics)

- [x] Instalar posthog-js e criar provider
- [x] Evento: mode_selected (mode)
- [x] Evento: roast_requested (mode, drama_length)
- [x] Evento: roast_completed (response_time_ms, was_moderated)
- [x] Evento: roast_error (error_type)
- [ ] Evento: roast_shared quando usuario compartilha
- [x] Configurar funil no dashboard PostHog
- [ ] Feature flag para novos modos (futuro)
- [ ] A/B test de prompts diferentes (futuro)

## Web Vitals (Performance)

- [x] Integrar browserTracingIntegration com Sentry (auto-capture)
- [x] Integrar browserProfilingIntegration para INP
- [x] Integrar replayIntegration para session replays
- [x] Instalar web-vitals lib para captura no client
- [x] Criar API /api/vitals para salvar metricas no Redis
- [x] Exibir Web Vitals na pagina /status (LCP, CLS, INP, FCP, TTFB)
- [ ] Verificar metricas no dashboard Sentry (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- [ ] Ajustar sample rates em producao se necessario

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
- [x] Integrar chamada LLM (Gemini 2.5 Flash)
- [x] Adicionar spans do Sentry nas chamadas LLM

## Arquitetura (Refatoracao)

- [x] Documentar estrutura de pastas (docs/FOLDER-STRUCTURE.md)
- [x] Centralizar tipos em lib/types.ts
- [x] Landing: Separar em Server + Client Components
- [x] Landing: Criar app/components/ com ModeSelector, RoastResult, RoastForm
- [x] Landing: Criar page.hooks.ts com useRoastForm
- [x] Landing: Converter page.tsx para Server Component (SSG)
- [x] Status: Aplicar mesmo padrao (Server Component + Client polling)
- [x] Corrigir metadata do layout.tsx (SEO, Open Graph, Twitter)
- [x] Refatorar /api/roast para < 170 linhas
- [x] Criar proxy.ts para Supabase Auth (Next.js 16)

## Autenticacao

- [x] Adicionar role (admin, user) na tabela users
- [x] Adicionar anonymous_id e user_id na tabela roasts
- [x] Criar lib/auth para gerar anonymous_id unico por IP
- [x] Limite de 3 roasts para usuarios anonimos
- [x] Migrar roasts anonimos para user_id apos login
- [x] Pagina de login com Google OAuth
- [x] Modal de login quando limite atingido
- [x] Configurar Google OAuth no Supabase Dashboard
- [ ] Adicionar env vars de producao (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

## OG Image Dinamica

- [x] Criar rota /og-image.png com ImageResponse (Edge Runtime)
- [ ] Aceitar query param ?roast=ID para gerar imagem personalizada por roast
- [ ] Incluir trecho do roast e modo na imagem gerada
- [ ] Criar pagina de compartilhamento /r/[id] com OG Image dinamica
- [ ] Botao de compartilhar no RoastResult que copia link /r/[id]

## API para Aplicacoes Externas

- [ ] Suportar autenticacao via JWT no header Authorization (Bearer token)
- [ ] Modificar /api/roast para aceitar token via header alem de cookie
- [ ] Validar token com supabase.auth.getUser(token)
- [ ] Documentar endpoint para consumo externo
- [ ] Criar SDK/cliente TypeScript para facilitar integracao (opcional)
- [ ] Considerar API Keys para integracao backend-to-backend (futuro)
