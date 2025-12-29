import { getRatingBg, getRatingColor, getVitalRating, VITALS_THRESHOLDS, type VitalName } from '../status.types'

type VitalCardProps = {
  name: VitalName
  value: number
}

export function VitalCard({ name, value }: VitalCardProps) {
  const config = VITALS_THRESHOLDS[name]
  const rating = getVitalRating(name, value)
  const colorClass = getRatingColor(rating)
  const bgClass = getRatingBg(rating)

  const displayValue = name === 'cls' ? value.toFixed(3) : Math.round(value)

  return (
    <div className={`rounded border p-3 text-center ${bgClass}`}>
      <p className="text-xs font-medium text-zinc-500">{config.label}</p>
      <p className={`text-xl font-bold ${colorClass}`}>
        {displayValue}
        {config.unit}
      </p>
      <p className="text-xs text-zinc-400">
        target: &lt;{config.good}
        {config.unit}
      </p>
    </div>
  )
}
