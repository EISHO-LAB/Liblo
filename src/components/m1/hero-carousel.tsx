import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from '@/components/icons/icon'
import { heroBanners } from '@/data/manga-one-en'
import { cn } from '@/lib/utils'

const N = heroBanners.length
/** Exactly 3 cards on screen — others slide in. */
const VISIBLE = 3
const GAP = 14
const COPIES = 3
const MID = N

export function HeroCarousel() {
  const [index, setIndex] = useState(MID)
  const [stageW, setStageW] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [noAnim, setNoAnim] = useState(false)
  const dragging = useRef(false)
  const startX = useRef(0)
  const pauseUntil = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)

  const slides = useMemo(
    () =>
      Array.from({ length: COPIES }, (_, copy) =>
        heroBanners.map((b) => ({ ...b, key: `${copy}-${b.id}` })),
      ).flat(),
    [],
  )

  const logical = ((index % N) + N) % N

  const jumpTo = useCallback((next: number) => {
    setIndex(next)
    pauseUntil.current = Date.now() + 6000
  }, [])

  const go = useCallback(
    (dir: -1 | 1) => {
      jumpTo(index + dir)
    },
    [index, jumpTo],
  )

  useEffect(() => {
    if (index >= N && index < N * 2) return
    const t = window.setTimeout(() => {
      setNoAnim(true)
      setIndex(((index % N) + N) % N + N)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setNoAnim(false))
      })
    }, 500)
    return () => window.clearTimeout(t)
  }, [index])

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
      setIndex((i) => i + 1)
    }, 4200)
    return () => window.clearInterval(id)
  }, [])

  const sidePad = 16
  const innerW = Math.max(0, stageW - sidePad * 2)
  const cardW = innerW > 0 ? (innerW - GAP * (VISIBLE - 1)) / VISIBLE : 280
  const step = cardW + GAP
  const baseX = sidePad - index * step

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
    const threshold = Math.max(40, cardW * 0.2)
    if (dx < -threshold) go(1)
    else if (dx > threshold) go(-1)
  }

  const current = heroBanners[logical]!

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

      <div className="relative py-4 md:py-6">
        <div
          ref={stageRef}
          className="relative mx-auto w-full max-w-[1200px] touch-pan-y overflow-hidden select-none"
          style={{ height: cardW * (10 / 16) }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className={cn(
              'absolute top-0 left-0 flex h-full will-change-transform',
              !dragging.current &&
                !noAnim &&
                'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            )}
            style={{
              gap: GAP,
              transform: `translate3d(${baseX + dragX}px, 0, 0)`,
            }}
          >
            {slides.map((b) => (
              <button
                key={b.key}
                type="button"
                aria-label={b.title}
                onClick={() => {
                  if (Math.abs(dragX) > 10) return
                  // find index of this clone
                  const idx = slides.findIndex((s) => s.key === b.key)
                  if (idx >= 0) jumpTo(idx)
                }}
                className="relative h-full shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#222] shadow-[0_8px_28px_rgba(0,0,0,0.4)]"
                style={{ width: cardW }}
              >
                <img src={b.image} alt="" draggable={false} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <p className="absolute inset-x-0 bottom-0 truncate px-3 py-2.5 text-left text-[12px] font-bold text-white sm:text-[13px]">
                  {b.title}
                </p>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(-1)
            }}
            className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 md:left-3"
            aria-label="Previous"
          >
            <Icon icon="lucide:chevron-left" width={22} height={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              go(1)
            }}
            className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75 md:right-3"
            aria-label="Next"
          >
            <Icon icon="lucide:chevron-right" width={22} height={22} />
          </button>
        </div>

        <div className="relative mt-4 flex items-center justify-center gap-1.5">
          {heroBanners.map((b, i) => (
            <button
              key={b.id}
              type="button"
              aria-label={`Go to ${b.title}`}
              onClick={() => jumpTo(i + N)}
              className={cn(
                'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                i === logical ? 'w-6 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/55',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
