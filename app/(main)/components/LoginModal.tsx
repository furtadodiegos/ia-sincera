'use client'

import { useState } from 'react'

import { signInWithGoogle } from '@/app/login/login.actions'
import { GoogleIcon } from '@/components/GoogleIcon'
import { LoadingSpinner } from '@/components/LoadingSpinner'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: Props) {
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) {
    return null
  }

  async function handleGoogleLogin() {
    setIsLoading(true)
    await signInWithGoogle()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar modal"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="animate-slide-up relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 p-6 text-center text-white">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
            🤖
          </div>

          <h2 id="login-modal-title" className="text-xl font-bold">
            Eita, gostou da zueira?
          </h2>
        </div>

        <div className="p-6">
          <p className="mb-6 text-center text-slate-600">
            Fico feliz que tá curtindo toda essa ironia! Faz o login aí pra provar que tu não é robô e continua com a
            zoeira.
          </p>

          <form action={handleGoogleLogin}>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:shadow disabled:cursor-not-allowed disabled:opacity-50">
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  Redirecionando...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  Entrar com Google
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full py-2 text-sm text-slate-500 transition-colors hover:text-slate-700">
            Talvez depois
          </button>
        </div>
      </div>
    </div>
  )
}
