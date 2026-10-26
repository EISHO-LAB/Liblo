import { cn } from '@/lib/utils'

type Props = {
  rank: number
  className?: string
}

/**
 * Comic hero ranking numeral — black fill, white outline, soft shadow.
 * Position is locked for DayRanking cards: straddles bottom-left of the cover
 * (-left-2.5, translate-y 16%). Use only in the comic rank section.
 */
export function ComicRankBadge({ rank, className }: Props) {
  return (
    <span
      aria-hidden
      className={cn(
        'rank-num pointer-events-none absolute bottom-0 -left-2.5 z-10 translate-y-[16%] font-display',
        className,
      )}
    >
      {rank}
    </span>
  )
}
