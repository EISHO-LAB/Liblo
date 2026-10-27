import { Icon } from '@/components/icons/icon'
import { cn } from '@/lib/utils'

type Props = {
  rank: number
  className?: string
}

/** Medal tones — rich metallic fills + deeper fold ears */
const TONE: Record<number, { fill: string; fold: string }> = {
  1: { fill: '#f5c518', fold: '#c49200' }, // gold
  2: { fill: '#c0c4cc', fold: '#7a7e86' }, // silver
  3: { fill: '#d4783a', fold: '#9a4a1c' }, // bronze
}

/**
 * Number size locked to cover width (16px @ 168px recommend card).
 * Parent must be `@container/cover`.
 */
export const RIBBON_NUM =
  'font-display text-[9.5cqw] font-black leading-none tracking-tight'

/**
 * Chart ribbon — size + top overhang lock to cover width via `cqw`.
 * Looks the same on recommend (wide) and updates (tight grid).
 *
 * Parent shell: `@container/cover relative isolate overflow-visible`
 * Cover face:   `relative z-[1] overflow-hidden` (tight — no padding)
 *
 * Calibrated to recommend ~168px: w30 / h48 / right10 / over3.
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
  const earW = 2.5
  const earH = 7
  const over = 3
  const tipDrop = over + 0.5

  return (
    <>
      {/* BACK — fold ears */}
      <svg
        aria-hidden
        className={cn('pointer-events-none absolute z-0', className)}
        viewBox={`0 0 ${w + earW * 2} ${over + earH}`}
        preserveAspectRatio="none"
        style={{
          top: '-1.79cqw',
          right: '4.46cqw',
          width: '20.83cqw',
          height: '5.95cqw',
        }}
      >
        <path
          d={`M${earW} ${over} L${earW - earW * 0.85} ${over + earH} L${earW} ${over + earH * 0.5} Z`}
          fill="#f3f3f3"
        />
        <path
          d={`M${earW + w} ${over} L${earW + w + earW * 0.85} ${over + earH} L${earW + w} ${over + earH * 0.5} Z`}
          fill="#f3f3f3"
        />
        <path d={`M${earW} 0 L0 ${tipDrop} L${earW} ${over + earH} Z`} fill={fold} />
        <path
          d={`M${earW + w} 0 L${earW * 2 + w} ${tipDrop} L${earW + w} ${over + earH} Z`}
          fill={fold}
        />
      </svg>

      {/* FRONT — clean face */}
      <span
        className="pointer-events-none absolute z-[2] drop-shadow-[1px_2px_2px_rgba(0,0,0,0.28)]"
        style={{
          top: '-1.79cqw',
          right: '5.95cqw',
          width: '17.86cqw',
          height: '28.57cqw',
        }}
      >
        <svg
          aria-hidden
          viewBox={`0 0 ${w} ${h}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d={`M0 0 H${w} V${h - 12} L${w / 2} ${h} L0 ${h - 12} Z`}
            fill={fill}
          />
        </svg>

        <span
          className={cn(
            'absolute inset-x-0 flex flex-col items-center justify-center',
            'font-display font-black leading-none text-white',
            '[text-shadow:0_1px_1px_rgba(0,0,0,0.3)]',
          )}
          style={{ top: '12.5%', bottom: '29%' }}
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
      <span className="flex flex-col items-center leading-none">
        <Icon
          icon={rank === 1 ? 'game-icons:queen-crown' : 'mdi:crown'}
          className="-mb-[0.15cqw] text-white"
          style={{
            width: rank === 1 ? '13.1cqw' : '11.9cqw',
            height: rank === 1 ? '8.3cqw' : '7.7cqw',
          }}
        />
        <span className={RIBBON_NUM}>{rank}</span>
      </span>
    </CornerWrapRibbon>
  )
}
