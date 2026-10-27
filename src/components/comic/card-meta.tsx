import { Icon } from '@/components/icons/icon'
import type { ComicTitle } from '@/data/comic'
import { formatViews } from '@/data/comic'
import { cn } from '@/lib/utils'

type Props = {
  title: ComicTitle
  /** Dark text for light backgrounds. */
  light?: boolean
  className?: string
}

/**
 * Writer + compact view score under a card title (no description).
 */
export function ComicCardMeta({ title, light = false, className }: Props) {
  return (
    <div
      className={cn(
        'mt-0.5 flex min-w-0 items-center justify-between gap-2 text-[11px]',
        light ? 'text-[#888]' : 'text-white/50',
        className,
      )}
    >
      <p className="min-w-0 truncate font-medium">{title.writer}</p>
      <p
        className={cn(
          'inline-flex shrink-0 items-center gap-0.5 font-semibold tabular-nums',
          light ? 'text-[#aaa]' : 'text-white/40',
        )}
      >
        <Icon icon="lucide:eye" width={11} height={11} className="opacity-80" />
        {formatViews(title.views)}
      </p>
    </div>
  )
}
