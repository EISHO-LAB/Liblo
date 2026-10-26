import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LibloLogo } from '@/components/brand/liblo-logo'
import { Icon } from '@/components/icons/icon'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home' },
  { to: '/comic', label: 'Comic' },
  { to: '/chat', label: 'Chat novels' },
  { to: '/ebooks', label: 'E-books' },
  { to: '/new', label: 'Ranking' },
  { to: '/my-list', label: 'My List' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="fixed top-0 z-[100] h-[56px] w-full bg-[#111]/92 backdrop-blur-md">
        <div className="relative mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          {/* Left — account */}
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1.5 text-[12px] font-medium text-white/90 transition hover:bg-brand/20 hover:text-white"
          >
            <Icon icon="lucide:user" width={14} height={14} className="text-brand-bright" />
            <span className="hidden sm:inline">{user?.displayName || 'Account'}</span>
          </Link>

          {/* Center — logo */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="LIBLO home"
          >
            <LibloLogo className="text-[28px] sm:text-[32px]" />
          </Link>

          {/* Right — search + menu */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white transition hover:bg-white/10"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Icon icon="lucide:search" width={20} height={20} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition hover:border-brand hover:bg-brand/15"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <Icon icon={menuOpen ? 'lucide:x' : 'lucide:menu'} width={20} height={20} />
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div className="border-t border-white/8 bg-[#111] px-4 py-3">
            <label className="mx-auto flex max-w-6xl items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 focus-within:border-brand">
              <Icon icon="lucide:search" width={16} height={16} className="text-brand-bright" />
              <input
                autoFocus
                type="search"
                placeholder="Search titles, genres…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                aria-label="Search"
              />
            </label>
          </div>
        ) : null}
      </header>

      {/* Slide menu — Manga One style */}
      <div
        className={cn(
          'fixed inset-0 z-[90] bg-[#111]/70 transition-opacity duration-300',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={cn(
          'fixed top-0 right-0 z-[95] flex h-full w-[min(320px,88vw)] flex-col bg-[#1a1a1a] shadow-2xl transition-transform duration-300',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <LibloLogo className="text-[24px]" />
          <button
            type="button"
            className="cursor-pointer rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <Icon icon="lucide:x" width={20} height={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'mb-1 flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium transition',
                  isActive
                    ? 'bg-brand/15 text-brand-bright'
                    : 'text-white/85 hover:bg-white/6 hover:text-white',
                )
              }
            >
              {link.label}
              <img src="/manga-ui/navigation-arrow.svg" alt="" className="h-3 w-3 opacity-45" />
            </NavLink>
          ))}
          <div className="my-3 h-px bg-white/8" />
          <Link
            to="/writer"
            onClick={() => setMenuOpen(false)}
            className="mb-1 flex items-center justify-between rounded-xl px-4 py-3 text-[15px] text-white/85 hover:bg-white/6"
          >
            Writer studio
            <img src="/manga-ui/navigation-arrow.svg" alt="" className="h-3 w-3 opacity-45" />
          </Link>
          <Link
            to="/help"
            onClick={() => setMenuOpen(false)}
            className="mb-1 flex items-center justify-between rounded-xl px-4 py-3 text-[15px] text-white/85 hover:bg-white/6"
          >
            Help
            <img src="/manga-ui/navigation-arrow.svg" alt="" className="h-3 w-3 opacity-45" />
          </Link>
        </nav>

        <button
          type="button"
          onClick={onSignOut}
          className="m-4 cursor-pointer rounded-full border border-brand bg-brand/10 py-3 text-sm font-semibold text-brand-bright transition hover:bg-brand hover:text-white"
        >
          Sign out
        </button>
      </aside>
    </>
  )
}
