import { MODEL_VERSION, model } from './client'
import { buildRoastPrompt, MODERATION_PROMPT, type RoastMode } from './prompts'

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
  const prompt = MODERATION_PROMPT.replace('{text}', drama)

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  const usage = response.usageMetadata
  const inputTokens = usage?.promptTokenCount ?? 0

  const parsed = parseJsonResponse<{ is_safe: boolean; reason: string | null }>(text)

  return {
    isSafe: parsed.is_safe,
    reason: parsed.reason,
    inputTokens,
  }
}

export async function generateRoast(drama: string, mode: RoastMode): Promise<RoastResult> {
  const prompt = buildRoastPrompt(drama, mode)

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  const usage = response.usageMetadata
  const inputTokens = usage?.promptTokenCount ?? 0
  const outputTokens = usage?.candidatesTokenCount ?? 0

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
