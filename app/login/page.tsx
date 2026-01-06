import { redirect } from 'next/navigation'

import { GoogleIcon } from '@/components/GoogleIcon'
import { createClient } from '@/lib/supabase/server'
import { signInWithGoogle } from './login.actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (data.user) {
    redirect('/')
  }

  const params = await searchParams
  const error = params.error

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Ironizi</h1>
          <p className="text-gray-400">Roasts e conselhos com humor</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm text-center">
            Erro ao fazer login. Tente novamente.
          </div>
        )}

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors">
            <GoogleIcon />
            Entrar com Google
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm">Ao entrar, você concorda com nossos termos de uso</p>
      </div>
    </main>
  )
}
