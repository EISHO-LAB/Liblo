import { cn } from '@/lib/utils'

/**
 * Decorative rule between Weekly ranking and Category ranking.
 * Hollow end circles + centered dotted line.
 */
export function RankDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn('relative bg-white', className)}
      role="separator"
      aria-hidden
    >
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-4 py-5 md:gap-4 md:px-6 md:py-6">
        <span className="size-2.5 shrink-0 rounded-full border-2 border-[#9a9a9a] bg-white" />
        <span
          className="h-[3px] min-w-0 flex-1"
          style={{
            backgroundImage:
              'radial-gradient(circle, #9a9a9a 1.35px, transparent 1.5px)',
            backgroundSize: '11px 3px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat-x',
          }}
        />
        <span className="size-1.5 shrink-0 rounded-full bg-[#9a9a9a]" />
        <span
          className="h-[3px] min-w-0 flex-1"
          style={{
            backgroundImage:
              'radial-gradient(circle, #9a9a9a 1.35px, transparent 1.5px)',
            backgroundSize: '11px 3px',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat-x',
          }}
        />
        <span className="size-2.5 shrink-0 rounded-full border-2 border-[#9a9a9a] bg-white" />
      </div>
    </div>
  )
}
