import type { ComicTitle } from '@/data/comic'
import { cn } from '@/lib/utils'

type Props = {
  title: ComicTitle
  className?: string
}

/**
 * MagaPocket-style TOP pill on the cover (top-right).
 * Not used in weekly / category ranking (those use rank numerals).
 */
export function CoverChartBadge({ title, className }: Props) {
  const rank = title.chartRank
  if (rank == null || rank > 25) return null

  const isTop10 = rank <= 10

  return (
    <span
      className={cn(
        'absolute top-1.5 right-1.5 z-[2] inline-flex items-center justify-center',
        'rounded-full px-2 py-[3px] font-sans text-[9px] font-extrabold tracking-[0.04em] text-white',
        'shadow-[0_1px_3px_rgba(0,0,0,0.35)]',
        isTop10 ? 'bg-[#e1203c]' : 'bg-[#5a5a5a]',
        className,
      )}
    >
      {isTop10 ? 'TOP10' : 'TOP25'}
    </span>
  )
}
