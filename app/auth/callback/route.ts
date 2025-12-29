import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'
import { generateAnonymousId } from '@/lib/auth'
import { migrateAnonymousRoasts } from '@/lib/supabase'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1'
  const anonymousId = generateAnonymousId(ip)

  try {
    const migratedCount = await migrateAnonymousRoasts(supabase, anonymousId, data.user.id)
    if (migratedCount > 0) {
      Sentry.addBreadcrumb({
        message: `Migrated ${migratedCount} roasts from anonymous to user`,
        level: 'info',
        data: { userId: data.user.id, migratedCount },
      })
    }
  } catch (err) {
    Sentry.captureException(err, { extra: { anonymousId, userId: data.user.id } })
  }

  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}
