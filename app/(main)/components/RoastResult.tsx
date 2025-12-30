import { MODE_LABELS, type RoastResponse } from '@/lib/types'

type RoastResultProps = {
  result: RoastResponse
}

export function RoastResult({ result }: RoastResultProps) {
  return (
    <div className="animate-slide-up mt-8 space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="font-medium text-slate-700">{MODE_LABELS[result.mode]}</span>
        <span>•</span>
        <span>{result.response_time_ms}ms</span>
        {result.was_moderated && (
          <>
            <span>•</span>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">moderado</span>
          </>
        )}
        {result.fallback && (
          <>
            <span>•</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">fallback</span>
          </>
        )}
      </div>

      <ResultCard icon="🔥" title="O Roast" variant="primary">
        {result.roast}
      </ResultCard>

      <ResultCard icon="💡" title="O Conselho" variant="secondary">
        {result.advice}
      </ResultCard>

      <ResultCard icon="🎤" title="Mic Drop" variant="accent">
        {result.closing}
      </ResultCard>

      <div className="flex justify-center pt-4">
        <ShareButton result={result} />
      </div>
    </div>
  )
}

type ResultCardProps = {
  icon: string
  title: string
  variant: 'primary' | 'secondary' | 'accent'
  children: React.ReactNode
}

const variantStyles = {
  primary: 'border-indigo-200 bg-linear-to-br from-indigo-50 to-purple-50',
  secondary: 'border-amber-200 bg-linear-to-br from-amber-50 to-orange-50',
  accent: 'border-slate-200 bg-linear-to-br from-slate-50 to-slate-100',
}

function ResultCard({ icon, title, variant, children }: ResultCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${variantStyles[variant]}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
      </div>
      <p className="text-lg leading-relaxed text-slate-700">{children}</p>
    </div>
  )
}

function ShareButton({ result }: { result: RoastResponse }) {
  function handleShare() {
    const text = `🔥 ${result.roast}\n\n💡 ${result.advice}\n\n🎤 ${result.closing}\n\n— Via Ironizi.app`

    if (navigator.share) {
      navigator.share({ title: 'Meu Roast', text })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:shadow">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      </svg>
      Compartilhar
    </button>
  )
}
