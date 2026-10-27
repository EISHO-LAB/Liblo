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
    const pool = [...catalog.slice(offset), ...catalog.slice(0, offset)].filter((t) => t.isUp)
    const fallback = [...catalog.slice(offset), ...catalog.slice(0, offset)]
    return (pool.length ? pool : fallback).slice(0, 21)
  }, [day])

  return (
    <section className="relative m1-dot-bg">
      <div className="relative mx-auto max-w-[1200px] px-4 pt-8 pb-12 md:px-6 md:pt-10 md:pb-14">
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

        {/* pt-2.5 = same ribbon clearance as recommend rail */}
        <div className="relative grid grid-cols-3 gap-x-2.5 gap-y-5 pt-2.5 sm:grid-cols-4 sm:gap-x-3 sm:gap-y-6 md:grid-cols-5 lg:grid-cols-7 lg:gap-x-3.5 lg:gap-y-7">
          {items.map((t) => (
            <Link key={`${day}-${t.id}`} to={comicTitleHref(t)} className="min-w-0">
              {/* @container/cover → ribbon cqw locks to this cover width (same as recommend) */}
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
      </div>
    </section>
  )
}
