import { type RoastMode, VALID_MODES } from '@/lib/types'

export type RoastRequest = {
  drama: string
  mode: RoastMode
}

type ValidationResult = { success: true; data: RoastRequest } | { success: false; error: string }

export function validateRequest(body: unknown): ValidationResult {
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

export function getClientIp(headersList: Headers): string {
  return headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || '127.0.0.1'
}
