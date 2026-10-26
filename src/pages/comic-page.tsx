import { useMemo, useState } from 'react'
import { Icon } from '@/components/icons/icon'
import { RankingRail } from '@/components/manga/ranking-rail'
import { TitleRail } from '@/components/manga/title-rail'
import { SeriesModal } from '@/components/netflix/series-modal'
import { catalog, railFor, type SeriesCard } from '@/data/catalog'
import { cn } from '@/lib/utils'

const genres = ['All', 'Romance', 'Drama', 'Fantasy', 'Action', 'Thriller', 'Slice of Life'] as const

export function ComicPage() {
  const comics = railFor('scroll')
  const featured = comics[0] ?? catalog[1]!
  const [genre, setGenre] = useState<(typeof genres)[number]>('All')
  const [selected, setSelected] = useState<SeriesCard | null>(null)

  const filtered = useMemo(() => {
    if (genre === 'All') return comics
    return comics.filter((c) => c.genre === genre || c.tags.includes(genre))
  }, [comics, genre])

  return (
    <div className="min-h-screen bg-[#111] pb-20 pt-header">
      <section className="relative mx-auto max-w-6xl overflow-hidden px-4 py-6 md:px-6">
        <div className="relative grid overflow-hidden rounded-2xl ring-1 ring-white/10 md:grid-cols-[240px_1fr]">
          <button
            type="button"
            onClick={() => setSelected(featured)}
            className="group relative aspect-[2/3] cursor-pointer overflow-hidden md:aspect-auto md:min-h-[320px]"
          >
            <img
              src={featured.coverUrl}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </button>
          <div className="relative flex flex-col justify-center bg-gradient-to-br from-[#152238] via-[#111] to-[#0b1220] p-6 md:p-10">
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-brand-bright uppercase">
              Comics · Webtoon
            </p>
            <h1 className="font-display text-3xl font-bold text-white md:text-4xl">
              {featured.title}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              {featured.synopsis}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(26,122,255,0.35)] hover:bg-brand-bright"
              >
                <Icon icon="lucide:book-open" width={16} height={16} />
                Read now
              </button>
              <button
                type="button"
                onClick={() => setSelected(featured)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/16"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </section>

      <RankingRail title="Comic ranking" items={comics} onSelect={setSelected} />

      <section className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Browse comics</h2>
            <p className="mt-1 text-xs text-white/45">Vertical-scroll stories — binge anytime.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGenre(g)}
                className={cn(
                  'shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
                  genre === g
                    ? 'bg-brand text-white'
                    : 'bg-white/8 text-white/65 hover:bg-white/14 hover:text-white',
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {filtered.map((series) => (
            <button
              key={series.id}
              type="button"
              onClick={() => setSelected(series)}
              className="group cursor-pointer text-left"
            >
              <div className="cover-card aspect-[2/3]">
                <img
                  src={series.coverUrl}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-[12px] font-medium text-white/90 group-hover:text-brand-bright">
                {series.title}
              </p>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <TitleRail title="Also popular" items={railFor('trending')} onSelect={setSelected} />
      </div>

      {selected ? <SeriesModal series={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
