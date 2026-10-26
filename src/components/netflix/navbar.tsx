import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home' },
  { to: '/scroll', label: 'Scroll' },
  { to: '/chat', label: 'Chat novels' },
  { to: '/ebooks', label: 'E-books' },
  { to: '/new', label: 'New & Popular' },
  { to: '/my-list', label: 'My List' },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div className="pointer-events-none fixed top-0 z-[99] h-[70px] w-full bg-gradient-to-b from-black/80 to-transparent" />

      <nav
        className={cn(
          'fixed top-0 z-[100] flex h-[68px] w-full items-center transition-colors duration-500',
          scrolled ? 'bg-[#141414]' : 'bg-transparent',
        )}
      >
        <div className="flex w-full items-center justify-between px-4 md:px-[60px]">
          <div className="flex items-center">
            <Link to="/" className="mr-[25px] shrink-0">
              <span className="font-display text-[1.75rem] font-bold tracking-tight text-brand">
                LIBLO
              </span>
            </Link>

            <div className="hidden items-center md:flex">
              {links.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn('nav-link', isActive && 'font-semibold text-white')
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            <button
              type="button"
              className="cursor-pointer p-2 text-white md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              <Icon icon={mobileOpen ? 'lucide:x' : 'lucide:menu'} width={24} height={24} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="group/search relative flex h-9 w-[160px] items-center rounded-full border border-white/25 bg-black/40 pr-3 pl-3 transition-all duration-300 focus-within:w-[220px] focus-within:border-brand focus-within:bg-black/70 sm:w-[200px] sm:focus-within:w-[260px]">
              <Icon
                icon="lucide:search"
                width={16}
                height={16}
                className="shrink-0 text-white/70 transition-colors group-focus-within/search:text-brand"
              />
              <input
                type="search"
                placeholder="Search"
                className="ml-2 w-full min-w-0 bg-transparent text-[13px] text-white outline-none placeholder:text-white/50"
                aria-label="Search"
              />
            </label>

            <button
              type="button"
              className="relative cursor-pointer p-[10px] text-white transition-colors hover:text-[#e5e5e5]"
              aria-label="Notifications"
            >
              <Icon icon="lucide:bell" width={20} height={20} />
              <span className="absolute top-[2px] right-[2px] flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
                3
              </span>
            </button>

            <div className="group relative ml-[10px]">
              <div className="flex cursor-pointer items-center gap-2 py-[2px]">
                <img
                  src={user?.avatarUrl || '/covers/midnight-chat.jpg'}
                  alt=""
                  className="h-[32px] w-[32px] rounded object-cover"
                />
                <div className="mt-[2px] border-t-[4px] border-r-[4px] border-l-[4px] border-t-white border-r-transparent border-l-transparent transition-transform duration-200 group-hover:rotate-180" />
              </div>

              <div className="invisible absolute top-full right-0 pt-[8px] opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                <div className="min-w-[220px] border-t border-t-white/20 bg-[rgba(0,0,0,0.9)] py-[10px] shadow-xl">
                  <div className="flex items-center px-[10px] py-[5px] text-[13px] text-white">
                    <img
                      src={user?.avatarUrl || '/covers/midnight-chat.jpg'}
                      alt=""
                      className="mr-[10px] h-[32px] w-[32px] rounded object-cover"
                    />
                    <span>{user?.displayName || 'Reader'}</span>
                  </div>
                  <Link to="/account" className="dropdown-link">
                    Account
                  </Link>
                  <Link to="/writer" className="dropdown-link">
                    Writer studio
                  </Link>
                  <Link to="/help" className="dropdown-link">
                    Help Center
                  </Link>
                  <div className="my-[9px] h-px bg-[#737373]" />
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="dropdown-link w-full cursor-pointer text-left"
                  >
                    Sign out of Liblo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          'fixed inset-0 z-[90] bg-[#141414] transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex flex-col space-y-4 px-8 pt-[80px]">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-[16px] text-white"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/account" className="text-[16px] text-white" onClick={() => setMobileOpen(false)}>
            Account
          </Link>
          <Link to="/help" className="text-[16px] text-white" onClick={() => setMobileOpen(false)}>
            Help Center
          </Link>
        </div>
      </div>
    </>
  )
}
