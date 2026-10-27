import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ComicRankCard } from '@/components/comic/rank-card'
import { SiteFooter } from '@/components/layout'
import { rankingForTab, rankingTabs, type RankingTabKey } from '@/data/comic'
import { cn } from '@/lib/utils'

function isTabKey(v: string | null): v is RankingTabKey {
  return rankingTabs.some((t) => t.key === v)
}

/**
 * Ranking page:
 * - #1–#10 bigger cards + description
 * - #11–#25 denser/smaller, no description
 * - Cards via ComicRankCard (same landing pattern + chart extras)
 */
export function ComicRankPage() {
  const [params, setParams] = useSearchParams()
  const tab: RankingTabKey = isTabKey(params.get('tab')) ? params.get('tab')! : 'overall'
  const items = useMemo(() => rankingForTab(tab).slice(0, 25), [tab])
  const top = items.slice(0, 10)
  const rest = items.slice(10)

  const setTab = (key: RankingTabKey) => {
    setParams(key === 'overall' ? {} : { tab: key }, { replace: true })
  }

  return (
    <div className="min-h-screen bg-white pt-header">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10">
        <div className="mb-5">
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

        {items.length === 0 ? (
          <p className="mt-8 text-sm text-[#888]">No titles in this category yet.</p>
        ) : (
          <div className="mt-8 space-y-10 md:space-y-12">
            <section>
              <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-9">
                {top.map((t, i) => (
                  <ComicRankCard key={t.id} title={t} rank={i + 1} featured />
                ))}
              </div>
            </section>

            {rest.length > 0 ? (
              <section className="border-t border-black/8 pt-8 md:pt-10">
                <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-x-3.5 sm:gap-y-6 md:grid-cols-5 lg:grid-cols-7 lg:gap-x-4 lg:gap-y-6">
                  {rest.map((t, i) => (
                    <ComicRankCard key={t.id} title={t} rank={i + 11} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
