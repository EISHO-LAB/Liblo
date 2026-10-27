import type { ComicTitle } from '@/data/comic'
import { cn } from '@/lib/utils'

type Props = {
  title: ComicTitle
  /** Dark text for light backgrounds. */
  light?: boolean
  className?: string
}

/**
 * Title row: UP or NEW SEASON (mutually exclusive) + HOT + truncated name.
 * Chart badges (TOP 10 / TOP 25) live on the cover — see CoverChartBadge.
 */
export function ComicTitleLine({ title, light = false, className }: Props) {
  return (
    <div className={cn('flex min-w-0 items-center gap-1', className)}>
      {title.isNewSeason ? (
        <span className="comic-chip comic-chip-season shrink-0">N</span>
      ) : title.isUp ? (
        <span className="comic-chip comic-chip-up shrink-0">UP</span>
      ) : null}
      {title.isHot ? <span className="comic-chip comic-chip-hot shrink-0">HOT</span> : null}
      <p
        className={cn(
          'min-w-0 truncate text-[12px] font-bold leading-snug',
          light ? 'text-[#333]' : 'text-white',
        )}
      >
        {title.title}
      </p>
    </div>
  )
}
