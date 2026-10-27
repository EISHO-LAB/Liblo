import { Link } from 'react-router-dom'
import { CoverOriginalBadge } from '@/components/comic/cover-original-badge'
import { ComicPromoBadge, RANK_PROMO } from '@/components/comic/promo-badge'
import { ComicRankBadge } from '@/components/comic/rank-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { Icon } from '@/components/icons/icon'
import { formatViews, type ComicTitle } from '@/data/comic'
import { cn } from '@/lib/utils'

/**
 * Realistic week-over-week move:
 * - #1 → same or up only (never down)
 * - Top ranks → smaller moves, often flat
 * - Lower ranks → more volatile
 */
export function rankChangeFor(id: string, rank: number): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  const seed = Math.abs(h + rank * 17)

  // #1 can only hold or climb into first — never show down
  if (rank === 1) {
    const n = seed % 5
    if (n <= 2) return 0
    return n - 1 // up 1–2
  }

  if (rank <= 3) {
    const n = seed % 8
    if (n <= 2) return 0
    if (n <= 5) return n - 2 // up 1–3
    return -(n - 5) // down 1–2
  }

  if (rank <= 10) {
    const n = seed % 12
    if (n <= 2) return 0
    if (n <= 7) return Math.min(n - 2, 4) // up 1–4
    return -Math.min(n - 7, 3) // down 1–3
  }

  const n = seed % 16
  if (n <= 2) return 0
  if (n <= 9) return Math.min(n - 2, 6) // up 1–6
  return -Math.min(n - 9, 5) // down 1–5
}

function RankChange({ delta, size = 'md' }: { delta: number; size?: 'sm' | 'md' }) {
  if (delta === 0) return null

  const icon = size === 'md' ? 12 : 9
  const text = size === 'md' ? 'text-[12px]' : 'text-[10px]'

  if (delta > 0) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-px font-extrabold tabular-nums text-[#16a34a]',
          text,
        )}
        aria-label={`Up ${delta}`}
      >
        <Icon icon="mdi:triangle" width={icon} height={icon} className="shrink-0" />
        {delta}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-px font-extrabold tabular-nums text-[#dc2626]',
        text,
      )}
      aria-label={`Down ${Math.abs(delta)}`}
    >
      <Icon icon="mdi:triangle-down" width={icon} height={icon} className="shrink-0" />
      {Math.abs(delta)}
    </span>
  )
}

export type ComicRankCardProps = {
  title: ComicTitle
  rank: number
  /** Top 10 — larger type + description. */
  featured?: boolean
  className?: string
}

/**
 * Ranking chart card — same cover / title / meta pattern as landing comic tiles,
 * with chart extras: oversized rank numeral + up/down delta.
 */
export function ComicRankCard({ title, rank, featured = false, className }: ComicRankCardProps) {
  const promo = RANK_PROMO[rank]
  const delta = rankChangeFor(title.id, rank)

  return (
    <Link
      to="/comic"
      className={cn(
        'group relative flex min-w-0 flex-col',
        featured ? 'gap-3' : 'gap-2',
        className,
      )}
    >
      <div className={cn('relative isolate overflow-visible', featured ? 'pt-1' : 'pt-0.5')}>
        <div
          className={cn(
            'relative z-[1] overflow-hidden bg-[#eee] ring-1 ring-black/8',
            featured ? 'aspect-[2/3] rounded-xl' : 'aspect-[2/3] rounded-md',
          )}
        >
          <img
            src={title.cover}
            alt=""
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
          />
          {title.isOriginal ? (
            <CoverOriginalBadge className={featured ? undefined : 'top-1 left-1 scale-[0.72]'} />
          ) : null}
          {promo ? <ComicPromoBadge tone={promo.tone} label={promo.label} /> : null}
        </div>
        <ComicRankBadge
          rank={rank}
          className={cn(
            featured
              ? '!text-[4rem] sm:!text-[4.5rem] md:!text-[5rem] -left-1.5'
              : '!text-[2.35rem] sm:!text-[2.6rem] -left-1',
          )}
        />
      </div>

      <div className={cn('min-w-0', featured ? 'space-y-1 pt-1.5' : 'space-y-0.5 pt-1')}>
        <div className={cn('flex items-start', featured ? 'gap-1.5' : 'gap-1')}>
          <ComicTitleLine
            title={title}
            light
            hideHot
            className={cn(
              'min-w-0 flex-1 font-extrabold',
              featured ? 'text-[13px] md:text-[14px]' : 'text-[10px] leading-tight sm:text-[11px]',
            )}
          />
          <RankChange delta={delta} size={featured ? 'md' : 'sm'} />
        </div>

        {featured ? (
          <p className="line-clamp-2 text-[11px] leading-snug text-[#888] md:text-[12px]">
            {title.subtitle}
          </p>
        ) : null}

        <div
          className={cn(
            'flex items-center justify-between gap-2',
            featured ? 'text-[11px]' : 'text-[9px] sm:text-[10px]',
          )}
        >
          <span className="min-w-0 truncate text-[#888]">{title.writer}</span>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[#999]">
            <Icon
              icon="lucide:eye"
              width={featured ? 11 : 9}
              height={featured ? 11 : 9}
            />
            {formatViews(title.views)}
          </span>
        </div>
      </div>
    </Link>
  )
}
