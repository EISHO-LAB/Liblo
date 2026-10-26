import { Link } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { rankingPool } from '@/data/manga-one-en'
import { cn } from '@/lib/utils'

const ITEMS = rankingPool.slice(0, 7)

/** Bottom-right promo badges — Manga One style, English. */
const PROMO: Record<number, { tone: 'hot' | 'free' | 'deal'; label: string }> = {
  1: { tone: 'hot', label: 'HOT' },
  2: { tone: 'free', label: 'FREE' },
  3: { tone: 'deal', label: 'FREE' },
  4: { tone: 'free', label: 'FREE' },
  5: { tone: 'free', label: 'FREE' },
  6: { tone: 'hot', label: 'HOT' },
  7: { tone: 'hot', label: 'HOT' },
}

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
            const promo = PROMO[rank]

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
                      <span className="absolute top-1.5 left-1.5 z-[1] rounded-[2px] bg-black/55 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white backdrop-blur-[2px]">
                        ORIGINAL
                      </span>
                    ) : null}

                    {promo ? <PromoBadge tone={promo.tone} label={promo.label} /> : null}
                  </div>

                  {/* Half on cover, half over title — does not push title down */}
                  <span
                    aria-hidden
                    className="rank-num pointer-events-none absolute bottom-0 -left-2.5 z-10 translate-y-[16%] font-display"
                  >
                    {rank}
                  </span>
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

function PromoBadge({ tone, label }: { tone: 'hot' | 'free' | 'deal'; label: string }) {
  return (
    <div
      className={cn(
        'absolute right-0 bottom-0 z-[2] flex min-w-[42px] flex-col items-center overflow-hidden text-center leading-none',
        tone === 'hot' && 'bg-[#F6334F]',
        tone === 'free' && 'bg-[#e1203c]',
        tone === 'deal' && 'bg-[#2f6bff]',
      )}
      style={
        tone === 'hot'
          ? { clipPath: 'polygon(0 8%, 12% 0, 28% 10%, 45% 0, 62% 9%, 78% 0, 100% 8%, 100% 100%, 0 100%)' }
          : undefined
      }
    >
      <span className="px-1.5 pt-1.5 pb-0.5 text-[9px] font-extrabold tracking-wide text-white">
        {label}
      </span>
      <span className="mb-0.5 w-[calc(100%-4px)] bg-white px-1 py-[1px] text-[8px] font-extrabold text-[#111]">
        ¥0
      </span>
    </div>
  )
}
