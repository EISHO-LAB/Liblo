import type { ComicTitle } from '@/data/comic'
import { cn } from '@/lib/utils'

type Props = {
  title: ComicTitle
  className?: string
}

/**
 * TOP 10 / TOP 25 chip on the cover (top-left).
 * Not used in the weekly ranking section.
 */
export function CoverChartBadge({ title, className }: Props) {
  const rank = title.chartRank
  if (rank == null || rank > 25) return null

  const isTop10 = rank <= 10

  return (
    <span
      className={cn(
        'comic-chip absolute top-1.5 left-1.5 z-[1]',
        isTop10 ? 'comic-chip-top10' : 'comic-chip-top25',
        className,
      )}
    >
      {isTop10 ? 'TOP 10' : 'TOP 25'}
    </span>
  )
}
