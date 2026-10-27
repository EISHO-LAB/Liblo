import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CoverOriginalBadge } from '@/components/comic/cover-original-badge'
import { ComicPromoBadge, RANK_PROMO } from '@/components/comic/promo-badge'
import { ComicRankBadge } from '@/components/comic/rank-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { Icon } from '@/components/icons/icon'
import { SiteFooter } from '@/components/layout'
import {
  formatViews,
  rankingForTab,
  rankingTabs,
  type ComicTitle,
  type RankingTabKey,
} from '@/data/comic'
import { cn } from '@/lib/utils'

function isTabKey(v: string | null): v is RankingTabKey {
  return rankingTabs.some((t) => t.key === v)
}

function RankRow({ title, rank }: { title: ComicTitle; rank: number }) {
  const promo = RANK_PROMO[rank]

  return (
    <Link
      to="/comic"
      className="flex items-center gap-3 border-b border-black/8 py-3 hover:bg-black/[0.02]"
    >
      <div className="relative w-[72px] shrink-0 overflow-visible">
        <div className="relative aspect-square overflow-hidden rounded-md bg-[#eee]">
          <img src={title.cover} alt="" className="h-full w-full object-cover object-top" />
          {title.isOriginal ? <CoverOriginalBadge className="top-1 left-1 scale-90" /> : null}
          {promo ? <ComicPromoBadge tone={promo.tone} label={promo.label} /> : null}
        </div>
        <ComicRankBadge rank={rank} className="!text-[1.35rem] -left-1.5" />
      </div>
      <div className="min-w-0 flex-1">
        <ComicTitleLine title={title} light className="text-[14px] font-extrabold" />
        <p className="mt-1 truncate text-[12px] text-[#888]">{title.subtitle}</p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#999]">
          <span className="truncate font-medium text-[#777]">{title.writer}</span>
          <span className="text-[#ddd]">·</span>
          <span>{title.chapter ?? 'Ep. 1'}</span>
          <span className="text-[#ddd]">·</span>
          <span className="inline-flex items-center gap-0.5">
            <Icon icon="lucide:eye" width={11} height={11} />
            {formatViews(title.views)}
          </span>
        </p>
      </div>
    </Link>
  )
}

/** Full ranking board — linked from comic home “See more”. */
export function ComicRankPage() {
  const [params, setParams] = useSearchParams()
  const tab: RankingTabKey = isTabKey(params.get('tab')) ? params.get('tab')! : 'overall'
  const items = useMemo(() => rankingForTab(tab), [tab])

  const setTab = (key: RankingTabKey) => {
    setParams(key === 'overall' ? {} : { tab: key }, { replace: true })
  }

  return (
    <div className="min-h-screen bg-white pt-header">
      <div className="mx-auto max-w-[900px] px-4 py-8 md:px-6 md:py-10">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-[#999] uppercase">
              <Link to="/comic" className="hover:text-m1">
                Comics
              </Link>
              <span className="mx-1.5 text-[#ccc]">/</span>
              Ranking
            </p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-[#111] md:text-3xl">
              Ranking
            </h1>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-b border-black/10 pb-px scrollbar-hide">
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

        <div className="mt-2">
          {items.map((t, i) => (
            <RankRow key={t.id} title={t} rank={i + 1} />
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
