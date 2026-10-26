import { Link } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { rankingPool } from '@/data/manga-one-en'
import { cn } from '@/lib/utils'

const ITEMS = rankingPool.slice(0, 7)

export function DayRanking() {
  const d = new Date()

  return (
    <section className="relative bg-white">
      <div className="relative mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <span className="m1-watermark m1-watermark-light">RANK</span>

        <div className="relative mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-[#111] md:text-xl">
            <Icon icon="lucide:flame" width={20} height={20} className="text-m1" />
            Weekly ranking
          </h2>
          <p className="text-[11px] font-semibold tracking-wide text-[#888]">
            UPDATE | {d.getMonth() + 1}.{String(d.getDate()).padStart(2, '0')}
          </p>
        </div>

        {/* Fixed 7-card grid */}
        <div className="relative grid grid-cols-3 gap-3 pt-3 sm:grid-cols-4 md:grid-cols-7 md:gap-3">
          {ITEMS.map((t, i) => {
            const rank = i + 1
            const isTop3 = rank <= 3

            return (
              <Link key={t.id} to="/comic" className="relative min-w-0">
                <div className="relative overflow-visible">
                  {isTop3 ? <NewStyleBadge rank={rank} /> : null}

                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#eee] shadow-sm ring-1 ring-black/10">
                    <img
                      src={t.cover}
                      alt=""
                      className="h-full w-full object-cover object-top"
                    />

                    {isTop3 ? (
                      <div className="absolute top-[6px] right-0 left-[34px] z-[1] h-[3px] bg-[#e1203c]" />
                    ) : (
                      <span
                        className={cn(
                          'absolute top-2 left-2 z-[1] flex h-7 w-7 items-center justify-center rounded-full font-display text-[12px] font-extrabold shadow-md ring-2 ring-white',
                          rank === 4 && 'bg-[#1a1a1a] text-white',
                          rank === 5 && 'bg-[#3a3a3a] text-white',
                          rank === 6 && 'bg-[#5a5a5a] text-white',
                          rank === 7 && 'bg-[#7a7a7a] text-white',
                        )}
                      >
                        {rank}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2 space-y-0.5">
                  <p className="line-clamp-2 text-[11px] font-bold leading-snug text-[#111] sm:text-[12px]">
                    {t.title}
                  </p>
                  <p className="flex items-center gap-1 text-[10px] text-[#888] sm:text-[11px]">
                    {t.chapter ?? 'Ep. 1'}
                    <Icon icon="lucide:book-marked" width={10} height={10} className="opacity-70" />
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function NewStyleBadge({ rank }: { rank: number }) {
  return (
    <div
      className="pointer-events-none absolute -top-2.5 -left-2.5 z-20 h-[48px] w-[48px]"
      aria-label={`Rank ${rank}`}
    >
      <div
        className="absolute top-[3px] left-[3px] h-[34px] w-[34px] rotate-45 bg-[#e1203c]"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.28)' }}
      />
      <div className="absolute top-[7px] left-[7px] h-[26px] w-[26px] rotate-45 border-[2px] border-white" />
      <span className="absolute top-[13px] left-[13px] flex h-[14px] w-[14px] items-center justify-center font-display text-[12px] font-extrabold leading-none text-white">
        {rank}
      </span>
    </div>
  )
}
