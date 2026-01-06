import { RoastForm } from './components'

const DecorativeBlurs = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 opacity-30">
      <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-200 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/2 translate-y-1/2 rounded-full bg-orange-200 blur-3xl" />
    </div>
  )
}

const StatusBadge = () => {
  return (
    <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />

        <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
      </span>
      Agora com IA (Ignorância Artificial)
    </div>
  )
}

const WindowCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>

        <div className="font-mono text-xs text-slate-400">ironizi.app</div>
      </div>

      <div className="p-6 md:p-8">{children}</div>
    </div>
  )
}

export default function Home() {
  return (
    <section className="relative overflow-hidden px-4 pb-32 pt-20">
      <DecorativeBlurs />

      <div className="container relative z-10 mx-auto mb-12 max-w-4xl text-center">
        <StatusBadge />

        <h1
          className="animate-slide-up mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl"
          style={{ animationDelay: '0.1s' }}>
          Conselhos que você não pediu, mas{' '}
          <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            precisava ouvir
          </span>
          .
        </h1>

        <p
          className="animate-slide-up mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl"
          style={{ animationDelay: '0.2s' }}>
          Conta o drama do seu amigo e recebe uma zoeira sincera com um conselho questionável. A IA mais sincera que
          você vai encontrar.
        </p>
      </div>

      <div className="animate-slide-up container relative z-10 mx-auto max-w-3xl" style={{ animationDelay: '0.3s' }}>
        <WindowCard>
          <RoastForm />
        </WindowCard>
      </div>
    </section>
  )
}
