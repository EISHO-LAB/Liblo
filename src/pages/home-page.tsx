import { useState } from 'react'
import { Icon } from '@/components/icons/icon'
import { SeriesModal } from '@/components/netflix/series-modal'
import { SeriesRow } from '@/components/netflix/series-row'
import { catalog, featuredSeries, railFor, type SeriesCard } from '@/data/catalog'

export function HomePage() {
  const [selected, setSelected] = useState<SeriesCard | null>(null)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-netflix-black">
      {/* Hero — deepanik/Netflix proportions */}
      <div className="relative h-[56.25vw] max-h-[95vh] min-h-[400px] w-full">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-netflix-black/60 to-netflix-black" />
        <img
          src={featuredSeries.coverUrl}
          alt=""
          className="h-full w-full object-cover object-[center_20%]"
        />

        <div className="absolute top-[35%] left-4 z-20 max-w-[80%] sm:top-[30%] sm:max-w-[70%] md:left-[60px] md:max-w-[50%]">
          <h1 className="mb-3 font-display text-3xl font-bold text-white sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl">
            {featuredSeries.title}
          </h1>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-white/80">
            <span>
              {featuredSeries.year} · {featuredSeries.seasons}
            </span>
            <span className="border border-white/40 px-1 text-xs">{featuredSeries.quality}</span>
          </div>
          <p className="mb-4 line-clamp-3 text-sm text-white sm:text-base md:mb-6 md:line-clamp-4 md:text-lg">
            {featuredSeries.synopsis}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex min-w-[100px] cursor-pointer items-center justify-center rounded bg-white px-4 py-1.5 font-semibold text-black transition hover:bg-white/80 sm:px-6 sm:py-2 md:px-8"
            >
              <Icon icon="lucide:play" width={20} height={20} className="mr-1 sm:mr-2" />
              <span>Play</span>
            </button>
            <button
              type="button"
              className="flex min-w-[130px] cursor-pointer items-center justify-center rounded bg-gray-500/70 px-4 py-1.5 font-semibold text-white transition hover:bg-gray-500/50 sm:px-6 sm:py-2 md:px-8"
              onClick={() => setSelected(featuredSeries)}
            >
              <Icon icon="lucide:info" width={20} height={20} className="mr-1 sm:mr-2" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Rows overlap hero like deepanik */}
      <div className="relative z-20 -mt-32 md:-mt-40">
        <SeriesRow title="Trending Now" items={railFor('trending')} onSeriesClick={setSelected} />
        <SeriesRow title="Romance" items={railFor('romance')} onSeriesClick={setSelected} />
        <SeriesRow title="Vertical Scroll" items={railFor('scroll')} onSeriesClick={setSelected} />
        <SeriesRow title="Chat Novels" items={railFor('chat')} onSeriesClick={setSelected} />
        <SeriesRow title="E-books" items={railFor('ebook')} onSeriesClick={setSelected} />
        <SeriesRow title="All Titles" items={catalog} onSeriesClick={setSelected} />
      </div>

      {selected ? <SeriesModal series={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
