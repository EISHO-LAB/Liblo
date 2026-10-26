import { Link } from 'react-router-dom'
import { ComicPromoBadge, RANK_PROMO } from '@/components/comic/promo-badge'
import { ComicRankBadge } from '@/components/comic/rank-badge'
import { ComicTicketTag } from '@/components/comic/ticket-tag'
import { Icon } from '@/components/icons/icon'
import { rankingPool } from '@/data/comic'
import { cn } from '@/lib/utils'

const ITEMS = rankingPool.slice(0, 7)

export function DayRanking({ className }: { className?: string }) {
  const d = new Date()

  return (
    <section className={cn('relative bg-white', className)}>
      {/* flex-1 grow from parent = scaled top space so slider+rank fill the screen */}
      <div className="relative mx-auto mt-auto w-full max-w-[1200px] px-4 pt-5 pb-7 md:px-6 md:pt-6 md:pb-8">
        <span className="m1-watermark m1-watermark-light">RANK</span>

        <div className="relative mb-4 flex flex-wrap items-end justify-between gap-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-[#111] md:text-xl">
            <Icon icon="lucide:flame" width={20} height={20} className="text-m1" />
            Weekly ranking
          </h2>
          <p className="text-[11px] font-semibold tracking-wide text-[#888]">
            UPDATE | {d.getMonth() + 1}.{String(d.getDate()).padStart(2, '0')}
          </p>
        </div>

        <div className="relative grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7 md:gap-3">
          {ITEMS.map((t, i) => {
            const rank = i + 1
            const promo = RANK_PROMO[rank]

            return (
              <Link key={t.id} to="/comic" className="relative min-w-0">
                <div className="relative overflow-visible">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#eee] ring-1 ring-black/8">
                    <img
                      src={t.cover}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />

                    {t.isOriginal ? (
                      <ComicTicketTag
                        tone="special"
                        className="absolute top-1.5 left-1.5 z-[1]"
                      >
                        ORIGINAL
                      </ComicTicketTag>
                    ) : null}

                    {promo ? <ComicPromoBadge tone={promo.tone} label={promo.label} /> : null}
                  </div>

                  <ComicRankBadge rank={rank} />
                </div>

                <p className="mt-3 truncate text-[11px] font-bold leading-snug text-[#333] sm:text-[12px]">
                  {t.title}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
