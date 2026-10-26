import { useState } from 'react'
import { SeriesModal } from '@/components/netflix/series-modal'
import { SeriesRow } from '@/components/netflix/series-row'
import { catalog, railFor, type SeriesCard } from '@/data/catalog'

type Props = {
  title: string
  categoryId?: string
  description?: string
}

export function BrowsePage({ title, categoryId, description }: Props) {
  const [selected, setSelected] = useState<SeriesCard | null>(null)
  const items = categoryId ? railFor(categoryId) : catalog

  return (
    <div className="min-h-screen bg-[#111] pt-header pb-16">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 text-sm text-white/55">{description}</p> : null}
      </div>

      <SeriesRow title={title} items={items} onSeriesClick={setSelected} />

      {!categoryId ? (
        <>
          <SeriesRow title="Romance" items={railFor('romance')} onSeriesClick={setSelected} />
          <SeriesRow title="Chat novels" items={railFor('chat')} onSeriesClick={setSelected} />
          <SeriesRow title="Comics" items={railFor('scroll')} onSeriesClick={setSelected} />
          <SeriesRow title="E-books" items={railFor('ebook')} onSeriesClick={setSelected} />
        </>
      ) : null}

      {selected ? <SeriesModal series={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
