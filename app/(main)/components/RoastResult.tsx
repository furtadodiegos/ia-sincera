import { MODE_LABELS, type RoastResponse } from '@/lib/types'

type RoastResultProps = {
  result: RoastResponse
}

export function RoastResult({ result }: RoastResultProps) {
  return (
    <div className="mt-6 space-y-4 rounded border border-zinc-200 p-4 dark:border-zinc-800">
      <div>
        <p className="text-xs text-zinc-500">Roast ({MODE_LABELS[result.mode]})</p>
        <p className="text-lg">{result.roast}</p>
      </div>
      <div>
        <p className="text-xs text-zinc-500">Conselho</p>
        <p>{result.advice}</p>
      </div>
      <div>
        <p className="text-xs text-zinc-500">Fechamento</p>
        <p className="italic">{result.closing}</p>
      </div>
      <p className="text-xs text-zinc-400">
        {result.response_time_ms}ms
        {result.was_moderated && ' | moderado'}
        {result.fallback && ' | fallback'}
      </p>
    </div>
  )
}
