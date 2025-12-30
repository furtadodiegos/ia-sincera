'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 select-none">
            <span className="text-2xl sm:text-3xl">😈</span>

            <span className="flex flex-col text-left text-base font-bold leading-tight tracking-tight sm:block sm:text-xl">
              <span>Te Ajudo, </span>
              <span className="font-normal text-slate-400 sm:inline">Mas Não Muito</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            {!isHome && (
              <Link href="/" className="transition-colors hover:text-indigo-600">
                Gerar Roast
              </Link>
            )}
            <Link href="/status" className="transition-colors hover:text-indigo-600">
              Status
            </Link>
            <a
              href="https://github.com/furtadodiegos/ia-sincera"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-slate-900">
              GitHub
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        <p>
          Feito com 🔥 e um pouco de ironia •{' '}
          <a href="https://github.com/diegofurtado" className="underline hover:text-slate-700">
            Diego Furtado
          </a>
        </p>
      </footer>
    </div>
  )
}
