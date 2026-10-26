import { cn } from '@/lib/utils'

export type TicketTagTone = 'special' | 'notice' | 'oneshot'

type Props = {
  children: React.ReactNode
  tone?: TicketTagTone
  className?: string
}

const TONE: Record<TicketTagTone, string> = {
  special: 'bg-[#e625d6]',
  notice: 'bg-[#2b5ce7]',
  oneshot: 'bg-[#2b5ce7]',
}

/**
 * Ticket-stub tag — concave circular bites at all 4 corners
 * (same container style as Manga One SPECIAL / notice / One-shot labels).
 */
export function ComicTicketTag({ children, tone = 'special', className }: Props) {
  return (
    <span
      className={cn(
        'comic-ticket-tag inline-flex items-center justify-center px-3 py-[4px]',
        'font-sans text-[10px] font-semibold leading-none tracking-[0.02em] text-white antialiased',
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
