import * as Sentry from '@sentry/nextjs'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateRoast, MODEL_VERSION, moderateDrama, type RoastMode } from '@/lib/gemini'
import { checkRateLimit, getRateLimitHeaders, incrementRoastStats } from '@/lib/redis'
import { createModeratedRoast, createRoast, createServerClient } from '@/lib/supabase'

type RoastRequest = {
  drama: string
  mode: RoastMode
}

const VALID_MODES: RoastMode[] = ['tio_churrasco', 'coach_quantico', 'amigo_sincero']

function getClientIp(headersList: Headers): string {
  return headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || '127.0.0.1'
}

function validateRequest(body: unknown): { success: true; data: RoastRequest } | { success: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { success: false, error: 'Body invalido' }
  }

  const { drama, mode } = body as Record<string, unknown>

  if (typeof drama !== 'string' || drama.length === 0) {
    return { success: false, error: 'Drama e obrigatorio' }
  }

  if (drama.length > 140) {
    return { success: false, error: 'Drama deve ter no maximo 140 caracteres' }
  }

  if (!VALID_MODES.includes(mode as RoastMode)) {
    return { success: false, error: 'Modo invalido' }
  }

  return { success: true, data: { drama, mode: mode as RoastMode } }
}

const FALLBACK_RESPONSES: Record<RoastMode, { roast: string; advice: string; closing: string }> = {
  tio_churrasco: {
    roast: 'Olha, no meu tempo a gente resolvia isso com uma boa conversa e um churrasquinho.',
    advice: 'Meu conselho: deixa o tempo resolver. Sempre funciona.',
    closing: 'Vai dar tudo certo, confia no tio!',
  },
  coach_quantico: {
    roast: 'A energia do universo esta te mostrando que voce precisa vibrar mais alto!',
    advice: 'Decretar e manifestar: repita 3 vezes "eu sou abundancia".',
    closing: 'Namaste e boas vibracoes!',
  },
  amigo_sincero: {
    roast: 'Amigo, vou ser sincero: ja vi situacoes piores, mas essa ta complicada.',
    advice: 'Respira fundo e tenta ver o lado positivo. Ou nao, faz o que quiser.',
    closing: 'To aqui se precisar, mas resolve isso ai!',
  },
}

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

  try {
    const moderation = await Sentry.startSpan(
      {
        name: 'llm.moderation',
        op: 'ai.run',
        attributes: {
          'ai.model_id': MODEL_VERSION,
          'ai.input_length': drama.length,
        },
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
      })

      await incrementRoastStats({
        responseTimeMs,
        tokens: moderation.inputTokens,
        wasModerated: true,
      })

      const fallback = FALLBACK_RESPONSES[mode]
      return NextResponse.json(
        {
          roast: fallback.roast,
          advice: fallback.advice,
          closing: fallback.closing,
          mode,
          was_moderated: true,
          response_time_ms: responseTimeMs,
        },
        { headers: getRateLimitHeaders(rateLimit) },
      )
    }

    const roastResult = await Sentry.startSpan(
      {
        name: 'llm.generate_roast',
        op: 'ai.run',
        attributes: {
          'ai.model_id': MODEL_VERSION,
          'ai.input_length': drama.length,
          'ai.mode': mode,
        },
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
    })

    await incrementRoastStats({
      responseTimeMs,
      tokens: totalTokens,
      wasModerated: false,
    })

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
    const fallback = FALLBACK_RESPONSES[mode]

    return NextResponse.json(
      {
        roast: fallback.roast,
        advice: fallback.advice,
        closing: fallback.closing,
        mode,
        fallback: true,
        response_time_ms: responseTimeMs,
      },
      { status: 200, headers: getRateLimitHeaders(rateLimit) },
    )
  }
}
