import { cn } from '@/lib/utils'

export type TicketTagTone = 'original' | 'special' | 'notice' | 'oneshot'

type Props = {
  children: React.ReactNode
  tone?: TicketTagTone
  className?: string
}

const TONE: Record<TicketTagTone, string> = {
  original: 'bg-[#e1203c]',
  special: 'bg-[#e625d6]',
  notice: 'bg-[#2b5ce7]',
  oneshot: 'bg-[#2b5ce7]',
}

/**
 * Simple ORIGINAL / label badge — soft rounded, white stroke.
 * Place with `-translate-y-1/2` on the card top edge to straddle the border.
 */
export function ComicTicketTag({ children, tone = 'original', className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md px-2 py-[3px]',
        'border-2 border-white font-sans text-[9px] font-bold leading-none tracking-[0.04em] text-white',
        'shadow-[0_1px_3px_rgba(0,0,0,0.25)]',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
