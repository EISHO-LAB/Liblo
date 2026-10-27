import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

/**
 * Translucent ORIGINAL mark — MagaPocket “独占” style (top-left on cover).
 */
export function CoverOriginalBadge({ className }: Props) {
  return (
    <span
      className={cn(
        'absolute top-1.5 left-1.5 z-[2] inline-flex items-center justify-center',
        'rounded-sm bg-black/55 px-1.5 py-[3px] backdrop-blur-[2px]',
        'font-sans text-[8px] font-extrabold tracking-[0.06em] text-white',
        className,
      )}
    >
      ORIGINAL
    </span>
  )
}
