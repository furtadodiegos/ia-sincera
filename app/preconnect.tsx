export function Preconnect() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN

  const sentryHost = sentryDsn ? new URL(sentryDsn).origin : null

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {supabaseUrl && (
        <>
          <link rel="preconnect" href={supabaseUrl} />
          <link rel="dns-prefetch" href={supabaseUrl} />
        </>
      )}
      <link rel="preconnect" href={posthogHost} />
      <link rel="dns-prefetch" href={posthogHost} />
      {sentryHost && (
        <>
          <link rel="preconnect" href={sentryHost} />
          <link rel="dns-prefetch" href={sentryHost} />
        </>
      )}
    </>
  )
}
