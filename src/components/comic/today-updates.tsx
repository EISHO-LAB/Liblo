import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ComicCardMeta } from '@/components/comic/card-meta'
import { CoverChartBadge } from '@/components/comic/cover-chart-badge'
import { CoverOriginalBadge } from '@/components/comic/cover-original-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { Icon } from '@/components/icons/icon'
import { catalog, comicTitleHref, days, todayKey } from '@/data/comic'
import { cn } from '@/lib/utils'

/** 3 rows × columns at each breakpoint (matches the grid below). */
function previewCountForWidth(w: number): number {
  if (w >= 1024) return 21 // 7 × 3
  if (w >= 768) return 15 // 5 × 3
  if (w >= 640) return 12 // 4 × 3
  return 9 // 3 × 3
}

function useThreeRowPreview() {
  const [n, setN] = useState(() =>
    typeof window === 'undefined' ? 9 : previewCountForWidth(window.innerWidth),
  )

  useEffect(() => {
    const sync = () => setN(previewCountForWidth(window.innerWidth))
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  return n
}

function updatesForDay(day: (typeof days)[number]['key']) {
  const offset = Math.max(0, days.findIndex((x) => x.key === day))
  const rotated = [...catalog.slice(offset), ...catalog.slice(0, offset)]
  const pool = rotated.filter((t) => t.isUp)
  return pool.length ? pool : rotated
}

export function TodayUpdates() {
  const [day, setDay] = useState(todayKey())
  const previewN = useThreeRowPreview()
  const d = new Date()
  const dayLabel = days.find((x) => x.key === day)?.label ?? 'Tue'

  const all = useMemo(() => updatesForDay(day), [day])
  const items = all.slice(0, previewN)
  const hasMore = all.length > previewN
  const moreHref = day === todayKey() ? '/new' : `/new?day=${day}`

  return (
    <section className="relative m1-dot-bg">
      <div className="relative mx-auto max-w-[1200px] px-4 pt-8 pb-12 md:px-6 md:pt-10 md:pb-14">
        <span className="m1-watermark">UPDATE</span>

        <div className="relative mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-extrabold text-white md:text-xl">
            New updates!! {d.getMonth() + 1}/{d.getDate()} ({dayLabel})
          </h2>
          <Link to={moreHref} className="see-more-btn shrink-0">
            See more
            <img src="/m1/assets/home/todays-updated-section/more-arrow.svg" alt="" className="h-2.5" />
          </Link>
        </div>

        {/* Comic ticket day filter — notches + dotted dividers */}
        <div className="day-ticket-row relative mb-6">
          {days.map((x) => (
            <button
              key={x.key}
              type="button"
              onClick={() => setDay(x.key)}
              className={cn('day-ticket', day === x.key && 'day-ticket-active')}
            >
              {x.label}
            </button>
          ))}
        </div>

        {/* 3 rows max — extra titles on /new */}
        <div className="relative grid grid-cols-3 gap-x-2.5 gap-y-5 pt-2.5 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-6 md:grid-cols-5 lg:grid-cols-7 lg:gap-x-3.5 lg:gap-y-7">
          {items.map((t) => (
            <Link key={`${day}-${t.id}`} to={comicTitleHref(t)} className="min-w-0">
              <div className="@container/cover relative isolate overflow-visible">
                <div className="relative z-[1] aspect-[2/3] overflow-hidden rounded-lg bg-[#1c1c1c] ring-1 ring-white/8">
                  <img
                    src={t.cover}
                    alt=""
                    className="h-full w-full object-cover object-top transition duration-300 hover:scale-[1.03]"
                  />
                  {t.isOriginal ? <CoverOriginalBadge /> : null}
                </div>
                <CoverChartBadge title={t} />
              </div>
              <div className="mt-2 space-y-0.5">
                <ComicTitleLine title={t} className="text-[11px] sm:text-[12px]" />
                <ComicCardMeta title={t} className="text-[10px]" />
              </div>
            </Link>
          ))}
        </div>

        {hasMore ? (
          <div className="relative mt-8 flex justify-center">
            <Link
              to={moreHref}
              className="flex w-full max-w-md cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-white/25 bg-transparent py-3 text-[13px] font-bold text-white transition hover:border-m1 hover:bg-m1"
            >
              See more · {all.length - previewN} titles
              <Icon icon="lucide:chevron-right" width={16} height={16} />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
