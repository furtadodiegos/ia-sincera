'use client'

import { signInWithGoogle } from '@/app/login/login.actions'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: Props) {
  if (!isOpen) {
    return null
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Modal backdrop pattern
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}>
        <h2 id="login-modal-title" className="mb-2 text-xl font-bold">
          Limite atingido!
        </h2>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          Voce ja usou seus 3 roasts gratuitos. Crie uma conta para continuar gerando roasts ilimitados.
        </p>

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 font-medium text-gray-900 ring-1 ring-zinc-200 transition-colors hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700 dark:hover:bg-zinc-700">
            <GoogleIcon />
            Entrar com Google
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
          Talvez depois
        </button>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" role="img" aria-label="Google">
      <title>Google</title>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}
