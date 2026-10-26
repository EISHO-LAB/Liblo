import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function AuthShell({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="/covers/midnight-chat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <nav className="px-6 py-5 md:px-12">
          <Link to="/login" className="font-display text-3xl font-bold tracking-tight text-brand">
            LIBLO
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-md rounded-md bg-black/75 p-8 shadow-2xl sm:p-12">{children}</div>
        </div>
      </div>
    </div>
  )
}
