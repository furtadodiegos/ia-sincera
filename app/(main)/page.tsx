import Link from 'next/link'
import { RoastForm } from './components'

export default function Home() {
  return (
    <main className="mx-auto max-w-xl p-4">
      <h1 className="mb-8 text-center text-2xl font-bold">IA Sincera</h1>

      <RoastForm />

      <p className="mt-8 text-center text-xs text-zinc-400">
        <Link href="/status" className="underline">
          Ver metricas
        </Link>
      </p>
    </main>
  )
}
