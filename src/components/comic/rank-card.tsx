import { Link } from 'react-router-dom'
import { CoverOriginalBadge } from '@/components/comic/cover-original-badge'
import { ComicPromoBadge, RANK_PROMO } from '@/components/comic/promo-badge'
import { ComicRankBadge } from '@/components/comic/rank-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { Icon } from '@/components/icons/icon'
import { formatViews, type ComicTitle } from '@/data/comic'
import { cn } from '@/lib/utils'

/** Deterministic mock week-over-week move: +up / −down / 0 same. */
export function rankChangeFor(id: string, rank: number): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  const n = Math.abs(h + rank * 17) % 13
  if (n === 0 || n === 1) return 0
  if (n <= 7) return n - 1
  return -(n - 7)
}

function RankChange({ delta, size = 'md' }: { delta: number; size?: 'sm' | 'md' }) {
  const icon = size === 'md' ? 12 : 9
  const text = size === 'md' ? 'text-[12px]' : 'text-[10px]'

  if (delta === 0) {
    return (
      <span className={cn('inline-flex items-center text-[#d4d4d4]', text)} aria-label="No change">
        <span className="block h-[2px] w-2.5 rounded-full bg-current" />
      </span>
    )
  }

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
        featured ? 'gap-2.5' : 'gap-1',
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
              ? '!text-[3.25rem] sm:!text-[3.6rem] md:!text-[4rem] -left-1'
              : '!text-[1.85rem] sm:!text-[2.1rem] -left-1',
          )}
        />
      </div>

      <div className={cn('min-w-0', featured ? 'space-y-1' : 'space-y-0')}>
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

        {featured ? (
          <>
            <p className="truncate text-[11px] text-[#888]">{title.writer}</p>
            <p className="inline-flex items-center gap-0.5 text-[11px] text-[#999]">
              <Icon icon="lucide:eye" width={11} height={11} />
              {formatViews(title.views)}
            </p>
          </>
        ) : (
          <p className="mt-0.5 inline-flex items-center gap-0.5 text-[9px] text-[#aaa]">
            <Icon icon="lucide:eye" width={9} height={9} />
            {formatViews(title.views)}
          </p>
        )}
      </div>
    </Link>
  )
}
