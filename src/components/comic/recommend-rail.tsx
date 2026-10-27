import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { CoverChartBadge } from '@/components/comic/cover-chart-badge'
import { ComicTitleLine } from '@/components/comic/title-line'
import { Icon } from '@/components/icons/icon'
import type { ComicTitle } from '@/data/comic'

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
      className={`relative mt-10 py-8 ${light ? 'bg-[#f2f2f2] text-[#111]' : 'bg-transparent text-white'}`}
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

        <div ref={ref} className="relative scrollbar-hide flex gap-4 overflow-x-auto pb-1">
          {items.map((t) => (
            <Link key={t.id} to="/comic" className="w-[148px] shrink-0 sm:w-[168px]">
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <img src={t.cover} alt="" className="h-full w-full object-cover" />
                <CoverChartBadge title={t} />
              </div>
              <ComicTitleLine
                title={t}
                light={light}
                className="mt-2 text-[13px] font-extrabold"
              />
              <p className={`line-clamp-1 text-[11px] ${light ? 'text-[#666]' : 'text-white/50'}`}>
                {t.subtitle}
              </p>
              <p
                className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${light ? 'text-[#888]' : 'text-white/40'}`}
              >
                <Icon icon="lucide:megaphone" width={12} height={12} />
                {t.views.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
