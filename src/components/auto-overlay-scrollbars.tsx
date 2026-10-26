import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Thumb = {
  key: string
  top: number
  left: number
  height: number
  thumbH: number
  thumbY: number
}

const PAD = 12
const MIN = 36
const RIGHT_INSET = 4

function canScrollY(el: HTMLElement) {
  const style = window.getComputedStyle(el)
  const oy = style.overflowY
  if (oy !== 'auto' && oy !== 'scroll' && oy !== 'overlay') return false
  if (style.display === 'none' || style.visibility === 'hidden') return false
  return el.scrollHeight > el.clientHeight + 1
}

function skip(el: HTMLElement) {
  if (!el.isConnected) return true
  if (el === document.documentElement || el === document.body) return true
  if (el.hasAttribute('data-site-scrollbar')) return true
  if (el.closest('[data-hq-scroll-thumb="off"]')) return true
  return false
}

/** Nested overflow panes — same 2px difference mark as SiteScrollbar. */
export function AutoOverlayScrollbars() {
  const [thumbs, setThumbs] = useState<Thumb[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const tracked = new Map<HTMLElement, string>()
    let seq = 0
    let raf = 0
    let scanTimer = 0

    const measure = () => {
      const next: Thumb[] = []
      for (const [el, key] of tracked) {
        if (!el.isConnected || skip(el) || !canScrollY(el)) continue
        const rect = el.getBoundingClientRect()
        if (rect.width < 8 || rect.height < 24) continue
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue

        const max = el.scrollHeight - el.clientHeight
        const track = Math.max(0, rect.height - PAD * 2)
        const size = Math.min(track, Math.max(MIN, (rect.height / el.scrollHeight) * track))
        const y = PAD + (el.scrollTop / max) * (track - size)
        next.push({
          key,
          top: rect.top,
          left: rect.right - RIGHT_INSET - 2,
          height: rect.height,
          thumbH: size,
          thumbY: y,
        })
      }
      setThumbs(next)
    }

    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }

    const watch = (el: HTMLElement) => {
      if (tracked.has(el) || skip(el)) return
      const style = window.getComputedStyle(el)
      const oy = style.overflowY
      if (oy !== 'auto' && oy !== 'scroll' && oy !== 'overlay') return
      tracked.set(el, `hq-scroll-${seq++}`)
      el.addEventListener('scroll', schedule, { passive: true })
    }

    const scan = () => {
      for (const [el] of tracked) {
        if (!el.isConnected) {
          el.removeEventListener('scroll', schedule)
          tracked.delete(el)
        }
      }
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
      let node = walker.nextNode()
      while (node) {
        watch(node as HTMLElement)
        node = walker.nextNode()
      }
      schedule()
    }

    const queueScan = () => {
      window.clearTimeout(scanTimer)
      scanTimer = window.setTimeout(scan, 80)
    }

    scan()
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, { passive: true })
    const mo = new MutationObserver(queueScan)
    mo.observe(document.body, { childList: true, subtree: true, attributes: true })

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(scanTimer)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule)
      mo.disconnect()
      for (const [el] of tracked) {
        el.removeEventListener('scroll', schedule)
      }
    }
  }, [])

  if (!mounted) return null

  return createPortal(
    <>
      {thumbs.map((t) => (
        <div
          key={t.key}
          aria-hidden
          className="pointer-events-none fixed z-[199] w-[2px] mix-blend-difference"
          style={{ top: t.top, left: t.left, height: t.height }}
        >
          <div
            className="absolute inset-x-0 bg-white"
            style={{
              height: t.thumbH,
              transform: `translate3d(0, ${t.thumbY}px, 0)`,
            }}
          />
        </div>
      ))}
    </>,
    document.body,
  )
}
