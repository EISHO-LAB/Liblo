import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LibloLogo } from '@/components/brand/liblo-logo'

type Props = {
  children: ReactNode
}

export function AuthShell({ children }: Props) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#111]">
      <img
        src="/covers/midnight-chat.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-[#111]/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a33]/90 via-transparent to-[#111]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <nav className="flex justify-center px-6 py-6 md:px-12">
          <Link to="/login" aria-label="LIBLO">
            <LibloLogo className="text-[40px]" tone="m1" />
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-center px-4 pb-16">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a]/92 p-8 shadow-2xl backdrop-blur sm:p-12">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
