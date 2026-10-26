import { useEffect, useState } from 'react'
import { Icon } from '@/components/icons/icon'
import type { SeriesCard } from '@/data/catalog'
import { cn } from '@/lib/utils'

type Props = {
  items: SeriesCard[]
  onSelect?: (series: SeriesCard) => void
}

export function HeroBanner({ items, onSelect }: Props) {
  const slides = items.slice(0, 5)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5200)
    return () => window.clearInterval(id)
  }, [slides.length])

  const current = slides[index]
  if (!current) return null

  return (
    <section className="relative overflow-hidden pt-header">
      <div className="relative mx-auto max-w-6xl px-4 py-4 md:px-6 md:py-6">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl ring-1 ring-white/10 sm:aspect-[21/9]">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className={cn(
                'absolute inset-0 transition-opacity duration-700',
                i === index ? 'opacity-100' : 'opacity-0',
              )}
            >
              <img src={slide.coverUrl} alt="" className="h-full w-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-[#111]/30" />
            </div>
          ))}

          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:max-w-[55%] md:justify-center md:p-10">
            <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
              <Icon icon="lucide:sparkles" width={12} height={12} />
              Featured
            </span>
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              {current.title}
            </h1>
            <p className="mt-2 line-clamp-2 text-sm text-white/70 sm:text-base">{current.synopsis}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(26,122,255,0.35)] transition hover:bg-brand-bright"
              >
                <Icon icon="lucide:book-open" width={16} height={16} />
                Read free
              </button>
              <button
                type="button"
                onClick={() => onSelect?.(current)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/12 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Details
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'h-1.5 cursor-pointer rounded-full transition-all',
                i === index ? 'w-6 bg-brand' : 'w-1.5 bg-white/30 hover:bg-white/50',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
