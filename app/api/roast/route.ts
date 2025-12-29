import * as Sentry from '@sentry/nextjs'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateRoast, MODEL_VERSION, moderateDrama } from '@/lib/gemini'
import { checkRateLimit, getRateLimitHeaders, incrementRoastStats } from '@/lib/redis'
import { createModeratedRoast, createRoast, createServerClient } from '@/lib/supabase'
import { getAuthContext } from './roast.auth'
import { FALLBACK_RESPONSES } from './roast.fallbacks'
import { getClientIp, validateRequest } from './roast.validation'

export async function POST(request: Request) {
  const startTime = performance.now()
  const headersList = await headers()
  const ip = getClientIp(headersList)

  const rateLimit = await checkRateLimit(ip, 'roasts')
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Muitas requisicoes. Tente novamente em alguns minutos.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 })
  }

  const validation = validateRequest(body)
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { drama, mode } = validation.data
  const supabase = await createServerClient()
  const auth = await getAuthContext(supabase, ip)

  if (auth.requiresLogin) {
    return NextResponse.json(
      { error: 'Limite gratuito atingido. Crie uma conta para continuar.', require_login: true },
      { status: 403 },
    )
  }

  try {
    const moderation = await Sentry.startSpan(
      {
        name: 'llm.moderation',
        op: 'ai.run',
        attributes: { 'ai.model_id': MODEL_VERSION, 'ai.input_length': drama.length },
      },
      () => moderateDrama(drama),
    )

    if (!moderation.isSafe) {
      const responseTimeMs = Math.round(performance.now() - startTime)

      await createModeratedRoast(supabase, {
        drama,
        mode,
        moderation_reason: moderation.reason ?? 'Conteudo inapropriado',
        response_time_ms: responseTimeMs,
        input_tokens: moderation.inputTokens,
        model_version: MODEL_VERSION,
        anonymous_id: auth.anonymousId ?? undefined,
        user_id: auth.userId ?? undefined,
      })

      await incrementRoastStats({ responseTimeMs, tokens: moderation.inputTokens, wasModerated: true })

      return NextResponse.json(
        { ...FALLBACK_RESPONSES[mode], mode, was_moderated: true, response_time_ms: responseTimeMs },
        { headers: getRateLimitHeaders(rateLimit) },
      )
    }

    const roastResult = await Sentry.startSpan(
      {
        name: 'llm.generate_roast',
        op: 'ai.run',
        attributes: { 'ai.model_id': MODEL_VERSION, 'ai.input_length': drama.length, 'ai.mode': mode },
      },
      () => generateRoast(drama, mode),
    )

    const responseTimeMs = Math.round(performance.now() - startTime)
    const totalTokens = roastResult.inputTokens + roastResult.outputTokens + moderation.inputTokens

    const roast = await createRoast(supabase, {
      drama,
      mode,
      roast_response: roastResult.roast,
      advice_response: roastResult.advice,
      closing_response: roastResult.closing,
      response_time_ms: responseTimeMs,
      input_tokens: roastResult.inputTokens + moderation.inputTokens,
      output_tokens: roastResult.outputTokens,
      model_version: roastResult.modelVersion,
      was_moderated: false,
      anonymous_id: auth.anonymousId ?? undefined,
      user_id: auth.userId ?? undefined,
    })

    await incrementRoastStats({ responseTimeMs, tokens: totalTokens, wasModerated: false })

    return NextResponse.json(
      {
        id: roast.id,
        roast: roastResult.roast,
        advice: roastResult.advice,
        closing: roastResult.closing,
        mode,
        response_time_ms: responseTimeMs,
      },
      { headers: getRateLimitHeaders(rateLimit) },
    )
  } catch (error) {
    Sentry.captureException(error, {
      tags: { mode, feature: 'roast' },
      extra: { dramaLength: drama.length },
    })

    const responseTimeMs = Math.round(performance.now() - startTime)

    return NextResponse.json(
      { ...FALLBACK_RESPONSES[mode], mode, fallback: true, response_time_ms: responseTimeMs },
      { status: 200, headers: getRateLimitHeaders(rateLimit) },
    )
  }
}
