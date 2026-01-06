import * as Sentry from '@sentry/nextjs'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { generateRoast, moderateDrama } from '@/lib/llm'
import { checkRateLimit, getRateLimitHeaders, incrementRoastStats } from '@/lib/redis'
import { createModeratedRoast, createRoast, createServerClient } from '@/lib/supabase'
import type { RateLimitResult } from '@/lib/redis'
import type { RoastMode } from '@/lib/types'
import { getAuthContext } from './roast.auth'
import { FALLBACK_RESPONSES } from './roast.fallbacks'
import { getClientIp, validateRequest } from './roast.validation'

async function parseRequestBody(request: Request) {
  try {
    return { success: true as const, body: await request.json() }
  } catch {
    return { success: false as const, error: 'JSON invalido' }
  }
}

type ErrorContext = {
  mode: RoastMode
  drama: string
  auth: { userId: string | null; anonymousId: string | null }
  startTime: number
  rateLimit: RateLimitResult
}

async function handleGenerationError(error: unknown, ctx: ErrorContext) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  const errorStack = error instanceof Error ? error.stack : undefined
  const responseTimeMs = Math.round(performance.now() - ctx.startTime)

  Sentry.captureException(error, {
    level: 'error',
    tags: { mode: ctx.mode, feature: 'roast' },
    extra: {
      dramaLength: ctx.drama.length,
      errorMessage,
      errorStack,
      userId: ctx.auth.userId,
      anonymousId: ctx.auth.anonymousId,
    },
  })

  await Sentry.flush(2000)

  return NextResponse.json(
    {
      ...FALLBACK_RESPONSES[ctx.mode],
      mode: ctx.mode,
      fallback: true,
      response_time_ms: responseTimeMs,
      provider: 'gemini' as const,
    },
    { status: 200, headers: getRateLimitHeaders(ctx.rateLimit) },
  )
}

export async function POST(request: Request) {
  const startTime = performance.now()
  const headersList = await headers()
  const ip = getClientIp(headersList)

  const dailyLimit = await checkRateLimit(ip, 'daily')
  if (!dailyLimit.success) {
    return NextResponse.json(
      {
        error: 'Limite diario atingido. Volte amanha para mais zoeiras!',
        daily_limit_reached: true,
        daily_remaining: 0,
        daily_reset: dailyLimit.reset,
      },
      { status: 429, headers: getRateLimitHeaders(dailyLimit) },
    )
  }

  const rateLimit = await checkRateLimit(ip, 'roasts')
  if (!rateLimit.success) {
    return NextResponse.json(
      { error: 'Muitas requisicoes. Tente novamente em alguns minutos.' },
      { status: 429, headers: getRateLimitHeaders(rateLimit) },
    )
  }

  const parseResult = await parseRequestBody(request)
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error }, { status: 400 })
  }

  const validation = validateRequest(parseResult.body)
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

  Sentry.addBreadcrumb({
    category: 'auth',
    message: `Auth context: userId=${auth.userId}, anonymousId=${auth.anonymousId}`,
    level: 'info',
  })

  const userIdentifier = auth.userId ?? auth.anonymousId ?? ip

  try {
    const moderation = await Sentry.startSpan(
      {
        name: 'llm.moderation',
        op: 'ai.run',
        attributes: { 'ai.input_length': drama.length },
      },
      () => moderateDrama(drama, userIdentifier),
    )

    if (!moderation.isSafe) {
      const responseTimeMs = Math.round(performance.now() - startTime)

      await createModeratedRoast(supabase, {
        drama,
        mode,
        moderation_reason: moderation.reason ?? 'Conteudo inapropriado',
        response_time_ms: responseTimeMs,
        input_tokens: moderation.inputTokens,
        model_version: moderation.provider,
        anonymous_id: auth.anonymousId ?? undefined,
        user_id: auth.userId ?? undefined,
      })

      await incrementRoastStats({ responseTimeMs, tokens: moderation.inputTokens, wasModerated: true })

      return NextResponse.json(
        {
          ...FALLBACK_RESPONSES[mode],
          mode,
          was_moderated: true,
          response_time_ms: responseTimeMs,
          provider: moderation.provider,
          daily_remaining: dailyLimit.remaining - 1,
        },
        { headers: getRateLimitHeaders(rateLimit) },
      )
    }

    const roastResult = await Sentry.startSpan(
      {
        name: 'llm.generate_roast',
        op: 'ai.run',
        attributes: { 'ai.input_length': drama.length, 'ai.mode': mode },
      },
      () => generateRoast(drama, mode, userIdentifier),
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
        provider: roastResult.provider,
        daily_remaining: dailyLimit.remaining - 1,
      },
      { headers: getRateLimitHeaders(rateLimit) },
    )
  } catch (error) {
    return handleGenerationError(error, { mode, drama, auth, startTime, rateLimit })
  }
}
