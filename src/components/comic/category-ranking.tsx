/**
 * Overall + genre category ranking board (MagaPocket-style layout, LIBLO style).
 *
 * Usage:
 *   import { CategoryRanking } from '@/components/comic'
 *   <CategoryRanking />
 *
 * Depends on: `@/data/comic` (`rankingTabs`, `rankingForTab`, badges).
 */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CoverOriginalBadge } from '@/components/comic/cover-original-badge'
import { ComicPromoBadge, RANK_PROMO } from '@/components/comic/promo-badge'
import { ComicRankBadge } from '@/components/comic/rank-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { Icon } from '@/components/icons/icon'
import {
  comicTitleHref,
  formatViews,
  RANKING_PREVIEW,
  rankingForTab,
  rankingTabs,
  type ComicTitle,
  type RankingTabKey,
} from '@/data/comic'
import { cn } from '@/lib/utils'

function RankRow({ title, rank }: { title: ComicTitle; rank: number }) {
  const promo = RANK_PROMO[rank]

  return (
    <Link
      to={comicTitleHref(title)}
      className="flex h-full min-h-0 items-start gap-3 border-b border-black/8 py-2.5 last:border-b-0 hover:bg-black/[0.02]"
    >
      <div className="relative w-[72px] shrink-0 overflow-visible">
        <div className="relative aspect-square overflow-hidden rounded-md bg-[#eee]">
          <img src={title.cover} alt="" className="h-full w-full object-cover object-top" />
          {title.isOriginal ? <CoverOriginalBadge className="top-1 left-1 scale-90" /> : null}
          {promo ? <ComicPromoBadge tone={promo.tone} label={promo.label} /> : null}
        </div>
        <ComicRankBadge rank={rank} className="!text-[1.35rem] -left-1.5" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5">
        <ComicTitleLine title={title} light className="text-[13px] font-extrabold" />
        <p className="truncate text-[11px] leading-snug text-[#888]">{title.subtitle}</p>
        <p className="flex items-center gap-1.5 text-[10px] text-[#999]">
          <span className="truncate font-medium text-[#777]">{title.writer}</span>
          <span className="text-[#ddd]">·</span>
          <span className="inline-flex shrink-0 items-center gap-0.5">
            <Icon icon="lucide:eye" width={10} height={10} />
            {formatViews(title.views)}
          </span>
        </p>
      </div>
    </Link>
  )
}

export type CategoryRankingProps = {
  className?: string
  /** Default tab. @default 'overall' */
  defaultTab?: RankingTabKey
}

/**
 * Standalone ranking section:
 * - Tabs: Overall · Original · New · Action · Romance · Fantasy · Drama · Comedy
 * - Layout: #1 featured + #2–10 grid
 * - See more → /comic/rank
 */
export function CategoryRanking({ className, defaultTab = 'overall' }: CategoryRankingProps) {
  const [tab, setTab] = useState<RankingTabKey>(defaultTab)

  const all = useMemo(() => rankingForTab(tab), [tab])
  const visible = all.slice(0, RANKING_PREVIEW)
  const featured = visible[0]
  const rest = visible.slice(1)
  const featuredPromo = RANK_PROMO[1]

  return (
    <section className={cn('relative bg-white', className)}>
      <div className="relative mx-auto max-w-[1200px] px-4 pt-3 pb-8 md:px-6 md:pt-4 md:pb-10">
        <span className="m1-watermark m1-watermark-light">RANK</span>

        <h2 className="relative font-display text-2xl font-extrabold text-[#111] md:text-3xl">
          Ranking
        </h2>

        <div className="relative mt-4 flex gap-1 overflow-x-auto border-b border-black/10 pb-px scrollbar-hide">
          {rankingTabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'shrink-0 cursor-pointer px-3 py-2.5 text-[12px] font-bold transition sm:text-[13px]',
                tab === t.key
                  ? 'border-b-2 border-m1 text-m1'
                  : 'border-b-2 border-transparent text-[#666] hover:text-[#111]',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {!featured ? (
          <p className="relative mt-8 text-sm text-[#888]">No titles in this category yet.</p>
        ) : (
          <>
            <div className="relative mt-6 grid items-stretch gap-5 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)] lg:gap-6">
              <Link
                to={comicTitleHref(featured)}
                className="group flex h-full min-h-0 min-w-0 flex-col"
              >
                <div className="relative min-h-[220px] flex-1 overflow-visible">
                  <div className="absolute inset-0 overflow-hidden rounded-lg bg-[#eee] ring-1 ring-black/8">
                    <img
                      src={featured.cover}
                      alt=""
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    />
                    {featured.isOriginal ? <CoverOriginalBadge /> : null}
                    {featuredPromo ? (
                      <ComicPromoBadge tone={featuredPromo.tone} label={featuredPromo.label} />
                    ) : null}
                  </div>
                  <ComicRankBadge rank={1} className="!text-[2.4rem]" />
                </div>
                <div className="relative z-[1] mt-4 flex shrink-0 flex-col gap-1.5">
                  <ComicTitleLine title={featured} light className="text-[15px] font-extrabold" />
                  <p className="text-[12px] leading-snug text-[#888]">{featured.subtitle}</p>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#999]">
                    <span className="font-medium text-[#777]">{featured.writer}</span>
                    <span className="text-[#ddd]">·</span>
                    <span>{featured.chapter ?? 'Ep. 1'}</span>
                    <span className="text-[#ddd]">·</span>
                    <span className="inline-flex items-center gap-0.5">
                      <Icon icon="lucide:eye" width={11} height={11} />
                      {formatViews(featured.views)}
                    </span>
                  </p>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#999] lg:line-clamp-3">
                    {featured.subtitle}. Keep reading on LIBLO — new episodes drop regularly.
                  </p>
                </div>
              </Link>

              <div className="flex h-full min-h-0 min-w-0 flex-col">
                <div className="grid h-full flex-1 auto-rows-fr grid-cols-1 gap-x-3 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">
                  {rest.slice(0, 9).map((t, i) => (
                    <RankRow key={t.id} title={t} rank={i + 2} />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative mt-8 flex justify-center">
              <Link
                to={`/comic/rank?tab=${tab}`}
                className="flex w-full max-w-md cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-m1 bg-white py-3 text-[13px] font-bold text-m1 transition hover:bg-m1 hover:text-white"
              >
                See more · Top {all.length}
                <Icon icon="lucide:chevron-right" width={16} height={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

/** @deprecated Prefer CategoryRanking */
export const GenreRanking = CategoryRanking
