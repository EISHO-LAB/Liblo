import { CornerWrapRibbon, RankRibbonBadge } from '@/components/comic/rank-ribbon'
import type { ComicTitle } from '@/data/comic'

type Props = {
  title: ComicTitle
  className?: string
}

type TopKind = 'TOP5' | 'TOP10' | 'TOP25'

const TOP_TONE: Record<TopKind, { fill: string; fold: string }> = {
  TOP5: { fill: '#e1203c', fold: '#9a1028' },
  TOP10: { fill: '#e1203c', fold: '#9a1028' },
  TOP25: { fill: '#5a5a5a', fold: '#2e2e2e' },
}

/**
 * Chart mark — vertical ribbon wrapping over cover top edge:
 * 1–3 gold/silver/bronze · 4–5 TOP5 · 6–10 TOP10 · 11–25 TOP25
 */
export function CoverChartBadge({ title, className }: Props) {
  const rank = title.chartRank
  if (rank == null || rank > 25) return null

  if (rank <= 3) {
    return <RankRibbonBadge rank={rank} className={className} />
  }

  const label: TopKind = rank <= 5 ? 'TOP5' : rank <= 10 ? 'TOP10' : 'TOP25'
  const tone = TOP_TONE[label]

  return (
    <CornerWrapRibbon fill={tone.fill} fold={tone.fold} className={className}>
      <span className="font-sans text-[7px] font-extrabold tracking-wide">{label}</span>
    </CornerWrapRibbon>
  )
}
