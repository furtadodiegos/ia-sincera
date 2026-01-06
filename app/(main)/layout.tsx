import Link from 'next/link'

import { HeaderNav } from './components/HeaderNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
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

          <HeaderNav />
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
