import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LibloLogo } from '@/components/brand/liblo-logo'
import { Icon } from '@/components/icons/icon'
import { navLinks } from '@/data/nav'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        {/* Desktop — white pill bar like Manga One */}
        <div className="hidden px-6 pt-3 lg:block">
          <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between rounded-full bg-[#f2f2f2] px-5 shadow-sm">
            <div className="flex items-center gap-6">
              <Link to="/" aria-label="LIBLO home">
                <LibloLogo className="text-[26px]" />
              </Link>
              <nav className="flex items-center gap-4">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    to={l.href}
                    className="text-[13px] font-bold text-[#111] transition hover:text-m1"
                  >
                    {l.label}
                    {l.external ? (
                      <Icon
                        icon="lucide:external-link"
                        width={11}
                        height={11}
                        className="ml-1 inline opacity-50"
                      />
                    ) : null}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={user ? '/account' : '/login'}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-black px-3 text-[12px] font-bold text-white"
              >
                <Icon icon="lucide:user-round-plus" width={16} height={16} />
                {user ? user.displayName : 'Login / Sign up'}
              </Link>
              <Link
                to="/search"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white"
                aria-label="Search"
              >
                <Icon icon="lucide:search" width={18} height={18} />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-black text-white"
                aria-label="Menu"
              >
                <Icon icon="lucide:menu" width={18} height={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex h-14 items-center justify-between bg-[#111]/95 px-3 backdrop-blur lg:hidden">
          <Link
            to={user ? '/account' : '/login'}
            className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1.5 text-[11px] font-bold text-[#111]"
          >
            <Icon icon="lucide:user-round-plus" width={14} height={14} />
            Login
          </Link>
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1">
            <LibloLogo className="text-[22px]" />
          </Link>
          <div className="flex gap-1.5">
            <Link
              to="/search"
              className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-[#2a2a2a] text-[9px] font-bold text-white"
            >
              <Icon icon="lucide:search" width={16} height={16} />
              Search
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center rounded-lg bg-[#2a2a2a] text-[9px] font-bold text-white"
            >
              <Icon icon="lucide:menu" width={16} height={16} />
              Menu
            </button>
          </div>
        </div>
      </header>

      {/* Side menu */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-black/60 transition-opacity',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        aria-hidden={!menuOpen}
        className={cn(
          'fixed top-0 right-0 z-[70] flex h-full w-[min(360px,92vw)] flex-col bg-[#1a1a1a] transition-transform duration-300',
          menuOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <LibloLogo className="text-[24px]" />
          <button
            type="button"
            className="cursor-pointer p-2 text-white"
            onClick={() => setMenuOpen(false)}
            aria-label="Close"
          >
            <Icon icon="lucide:x" width={22} height={22} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {[
            { label: 'Home', href: '/' },
            ...navLinks,
            { label: 'News', href: '/help' },
            { label: 'How to use', href: '/help' },
            { label: 'My page', href: '/account' },
          ].map((l) => (
            <Link
              key={l.label}
              to={l.href}
              onClick={() => setMenuOpen(false)}
              className="mb-1 flex items-center justify-between rounded-lg px-4 py-3 text-[15px] font-bold text-white hover:bg-white/5"
            >
              {l.label}
              <img src="/m1/assets/navigation-arrow.svg" alt="" className="h-3 opacity-50" />
            </Link>
          ))}
        </nav>
        {user ? (
          <button
            type="button"
            onClick={() => {
              logout()
              setMenuOpen(false)
            }}
            className="m-4 cursor-pointer rounded-full bg-m1 py-3 text-sm font-bold text-white"
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="m-4 rounded-full bg-m1 py-3 text-center text-sm font-bold text-white"
          >
            Login / Sign up
          </Link>
        )}
      </aside>
    </>
  )
}
