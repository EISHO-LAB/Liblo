import { cn } from '@/lib/utils'

export type PromoTone = 'hot' | 'free' | 'deal'

type Props = {
  tone: PromoTone
  label: string
  className?: string
}

/**
 * Cover corner promo — MagaPocket-style pink/red ¥0 square (฿0 for LIBLO).
 * - hot  → pink, jagged top
 * - free → red
 * - deal → blue
 */
export function ComicPromoBadge({ tone, label, className }: Props) {
  return (
    <div
      className={cn(
        'absolute right-1.5 bottom-1.5 z-[2] flex min-w-[36px] flex-col items-center overflow-hidden text-center leading-none',
        'rounded-sm shadow-[0_1px_3px_rgba(0,0,0,0.3)]',
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
              borderRadius: 0,
            }
          : undefined
      }
    >
      <span className="px-1.5 pt-1 pb-0.5 text-[7px] font-extrabold tracking-wide text-white">
        {label}
      </span>
      <span className="mb-0.5 w-[calc(100%-4px)] rounded-[1px] bg-white px-0.5 py-px text-[8px] font-extrabold text-[#111]">
        ฿0
      </span>
    </div>
  )
}

/** Per-rank cover promo for ranking boards — no HOT (board = already hot). */
export const RANK_PROMO: Record<number, { tone: PromoTone; label: string }> = {
  1: { tone: 'free', label: 'FREE' },
  2: { tone: 'free', label: 'FREE' },
  3: { tone: 'deal', label: 'FREE' },
  4: { tone: 'free', label: 'FREE' },
  5: { tone: 'free', label: 'FREE' },
  6: { tone: 'free', label: 'FREE' },
  7: { tone: 'deal', label: 'FREE' },
}

/** @deprecated use RANK_PROMO — kept for older imports */
export function promoForRank(rank: number): { tone: PromoTone; label: string } {
  return RANK_PROMO[rank] ?? { tone: 'free', label: 'FREE' }
}
