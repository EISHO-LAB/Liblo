import {
  CornerWrapRibbon,
  RankRibbonBadge,
  RIBBON_NUM,
} from '@/components/comic/rank-ribbon'
import type { ComicTitle } from '@/data/comic'
import { cn } from '@/lib/utils'

type Props = {
  title: ComicTitle
  className?: string
}

/** Chart ladder tones — hot → warm → cool by reach */
const TOP_TONE: Record<5 | 10 | 25, { fill: string; fold: string }> = {
  5: { fill: '#e1203c', fold: '#9a1028' }, // LIBLO red — hottest
  10: { fill: '#ff5a2e', fold: '#c23a14' }, // flame orange
  25: { fill: '#5b6abf', fold: '#3a458a' }, // soft indigo
}

/**
 * Chart mark — vertical ribbon wrapping over cover top edge:
 * 1–3 gold/silver/bronze · 4–5 TOP/5 · 6–10 TOP/10 · 11–25 TOP/25
 */
export function CoverChartBadge({ title, className }: Props) {
  const rank = title.chartRank
  if (rank == null || rank > 25) return null

  if (rank <= 3) {
    return <RankRibbonBadge rank={rank} className={className} />
  }

  const n = (rank <= 5 ? 5 : rank <= 10 ? 10 : 25) as 5 | 10 | 25
  const tone = TOP_TONE[n]

  return (
    <CornerWrapRibbon fill={tone.fill} fold={tone.fold} className={className}>
      <span className="flex flex-col items-center leading-none">
        <span className="font-display text-[4.2cqw] font-extrabold tracking-[0.08em]">TOP</span>
        <span className={cn(RIBBON_NUM)}>{n}</span>
      </span>
    </CornerWrapRibbon>
  )
}
