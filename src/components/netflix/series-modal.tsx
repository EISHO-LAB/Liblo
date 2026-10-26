import { Icon } from '@/components/icons/icon'
import type { SeriesCard } from '@/data/catalog'

type Props = {
  series: SeriesCard
  onClose: () => void
}

export function SeriesModal({ series, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <button
          type="button"
          className="fixed inset-0 cursor-pointer bg-black/70 transition-opacity"
          aria-label="Close"
          onClick={onClose}
        />

        <div className="relative inline-block w-full max-w-4xl text-left align-middle transition-all sm:my-8">
          <div className="relative rounded-lg bg-[#181818] shadow-xl">
            <button
              type="button"
              className="absolute top-4 right-4 z-10 cursor-pointer rounded-full bg-[#181818] p-2 transition-colors hover:bg-[#303030]"
              onClick={onClose}
              aria-label="Close modal"
            >
              <Icon icon="lucide:x" width={24} height={24} className="text-white" />
            </button>

            <div className="relative aspect-video">
              <img
                src={series.coverUrl}
                alt=""
                className="h-full w-full rounded-t-lg object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#181818]/60 to-[#181818]" />

              <div className="absolute right-0 bottom-0 left-0 p-6 md:p-8">
                <h2 className="mb-4 font-display text-2xl font-bold text-white md:text-4xl">
                  {series.title}
                </h2>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    className="flex min-w-[100px] cursor-pointer items-center justify-center rounded bg-white px-8 py-2 font-semibold text-black transition hover:bg-white/80"
                  >
                    <Icon icon="lucide:play" width={20} height={20} className="mr-2" />
                    Play
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-white">
                <span>
                  {series.year} · {series.seasons}
                </span>
                <span className="border border-white/40 px-1 text-xs">{series.quality}</span>
                <span className="text-white/70">{series.format}</span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {series.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-white/10 px-2.5 py-1 text-xs text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mb-6 text-sm text-white md:text-base">{series.synopsis}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
