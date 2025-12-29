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
  anonymous_id?: string
  user_id?: string
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
    anonymous_id: input.anonymous_id ?? null,
    user_id: input.user_id ?? null,
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
    anonymous_id?: string
    user_id?: string
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
    anonymous_id: input.anonymous_id,
    user_id: input.user_id,
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

export async function countAnonymousRoasts(client: SupabaseClientType, anonymousId: string): Promise<number> {
  const { count, error } = await client
    .from('roasts')
    .select('*', { count: 'exact', head: true })
    .eq('anonymous_id', anonymousId)

  if (error) {
    throw error
  }
  return count ?? 0
}

export async function migrateAnonymousRoasts(
  client: SupabaseClientType,
  anonymousId: string,
  userId: string,
): Promise<number> {
  const { data, error } = await client
    .from('roasts')
    .update({ user_id: userId, anonymous_id: null })
    .eq('anonymous_id', anonymousId)
    .select('id')

  if (error) {
    throw error
  }
  return data?.length ?? 0
}
