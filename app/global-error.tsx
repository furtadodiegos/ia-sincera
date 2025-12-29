'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Algo deu errado!</h1>
          <p className="text-zinc-400">Erro inesperado. Tente novamente.</p>
          <button type="button" onClick={reset} className="rounded bg-white px-4 py-2 text-zinc-900 hover:bg-zinc-200">
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  )
}
