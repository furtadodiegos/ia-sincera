import type { RoastMode } from '@/lib/types'
import { MODEL_VERSION, openai } from './client'
import { buildSystemPrompt, buildUserPrompt, MODERATION_SYSTEM_PROMPT } from './prompts'

export type RoastResult = {
  roast: string
  advice: string
  closing: string
  inputTokens: number
  outputTokens: number
  modelVersion: string
}

export type ModerationResult = {
  isSafe: boolean
  reason: string | null
  inputTokens: number
}

function parseJsonResponse<T>(text: string): T {
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in response')
  }
  return JSON.parse(jsonMatch[0]) as T
}

export async function moderateDrama(drama: string): Promise<ModerationResult> {
  const response = await openai.chat.completions.create({
    model: MODEL_VERSION,
    messages: [
      { role: 'system', content: MODERATION_SYSTEM_PROMPT },
      { role: 'user', content: `Analise este texto: "${drama}"` },
    ],
    temperature: 0,
  })

  const text = response.choices[0]?.message?.content ?? ''
  const inputTokens = response.usage?.prompt_tokens ?? 0

  const parsed = parseJsonResponse<{ is_safe: boolean; reason: string | null }>(text)

  return {
    isSafe: parsed.is_safe,
    reason: parsed.reason,
    inputTokens,
  }
}

export async function generateRoast(drama: string, mode: RoastMode): Promise<RoastResult> {
  const response = await openai.chat.completions.create({
    model: MODEL_VERSION,
    messages: [
      { role: 'system', content: buildSystemPrompt(mode) },
      { role: 'user', content: buildUserPrompt(drama) },
    ],
    temperature: 0.8,
  })

  const text = response.choices[0]?.message?.content ?? ''
  const inputTokens = response.usage?.prompt_tokens ?? 0
  const outputTokens = response.usage?.completion_tokens ?? 0

  const parsed = parseJsonResponse<{ roast: string; advice: string; closing: string }>(text)

  return {
    roast: parsed.roast,
    advice: parsed.advice,
    closing: parsed.closing,
    inputTokens,
    outputTokens,
    modelVersion: MODEL_VERSION,
  }
}
