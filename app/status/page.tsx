import Link from 'next/link'
import { StatusDashboard } from './components'

export default function StatusPage() {
  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-2 text-center text-2xl font-bold">Status</h1>
      <p className="mb-8 text-center text-sm text-zinc-500">Monitoramento de Performance</p>

      <StatusDashboard />

      <p className="text-center text-xs text-zinc-400">
        <Link href="/" className="underline">
          Voltar
        </Link>
      </p>
    </main>
  )
}
