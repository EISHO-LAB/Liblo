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

/** Shared ribbon number style — same size + font for 1/2/3 and TOP 5/10/25 */
export const RIBBON_NUM =
  'font-display text-[16px] font-black leading-none tracking-tight'

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
  const earW = 2.5 // very subtle outward flare
  const earH = 7
  const over = 3
  const right = 10
  // tip nearly flush with the side — barely angled out
  const tipDrop = over + 0.5

  return (
    <>
      {/* BACK — fold ears flare outward (มุมเอียงออก) + light wrap slivers */}
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
          d={`M${earW} ${over} L${earW - earW * 0.85} ${over + earH} L${earW} ${over + earH * 0.5} Z`}
          fill="#f3f3f3"
        />
        <path
          d={`M${earW + w} ${over} L${earW + w + earW * 0.85} ${over + earH} L${earW + w} ${over + earH * 0.5} Z`}
          fill="#f3f3f3"
        />
        {/* Dark fold ears — tip farther out so angle flares away from the ribbon */}
        <path
          d={`M${earW} 0 L0 ${tipDrop} L${earW} ${over + earH} Z`}
          fill={fold}
        />
        <path
          d={`M${earW + w} 0 L${earW * 2 + w} ${tipDrop} L${earW + w} ${over + earH} Z`}
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
            'absolute inset-x-0 flex flex-col items-center justify-center',
            'font-display font-black leading-none text-white',
            '[text-shadow:0_1px_1px_rgba(0,0,0,0.3)]',
          )}
          style={{ top: over + 3, bottom: 14 }}
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
          width={rank === 1 ? 22 : 20}
          height={rank === 1 ? 14 : 13}
          className="-mb-0.5 text-white"
        />
        <span className={RIBBON_NUM}>{rank}</span>
      </span>
    </CornerWrapRibbon>
  )
}
