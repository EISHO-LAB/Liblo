import { Link } from 'react-router-dom'
import type { SeriesCard } from '@/data/catalog'

type Props = {
  title: string
  items: SeriesCard[]
  moreTo?: string
  onSelect?: (series: SeriesCard) => void
}

export function TitleRail({ title, items, moreTo, onSelect }: Props) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between px-4 md:px-6">
        <h2 className="section-title">{title}</h2>
        {moreTo ? (
          <Link to={moreTo} className="more-link">
            See more
            <img src="/manga-ui/more-arrow.svg" alt="" className="h-3 w-auto opacity-90" />
          </Link>
        ) : null}
      </div>

      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2 md:px-6">
        {items.map((series) => (
          <button
            key={series.id}
            type="button"
            onClick={() => onSelect?.(series)}
            className="group w-[112px] shrink-0 cursor-pointer text-left sm:w-[128px]"
          >
            <div className="cover-card aspect-[2/3]">
              <img
                src={series.coverUrl}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                <span className="text-[10px] font-semibold tracking-wide text-brand-bright uppercase">
                  {series.format === 'SCROLL' ? 'Comic' : series.format}
                </span>
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-snug text-white/90 group-hover:text-brand-bright">
              {series.title}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}
