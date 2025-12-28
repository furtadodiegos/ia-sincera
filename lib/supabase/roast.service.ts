import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, TablesInsert } from './database.types'

export type RoastMode = 'tio_churrasco' | 'coach_quantico' | 'amigo_sincero'

export type CreateRoastInput = {
  drama: string
  mode: RoastMode
  roast_response: string
  advice_response: string
  closing_response: string
  response_time_ms: number
  input_tokens?: number
  output_tokens?: number
  model_version?: string
  was_moderated?: boolean
  moderation_reason?: string
}

type SupabaseClientType = SupabaseClient<Database>

export async function createRoast(client: SupabaseClientType, input: CreateRoastInput) {
  const insertData: TablesInsert<'roasts'> = {
    drama: input.drama,
    mode: input.mode,
    roast_response: input.roast_response,
    advice_response: input.advice_response,
    closing_response: input.closing_response,
    response_time_ms: input.response_time_ms,
    input_tokens: input.input_tokens ?? null,
    output_tokens: input.output_tokens ?? null,
    model_version: input.model_version ?? null,
    was_moderated: input.was_moderated ?? false,
    moderation_reason: input.moderation_reason ?? null,
  }

  const { data, error } = await client.from('roasts').insert(insertData).select().single()

  if (error) {
    throw error
  }
  return data
}

export async function createModeratedRoast(
  client: SupabaseClientType,
  input: {
    drama: string
    mode: RoastMode
    moderation_reason: string
    response_time_ms: number
    input_tokens?: number
    model_version?: string
  },
) {
  return createRoast(client, {
    drama: input.drama,
    mode: input.mode,
    roast_response: '',
    advice_response: '',
    closing_response: '',
    response_time_ms: input.response_time_ms,
    input_tokens: input.input_tokens,
    output_tokens: 0,
    model_version: input.model_version,
    was_moderated: true,
    moderation_reason: input.moderation_reason,
  })
}

export async function getBasicMetrics(client: SupabaseClientType) {
  const { data, error } = await client.rpc('get_basic_metrics').single()
  if (error) {
    throw error
  }
  return data
}

export async function getRoastMetrics(client: SupabaseClientType) {
  const { data, error } = await client.rpc('get_roast_metrics').single()
  if (error) {
    throw error
  }
  return data
}
