import { Icon as IconifyIcon, type IconProps } from '@iconify/react'
import { cn } from '@/lib/utils'

type Props = IconProps & {
  className?: string
}

/** Project icon primitive — use this everywhere instead of ad-hoc icon imports. */
export function Icon({ className, width = 20, height = 20, ...props }: Props) {
  return (
    <IconifyIcon
      width={width}
      height={height}
      className={cn('shrink-0', className)}
      {...props}
    />
  )
}
