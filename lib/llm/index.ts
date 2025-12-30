import * as gemini from '@/lib/gemini'
import * as openai from '@/lib/openai'
import type { RoastMode } from '@/lib/types'
import { incrementProviderCounter, type LLMProvider, selectProvider } from './selector'

export type { LLMProvider } from './selector'

export type RoastResult = {
  roast: string
  advice: string
  closing: string
  inputTokens: number
  outputTokens: number
  modelVersion: string
  provider: LLMProvider
}

export type ModerationResult = {
  isSafe: boolean
  reason: string | null
  inputTokens: number
  provider: LLMProvider
}

export async function moderateDrama(drama: string, identifier: string): Promise<ModerationResult> {
  const provider = await selectProvider(identifier)

  if (provider === 'openai') {
    const result = await openai.moderateDrama(drama)
    return { ...result, provider }
  }

  const result = await gemini.moderateDrama(drama)
  return { ...result, provider }
}

export async function generateRoast(drama: string, mode: RoastMode, identifier: string): Promise<RoastResult> {
  const provider = await selectProvider(identifier)

  await incrementProviderCounter(identifier)

  if (provider === 'openai') {
    const result = await openai.generateRoast(drama, mode)
    return { ...result, provider }
  }

  const result = await gemini.generateRoast(drama, mode)
  return { ...result, provider }
}

export { selectProvider } from './selector'
