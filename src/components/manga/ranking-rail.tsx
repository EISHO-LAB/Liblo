import type { SeriesCard } from '@/data/catalog'

const ranks = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'] as const

type Props = {
  title: string
  items: SeriesCard[]
  onSelect?: (series: SeriesCard) => void
}

export function RankingRail({ title, items, onSelect }: Props) {
  return (
    <section className="mb-10">
      <div className="mb-3 px-4 md:px-6">
        <h2 className="section-title">{title}</h2>
        <p className="mt-1 text-xs text-white/45">Updated daily · Liblo charts</p>
      </div>

      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2 md:px-6">
        {items.slice(0, 8).map((series, i) => (
          <button
            key={series.id}
            type="button"
            onClick={() => onSelect?.(series)}
            className="group relative w-[148px] shrink-0 cursor-pointer text-left sm:w-[168px]"
          >
            <div
              className="cover-card relative aspect-[3/4] bg-cover bg-center"
              style={{ backgroundImage: 'url(/manga-ui/home/bg-card.png)' }}
            >
              <img
                src={series.coverUrl}
                alt=""
                className="absolute inset-[10%_10%_22%] h-[68%] w-[80%] rounded-md object-cover shadow-lg transition duration-500 group-hover:scale-[1.03]"
              />
              <img
                src={`/manga-ui/ranking/${ranks[i]}.svg`}
                alt={`#${i + 1}`}
                className="absolute bottom-2 left-2 h-7 w-auto drop-shadow-md"
              />
              {i === 0 ? (
                <img
                  src="/manga-ui/badge/original.svg"
                  alt="Original"
                  className="absolute top-2 right-2 h-5 w-auto"
                />
              ) : null}
            </div>
            <p className="mt-2 line-clamp-2 text-[12px] font-semibold text-white group-hover:text-brand-bright">
              {series.title}
            </p>
            <p className="text-[11px] text-white/45">{series.genre}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
