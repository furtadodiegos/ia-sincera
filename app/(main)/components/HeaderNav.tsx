'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function HeaderNav() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
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
  )
}
