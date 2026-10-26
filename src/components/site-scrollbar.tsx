import { useEffect, useRef } from 'react'

/**
 * Document scrollbar — short 2px mark, no rounding
 * (same idea as ttianqii-web-original SiteScrollbar).
 */
export function SiteScrollbar() {
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const thumb = thumbRef.current
    if (!thumb) return

    let frame = 0

    const update = () => {
      const root = document.documentElement
      const max = root.scrollHeight - root.clientHeight
      if (max <= 1) {
        thumb.style.opacity = '0'
        return
      }
      const view = root.clientHeight
      const pad = 24
      const track = Math.max(0, view - pad * 2)
      const size = Math.min(track, Math.max(48, (view / root.scrollHeight) * track))
      const y = pad + (root.scrollTop / max) * (track - size)
      thumb.style.opacity = '1'
      thumb.style.height = `${size}px`
      thumb.style.transform = `translate3d(0, ${y}px, 0)`
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const observer = new ResizeObserver(onScroll)
    observer.observe(document.body)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      aria-hidden
      data-site-scrollbar
      className="pointer-events-none fixed top-0 right-[7px] z-[200] h-dvh w-[2px] mix-blend-difference"
    >
      <div ref={thumbRef} className="absolute inset-x-0 top-0 bg-white opacity-0" />
    </div>
  )
}
