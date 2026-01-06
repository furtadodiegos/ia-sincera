import type { SupabaseClient } from '@supabase/supabase-js'

import { FREE_LIMIT, generateAnonymousId } from '@/lib/auth'
import { countAnonymousRoasts } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type AuthContext = {
  anonymousId: string | null
  userId: string | null
  requiresLogin: boolean
}

export async function getAuthContext(supabase: SupabaseClient<Database>, ip: string): Promise<AuthContext> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return { anonymousId: null, userId: user.id, requiresLogin: false }
  }

  const anonymousId = generateAnonymousId(ip)
  const roastCount = await countAnonymousRoasts(supabase, anonymousId)

  return {
    anonymousId,
    userId: null,
    requiresLogin: roastCount >= FREE_LIMIT,
  }
}
