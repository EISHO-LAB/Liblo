import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/icons/icon'
import { heroBanners } from '@/data/manga-one-en'
import { cn } from '@/lib/utils'

const N = heroBanners.length
/** How many card-widths fit in the viewport (edges clipped → ~5 peeks). */
const VISIBLE = 4.35
const GAP = 12

export function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const [stageW, setStageW] = useState(0)
  const [dragX, setDragX] = useState(0)
  const dragging = useRef(false)
  const startX = useRef(0)
  const pauseUntil = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)

  const go = useCallback((next: number) => {
    setIndex(((next % N) + N) % N)
    pauseUntil.current = Date.now() + 6000
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setStageW(el.clientWidth))
    ro.observe(el)
    setStageW(el.clientWidth)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      if (Date.now() < pauseUntil.current || dragging.current) return
      setIndex((i) => (i + 1) % N)
    }, 4200)
    return () => window.clearInterval(id)
  }, [])

  const cardW = stageW > 0 ? (stageW - GAP * (VISIBLE - 1)) / VISIBLE : 260
  const step = cardW + GAP
  // Center active card; side cards spill past edges and get clipped
  const baseX = stageW / 2 - cardW / 2 - index * step

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    startX.current = e.clientX
    setDragX(0)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    setDragX(e.clientX - startX.current)
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return
    dragging.current = false
    const dx = e.clientX - startX.current
    setDragX(0)
    const threshold = Math.max(36, cardW * 0.18)
    if (dx < -threshold) go(index + 1)
    else if (dx > threshold) go(index - 1)
  }

  const current = heroBanners[index]!

  return (
    <section className="relative overflow-hidden pt-[64px] lg:pt-[76px]">
      <div className="pointer-events-none absolute inset-0">
        <img
          key={current.id}
          src={current.image}
          alt=""
          className="h-full w-full scale-110 object-cover opacity-35 blur-2xl"
        />
        <div className="absolute inset-0 bg-[#111]/72" />
      </div>

      <div className="relative py-3 md:py-5">
        <div
          ref={stageRef}
          className="relative w-full touch-pan-y overflow-hidden select-none"
          style={{ height: cardW * (10 / 16) }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className={cn(
              'absolute top-0 left-0 flex h-full will-change-transform',
              !dragging.current && 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            )}
            style={{
              gap: GAP,
              transform: `translate3d(${baseX + dragX}px, 0, 0)`,
            }}
          >
            {heroBanners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                aria-label={b.title}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => {
                  if (Math.abs(dragX) > 10) return
                  go(i)
                }}
                className="relative h-full shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#222] shadow-[0_8px_28px_rgba(0,0,0,0.4)]"
                style={{ width: cardW }}
              >
                <img
                  src={b.image}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 truncate px-3 py-2 text-left text-[12px] font-bold text-white sm:text-[13px]">
                  {b.title}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(index - 1)
            }}
            className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 md:left-5"
            aria-label="Previous"
          >
            <Icon icon="lucide:chevron-left" width={22} height={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(index + 1)
            }}
            className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 md:right-5"
            aria-label="Next"
          >
            <Icon icon="lucide:chevron-right" width={22} height={22} />
          </button>
        </div>

        <div className="relative mt-3 flex items-center justify-center gap-1.5">
          {heroBanners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Go to ${b.title}`}
              onClick={() => go(i)}
              className={cn(
                'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/55',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
