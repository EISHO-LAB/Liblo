import { Link } from 'react-router-dom'
import { LibloLogo } from '@/components/brand/liblo-logo'
import { navLinks } from '@/data/manga-one-en'

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-[#0c0c0c]">
      {/* CTA band */}
      <div
        className="relative overflow-hidden px-4 py-10 md:px-6"
        style={{
          backgroundImage: 'url(/m1/assets/footer/bg.cta-sp.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div
            className="rounded-lg bg-[url(/m1/assets/footer/bg.logo-rect.svg)] bg-[length:100%_100%] bg-no-repeat px-4 py-3"
          >
            <LibloLogo className="text-[28px]" />
          </div>
          <div className="max-w-md">
            <p className="font-display text-lg font-extrabold text-white">
              Original comics & novels — read free every day
            </p>
            <p className="mt-1 text-sm text-white/70">
              Excitement, emotion, passion. Fresh stories, daily updates.
            </p>
          </div>
          <div className="flex gap-2">
            <img src="/m1/assets/app-download/app-store.png" alt="App Store" className="h-10 w-auto" />
            <img src="/m1/assets/app-download/google-play.png" alt="Google Play" className="h-10 w-auto" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 md:grid-cols-3 md:px-6">
        <div>
          <p className="mb-3 text-xs font-bold tracking-wider text-white/40 uppercase">Browse</p>
          {navLinks.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="mb-2 flex items-center justify-between text-sm font-semibold text-white/85 hover:text-m1"
            >
              {l.label}
              <img src="/m1/assets/navigation-arrow.svg" alt="" className="h-2.5 opacity-40" />
            </Link>
          ))}
        </div>
        <div>
          <p className="mb-3 text-xs font-bold tracking-wider text-white/40 uppercase">Support</p>
          {['News', 'How to use', 'Contact', 'FAQ', 'Terms', 'Privacy'].map((l) => (
            <Link
              key={l}
              to="/help"
              className="mb-2 flex items-center justify-between text-sm font-semibold text-white/85 hover:text-m1"
            >
              {l}
              <img src="/m1/assets/navigation-arrow.svg" alt="" className="h-2.5 opacity-40" />
            </Link>
          ))}
        </div>
        <div className="flex flex-col items-start gap-3">
          <img src="/m1/assets/character/cerberus-kun.webp" alt="" className="h-24 w-auto" />
          <img src="/m1/assets/footer/ABJ.png" alt="ABJ" className="h-8 w-auto opacity-80" />
          <p className="text-[11px] leading-relaxed text-white/45">
            LIBLO delivers licensed digital comics and novels. Content shown here is for product UI
            prototyping from a local mirror of manga-one.com — replace with your catalog later.
          </p>
        </div>
      </div>

      <div className="border-t border-white/8 py-4 text-center text-[11px] text-white/35">
        Copyright © LIBLO — UI layout cloned from Manga One for adaptation
      </div>
    </footer>
  )
}
