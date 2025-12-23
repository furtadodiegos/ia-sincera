import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production', // Only send data in production (to avoid polluting with dev errors)
  debug: false,

  // TRACING (Performance Monitoring)
  // Measures how long each operation takes
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  integrations: [
    Sentry.replayIntegration(),

    // BROWSER TRACING - Collects performance metrics from the browser
    // Automatically includes Core Web Vitals (LCP, CLS, INP)
    Sentry.browserTracingIntegration({
      // INP (Interaction to Next Paint) - time between click and visual response
      enableInp: true,
      // Long Tasks - detects JS tasks that block the thread > 50ms
      // Helps identify code that causes UI to freeze
      enableLongTask: true,
      // Long Animation Frames - detects frames that take too long to render
      // Useful for finding jank/stuttering problems
      enableLongAnimationFrame: true,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // PII (Personally Identifiable Information) - sends user data
  // Includes: IP, cookies, headers | Useful for debugging, careful with LGPD
  sendDefaultPii: true,
  enableLogs: true,
})

// NEXT.JS APP ROUTER HOOKS
// Captures route transitions in App Router to measure navigation performance
// Creates tracing spans when the user navigates between pages
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
