import { cn } from '@/lib/utils'

type Props = {
  rank: number
  className?: string
}

const TONE: Record<number, { fill: string; fold: string }> = {
  1: { fill: '#f0c12e', fold: '#b8860b' },
  2: { fill: '#c8c8c8', fold: '#8a8a8a' },
  3: { fill: '#e08a3c', fold: '#a85a18' },
}

function Crown() {
  return (
    <svg viewBox="0 0 20 14" className="mb-px h-[7px] w-[10px]" aria-hidden>
      <path
        d="M2 12.5h16L16.2 5.2 12.5 9.2 10 3.2 7.5 9.2 3.8 5.2 2 12.5Z"
        fill="#fff"
        strokeLinejoin="round"
      />
      <circle cx="3.8" cy="5" r="1.1" fill="#fff" />
      <circle cx="10" cy="3" r="1.2" fill="#fff" />
      <circle cx="16.2" cy="5" r="1.1" fill="#fff" />
    </svg>
  )
}

/**
 * Ribbon badge matching the reference wrap:
 *
 *        ╱╲          dark fold ears (behind)
 *   ─────████─────   clean face peeks above card
 *        ████
 *        ████
 *         ◇          swallowtail
 *
 * Parent: `relative isolate overflow-visible`
 * Cover:  `relative z-[1] overflow-hidden`
 */
export function CornerWrapRibbon({
  fill,
  fold,
  className,
  children,
}: {
  fill: string
  fold: string
  tab?: string
  className?: string
  children: React.ReactNode
}) {
  const w = 30
  const h = 48
  const earW = 7
  const earH = 9
  const over = 7
  const right = 10

  return (
    <>
      {/* BACK — fold ears + light wrap slivers (outside the ribbon width) */}
      <svg
        aria-hidden
        className={cn('pointer-events-none absolute z-0', className)}
        width={w + earW * 2}
        height={over + earH}
        viewBox={`0 0 ${w + earW * 2} ${over + earH}`}
        style={{
          top: -over,
          right: right - earW,
          width: w + earW * 2,
          height: over + earH,
        }}
      >
        {/* Light slivers under the ears */}
        <path
          d={`M${earW} ${over} L${earW - earW} ${over + earH} L${earW} ${over + earH * 0.55} Z`}
          fill="#f3f3f3"
        />
        <path
          d={`M${earW + w} ${over} L${earW + w + earW} ${over + earH} L${earW + w} ${over + earH * 0.55} Z`}
          fill="#f3f3f3"
        />
        {/* Dark fold ears — peek out left/right behind the face */}
        <path
          d={`M${earW} 0 L0 ${over + 2} L${earW} ${over + earH} Z`}
          fill={fold}
        />
        <path
          d={`M${earW + w} 0 L${earW * 2 + w} ${over + 2} L${earW + w} ${over + earH} Z`}
          fill={fold}
        />
      </svg>

      {/* FRONT — clean face only (no triangles on it) */}
      <span
        className="pointer-events-none absolute z-[2] drop-shadow-[1px_2px_2px_rgba(0,0,0,0.28)]"
        style={{ top: -over, right, width: w, height: h }}
      >
        <svg
          aria-hidden
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="absolute inset-0"
        >
          <path
            d={`M0 0 H${w} V${h - 12} L${w / 2} ${h} L0 ${h - 12} Z`}
            fill={fill}
          />
        </svg>

        <span
          className={cn(
            'absolute inset-x-0 flex flex-col items-center justify-center gap-px',
            'font-display text-[11px] font-black leading-none text-white',
            '[text-shadow:0_1px_1px_rgba(0,0,0,0.3)]',
          )}
          style={{ top: over + 1, bottom: 13 }}
        >
          {children}
        </span>
      </span>
    </>
  )
}

/** Ranks 1–3 gold / silver / bronze ribbon. */
export function RankRibbonBadge({ rank, className }: Props) {
  if (rank < 1 || rank > 3) return null
  const tone = TONE[rank]

  return (
    <CornerWrapRibbon fill={tone.fill} fold={tone.fold} className={className}>
      {rank === 1 ? <Crown /> : null}
      {rank}
    </CornerWrapRibbon>
  )
}
