import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SeriesModal } from '@/components/netflix/series-modal'
import { catalog, type SeriesCard } from '@/data/catalog'

/** Mock saved list — first 3 titles */
const saved = catalog.slice(0, 3)

export function MyListPage() {
  const [selected, setSelected] = useState<SeriesCard | null>(null)

  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-16">
      <div className="px-4 md:px-[60px]">
        <h1 className="mb-8 font-display text-3xl font-bold text-white md:text-4xl">My List</h1>

        {saved.length === 0 ? (
          <div className="mt-20 text-center text-netflix-gray">
            <p className="text-xl">Your list is empty</p>
            <p className="mt-2">Add shows and novels to your list to read them later</p>
            <Link to="/" className="mt-6 inline-block text-brand hover:underline">
              Browse home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {saved.map((series) => (
              <button
                key={series.id}
                type="button"
                className="group cursor-pointer text-left"
                onClick={() => setSelected(series)}
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={series.coverUrl}
                    alt=""
                    className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 truncate text-sm text-white">{series.title}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected ? <SeriesModal series={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
