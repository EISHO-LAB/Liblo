import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons/icon'
import type { SeriesCard } from '@/data/catalog'
import { cn } from '@/lib/utils'

type Props = {
  title: string
  items: SeriesCard[]
  onSeriesClick?: (series: SeriesCard) => void
}

export function SeriesRow({ title, items, onSeriesClick }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)
  const [dragging, setDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const dragStart = useRef(0)

  const updateArrows = useCallback(() => {
    const slider = sliderRef.current
    if (!slider) return
    setShowLeft(slider.scrollLeft > 0)
    setShowRight(slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1)
  }, [])

  const scrollByDir = (dir: 'left' | 'right') => {
    const slider = sliderRef.current
    if (!slider) return
    const amount = slider.clientWidth * 0.75
    slider.scrollTo({
      left: dir === 'left' ? slider.scrollLeft - amount : slider.scrollLeft + amount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return
    slider.addEventListener('scroll', updateArrows)
    updateArrows()
    return () => slider.removeEventListener('scroll', updateArrows)
  }, [items, updateArrows])

  return (
    <div className="group/row mb-8">
      <h2 className="mb-4 px-4 font-display text-xl font-bold text-white md:px-[60px] md:text-2xl">
        {title}
      </h2>

      <div className="relative">
        {showLeft ? (
          <button
            type="button"
            className="absolute top-0 bottom-0 left-0 z-50 flex w-10 cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 md:w-14"
            onClick={() => scrollByDir('left')}
            aria-label={`Scroll ${title} left`}
          >
            <Icon icon="lucide:chevron-left" width={28} height={28} className="text-white" />
          </button>
        ) : null}

        <div className="relative -mx-4 overflow-hidden px-4 md:-mx-[60px] md:px-[60px]">
          <div
            ref={sliderRef}
            className={cn(
              'scrollbar-hide flex gap-2 overflow-x-scroll scroll-smooth',
              dragging ? 'cursor-grabbing select-none' : 'cursor-grab',
            )}
            onMouseDown={(e) => {
              if (!sliderRef.current) return
              setDragging(true)
              setStartX(e.pageX - sliderRef.current.offsetLeft)
              setScrollLeft(sliderRef.current.scrollLeft)
              dragStart.current = Date.now()
            }}
            onMouseMove={(e) => {
              if (!dragging || !sliderRef.current) return
              e.preventDefault()
              const x = e.pageX - sliderRef.current.offsetLeft
              sliderRef.current.scrollLeft = scrollLeft - (x - startX) * 2
            }}
            onMouseLeave={() => setDragging(false)}
            onMouseUp={() => setDragging(false)}
          >
            {items.map((series) => (
              <div
                key={series.id}
                className="group/item relative w-[140px] flex-none md:w-[160px]"
                draggable={false}
                onMouseUp={() => {
                  if (Date.now() - dragStart.current < 150) onSeriesClick?.(series)
                }}
              >
                <div className="relative h-[200px] overflow-hidden rounded-lg transition-all duration-300 group-hover/item:z-50 group-hover/item:scale-110 group-hover/item:shadow-xl md:h-[240px]">
                  <img
                    src={series.coverUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black via-black/80 to-transparent p-4 transition-transform duration-300 group-hover/item:translate-y-0">
                    <div className="mb-3 flex items-center gap-2 opacity-0 transition-opacity delay-100 duration-300 group-hover/item:opacity-100">
                      <button
                        type="button"
                        className="flex cursor-pointer items-center justify-center rounded-full bg-white p-1.5 transition hover:scale-110 hover:bg-white/80"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Play"
                      >
                        <Icon icon="lucide:play" width={16} height={16} className="text-black" />
                      </button>
                      <button
                        type="button"
                        className="flex cursor-pointer items-center justify-center rounded-full border-2 border-white/40 p-1.5 transition hover:scale-110 hover:border-white"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Add to list"
                      >
                        <Icon icon="lucide:plus" width={16} height={16} className="text-white" />
                      </button>
                      <button
                        type="button"
                        className="flex cursor-pointer items-center justify-center rounded-full border-2 border-white/40 p-1.5 transition hover:scale-110 hover:border-white"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Like"
                      >
                        <Icon icon="lucide:thumbs-up" width={16} height={16} className="text-white" />
                      </button>
                    </div>

                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white opacity-0 transition-opacity delay-150 duration-300 group-hover/item:opacity-100">
                      <span className="border border-white/40 px-1">{series.quality}</span>
                      <span>{series.year}</span>
                      <span className="text-white/70">{series.seasons}</span>
                    </div>

                    <div className="space-y-2 opacity-0 transition-opacity delay-200 duration-300 group-hover/item:opacity-100">
                      <p className="text-sm font-semibold text-white">{series.title}</p>
                      <p className="line-clamp-2 text-xs text-gray-300">{series.synopsis}</p>
                    </div>

                    <button
                      type="button"
                      className="absolute right-4 bottom-4 flex cursor-pointer items-center justify-center rounded-full bg-[#2F2F2F]/60 p-1.5 opacity-0 transition group-hover/item:opacity-100 hover:scale-110 hover:bg-[#2F2F2F]"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSeriesClick?.(series)
                      }}
                      aria-label="More info"
                    >
                      <Icon icon="lucide:info" width={20} height={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showRight ? (
          <button
            type="button"
            className="absolute top-0 right-0 bottom-0 z-50 flex w-10 cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 md:w-14"
            onClick={() => scrollByDir('right')}
            aria-label={`Scroll ${title} right`}
          >
            <Icon icon="lucide:chevron-right" width={28} height={28} className="text-white" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
