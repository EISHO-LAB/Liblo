import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ComicCardMeta } from '@/components/comic/card-meta'
import { CoverChartBadge } from '@/components/comic/cover-chart-badge'
import { CoverOriginalBadge } from '@/components/comic/cover-original-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { Icon } from '@/components/icons/icon'
import { comicTitleHref, type ComicTitle } from '@/data/comic'

type Props = {
  title: string
  watermark: string
  items: ComicTitle[]
  light?: boolean
}

export function RecommendRail({ title, watermark, items, light = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
  }

  return (
    <section
      className={`relative py-10 ${light ? 'bg-[#f2f2f2] text-[#111]' : 'm1-dot-bg text-white'}`}
    >
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6">
        <span className={`m1-watermark ${light ? 'm1-watermark-light' : ''}`}>{watermark}</span>

        <div className="relative mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold md:text-xl">{title}</h2>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-black text-white"
              aria-label="Previous"
            >
              <Icon icon="lucide:chevron-left" width={16} height={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-black text-white"
              aria-label="Next"
            >
              <Icon icon="lucide:chevron-right" width={16} height={16} />
            </button>
          </div>
        </div>

        <div ref={ref} className="relative scrollbar-hide flex gap-4 overflow-x-auto overflow-y-visible pt-2.5 pr-1 pb-1">
          {items.map((t) => (
            <Link key={t.id} to={comicTitleHref(t)} className="w-[148px] shrink-0 sm:w-[168px]">
              <div className="@container/cover relative isolate overflow-visible">
                <div className="relative z-[1] aspect-[2/3] overflow-hidden rounded-lg">
                  <img src={t.cover} alt="" className="h-full w-full object-cover" />
                  {t.isOriginal ? <CoverOriginalBadge /> : null}
                </div>
                <CoverChartBadge title={t} />
              </div>
              <ComicTitleLine
                title={t}
                light={light}
                className="mt-2 text-[13px] font-extrabold"
              />
              <ComicCardMeta title={t} light={light} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
