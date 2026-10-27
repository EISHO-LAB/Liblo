import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ComicCardMeta } from '@/components/comic/card-meta'
import { CoverChartBadge } from '@/components/comic/cover-chart-badge'
import { CoverOriginalBadge } from '@/components/comic/cover-original-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { Icon } from '@/components/icons/icon'
import { SiteFooter } from '@/components/layout'
import {
  catalog,
  comicTitleHref,
  days,
  todayKey,
  type ComicTitle,
} from '@/data/comic'
import { cn } from '@/lib/utils'

type DayKey = (typeof days)[number]['key']

function isDayKey(v: string | null): v is DayKey {
  return days.some((d) => d.key === v)
}

/** Rotate catalog so each weekday shows a different update set. */
export function updatesForDay(day: DayKey): ComicTitle[] {
  const offset = Math.max(0, days.findIndex((x) => x.key === day))
  const rotated = [...catalog.slice(offset), ...catalog.slice(0, offset)]
  const pool = rotated.filter((t) => t.isUp)
  return pool.length ? pool : rotated
}

function UpdateCard({ title }: { title: ComicTitle }) {
  return (
    <Link to={comicTitleHref(title)} className="group min-w-0">
      <div className="@container/cover relative isolate overflow-visible">
        <div className="relative z-[1] aspect-[2/3] overflow-hidden rounded-lg bg-[#1c1c1c] ring-1 ring-black/8">
          <img
            src={title.cover}
            alt=""
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
          />
          {title.isOriginal ? <CoverOriginalBadge /> : null}
        </div>
        <CoverChartBadge title={title} />
      </div>
      <div className="mt-2 space-y-0.5">
        <ComicTitleLine title={title} light className="text-[12px] sm:text-[13px]" />
        <ComicCardMeta title={title} light className="text-[10px] sm:text-[11px]" />
      </div>
    </Link>
  )
}

/**
 * Full “New updates” page — day tickets + complete grid.
 * Linked from TodayUpdates “See more”.
 */
export function ComicUpdatesPage() {
  const [params, setParams] = useSearchParams()
  const initial = isDayKey(params.get('day')) ? params.get('day')! : todayKey()
  const [day, setDay] = useState<DayKey>(initial)

  const items = useMemo(() => updatesForDay(day), [day])
  const dayLabel = days.find((x) => x.key === day)?.label ?? 'Tue'
  const d = new Date()

  const selectDay = (key: DayKey) => {
    setDay(key)
    setParams(key === todayKey() ? {} : { day: key }, { replace: true })
  }

  return (
    <div className="min-h-screen bg-white pt-header">
      <div className="border-b border-black/6 bg-[#111]">
        <div className="mx-auto max-w-[1200px] px-4 pt-8 pb-6 md:px-6 md:pt-10 md:pb-8">
          <p className="text-[11px] font-bold tracking-wide text-white/45 uppercase">
            <Link to="/comic" className="hover:text-m1">
              Comics
            </Link>
            <span className="mx-1.5 text-white/25">/</span>
            Updates
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-white md:text-3xl">
                New updates
              </h1>
              <p className="mt-1 text-[13px] text-white/55">
                {d.getMonth() + 1}/{d.getDate()} · {dayLabel} · {items.length} titles
              </p>
            </div>
            <Link
              to="/comic"
              className="inline-flex items-center gap-1 text-[12px] font-bold text-white/60 transition hover:text-white"
            >
              <Icon icon="lucide:arrow-left" width={14} height={14} />
              Back to comics
            </Link>
          </div>

          <div className="day-ticket-row relative mt-6">
            {days.map((x) => (
              <button
                key={x.key}
                type="button"
                onClick={() => selectDay(x.key)}
                className={cn('day-ticket', day === x.key && 'day-ticket-active')}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10">
        {items.length === 0 ? (
          <p className="text-sm text-[#888]">No updates for this day yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 pt-1 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-7 md:grid-cols-5 lg:grid-cols-7 lg:gap-x-4 lg:gap-y-8">
            {items.map((t) => (
              <UpdateCard key={`${day}-${t.id}`} title={t} />
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
