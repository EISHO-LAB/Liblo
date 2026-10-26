import { cn } from '@/lib/utils'

type Props = {
  className?: string
  markOnly?: boolean
  tone?: 'm1' | 'blue'
}

/**
 * Text wordmark — LIBLO (speech-bubble “O”).
 */
export function LibloLogo({ className, markOnly = false, tone = 'm1' }: Props) {
  const color = tone === 'blue' ? '#1A7AFF' : '#F6334F'

  if (markOnly) {
    return (
      <span className={cn('inline-flex leading-none', className)} aria-label="LIBLO" style={{ color }}>
        <BubbleO className="h-[1em] w-[1em]" />
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-display text-[1em] font-extrabold tracking-[-0.08em] leading-none select-none',
        className,
      )}
      aria-label="LIBLO"
      style={{ color }}
    >
      LIBL
      <BubbleO className="relative -top-[0.02em] ml-[0.02em] inline-block h-[0.88em] w-[0.88em]" />
    </span>
  )
}

/** Letter O drawn as a chat bubble — the logo’s signature glyph. */
function BubbleO({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-hidden
    >
      <path
        d="M32 3.5C15.7 3.5 2.5 15.8 2.5 31c0 8.9 5.2 16.7 13.1 21.4L9.5 60.5 23 54.2c2.8.7 5.8 1.1 9 1.1 16.3 0 29.5-12.3 29.5-24.3S48.3 3.5 32 3.5Z"
        fill="currentColor"
      />
      <ellipse cx="32" cy="30" rx="14" ry="13" fill="#fff" />
    </svg>
  )
}
