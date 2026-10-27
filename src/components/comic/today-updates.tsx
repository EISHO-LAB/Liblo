import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ComicCardMeta } from '@/components/comic/card-meta'
import { CoverChartBadge } from '@/components/comic/cover-chart-badge'
import { CoverOriginalBadge } from '@/components/comic/cover-original-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { catalog, comicTitleHref, days, todayKey } from '@/data/comic'
import { cn } from '@/lib/utils'

export function TodayUpdates() {
  const [day, setDay] = useState(todayKey())
  const d = new Date()
  const dayLabel = days.find((x) => x.key === day)?.label ?? 'Tue'

  const items = useMemo(() => {
    const offset = Math.max(0, days.findIndex((x) => x.key === day))
    // rotate catalog so each weekday shows a different “new updates” set
    const pool = [...catalog.slice(offset), ...catalog.slice(0, offset)].filter((t) => t.isUp)
    const fallback = [...catalog.slice(offset), ...catalog.slice(0, offset)]
    return (pool.length ? pool : fallback).slice(0, 10)
  }, [day])

  return (
    <section className="relative m1-dot-bg">
      <div className="relative mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        <span className="m1-watermark">UPDATE</span>

        <div className="relative mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-extrabold text-white md:text-xl">
            New updates!! {d.getMonth() + 1}/{d.getDate()} ({dayLabel})
          </h2>
          <Link to="/new" className="see-more-btn shrink-0">
            See more
            <img src="/m1/assets/home/todays-updated-section/more-arrow.svg" alt="" className="h-2.5" />
          </Link>
        </div>

        {/* Same day filter as ranking used */}
        <div className="relative mb-4 flex overflow-hidden rounded-lg bg-[#2a2a2a]">
          {days.map((x) => (
            <button
              key={x.key}
              type="button"
              onClick={() => setDay(x.key)}
              className={cn(
                'flex-1 cursor-pointer py-2.5 text-center text-[12px] font-extrabold transition sm:text-sm',
                day === x.key ? 'bg-m1 text-white' : 'text-white/70 hover:text-white',
              )}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className="relative scrollbar-hide flex gap-3 overflow-x-auto overflow-y-visible pt-2.5 pr-1 pb-2">
          {items.map((t) => (
            <Link
              key={`${day}-${t.id}`}
              to={comicTitleHref(t)}
              className="w-[128px] shrink-0 sm:w-[148px]"
            >
              <div className="@container/cover relative isolate overflow-visible">
                <div className="relative z-[1] aspect-[3/4] overflow-hidden rounded-lg bg-[#2a2a2a]">
                  <img src={t.cover} alt="" className="h-full w-full object-cover object-top" />
                  {t.isOriginal ? <CoverOriginalBadge /> : null}
                </div>
                <CoverChartBadge title={t} />
              </div>
              <div className="mt-2 space-y-0.5">
                <ComicTitleLine title={t} />
                <ComicCardMeta title={t} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
