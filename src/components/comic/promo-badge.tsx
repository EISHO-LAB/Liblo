import { cn } from '@/lib/utils'

export type PromoTone = 'hot' | 'free' | 'deal'

type Props = {
  tone: PromoTone
  label: string
  className?: string
}

/**
 * Original comic rank promo (Manga One–style).
 * - hot  → pink, jagged top
 * - free → red
 * - deal → blue
 * Price chip uses Thai baht.
 */
export function ComicPromoBadge({ tone, label, className }: Props) {
  return (
    <div
      className={cn(
        'absolute right-1.5 bottom-1.5 z-[2] flex min-w-[34px] flex-col items-center overflow-hidden text-center leading-none',
        tone === 'hot' && 'bg-[#F6334F]',
        tone === 'free' && 'bg-[#e1203c]',
        tone === 'deal' && 'bg-[#2f6bff]',
        className,
      )}
      style={
        tone === 'hot'
          ? {
              clipPath:
                'polygon(0 8%, 12% 0, 28% 10%, 45% 0, 62% 9%, 78% 0, 100% 8%, 100% 100%, 0 100%)',
            }
          : undefined
      }
    >
      <span className="px-1 pt-1 pb-0.5 text-[7px] font-extrabold tracking-wide text-white">
        {label}
      </span>
      <span className="mb-0.5 w-[calc(100%-4px)] bg-white px-0.5 py-px text-[7px] font-extrabold text-[#111]">
        ฿0
      </span>
    </div>
  )
}

/** Original per-rank promo map for comic hero ranking. */
export const RANK_PROMO: Record<number, { tone: PromoTone; label: string }> = {
  1: { tone: 'hot', label: 'HOT' },
  2: { tone: 'free', label: 'FREE' },
  3: { tone: 'deal', label: 'FREE' },
  4: { tone: 'free', label: 'FREE' },
  5: { tone: 'free', label: 'FREE' },
  6: { tone: 'hot', label: 'HOT' },
  7: { tone: 'hot', label: 'HOT' },
}

/** @deprecated use RANK_PROMO — kept for older imports */
export function promoForRank(rank: number): { tone: PromoTone; label: string } {
  return RANK_PROMO[rank] ?? { tone: 'free', label: 'FREE' }
}
