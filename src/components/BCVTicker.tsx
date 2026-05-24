import { useDollarRate } from '@/hooks/useDollarRate'

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
  if (diff < 1) return 'ahora mismo'
  if (diff < 60) return `hace ${diff} min`
  const hrs = Math.floor(diff / 60)
  if (hrs < 24) return `hace ${hrs}h`
  return `hace ${Math.floor(hrs / 24)}d`
}

export function BCVTicker() {
  const { data, isLoading, isError } = useDollarRate()

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="w-8 h-8 rounded-full bg-brand-100" />
        <div className="flex flex-col gap-1">
          <div className="w-24 h-3.5 bg-border rounded" />
          <div className="w-16 h-2.5 bg-border rounded" />
        </div>
      </div>
    )
  }

  if (isError || !data) return null

  const rate = data.promedio?.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const ago = data.fechaActualizacion ? timeAgo(data.fechaActualizacion) : null

  return (
    <div className="flex items-center gap-2.5 bg-brand-50 border border-brand-100 rounded-xl px-3 py-1.5 whitespace-nowrap">
      {/* Bs symbol */}
      <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
        <span className="text-white font-black text-sm leading-none">Bs</span>
      </div>
      <div className="flex flex-col leading-none gap-0.5">
        <span className="font-black text-base text-ink tracking-tight">
          {rate}
        </span>
        <span className="text-[10px] text-muted font-medium uppercase tracking-wide">
          BCV oficial{ago ? ` · ${ago}` : ''}
        </span>
      </div>
    </div>
  )
}
