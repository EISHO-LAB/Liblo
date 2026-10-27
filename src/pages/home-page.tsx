import { Link } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { ComicCardMeta, ComicTitleLine, CoverChartBadge, CoverOriginalBadge } from '@/components/comic'
import { SiteFooter } from '@/components/layout'
import { catalog as comicCatalog, heroBanners } from '@/data/comic'
import { railFor } from '@/data/catalog'
import { cn } from '@/lib/utils'

const PRODUCTS = [
  {
    id: 'comics',
    label: 'Comics',
    href: '/comic',
    blurb: 'Vertical scroll stories — binge anytime.',
    icon: 'lucide:book-image',
    cover: comicCatalog[0]?.cover ?? '/m1/portrait/p01.webp',
    tone: 'from-[#F6334F]/90 to-[#111]/40',
  },
  {
    id: 'chat',
    label: 'Chat novels',
    href: '/chat',
    blurb: 'Conversation-first stories that feel live.',
    icon: 'lucide:messages-square',
    cover: railFor('chat')[0]?.coverUrl ?? '/covers/midnight-chat.jpg',
    tone: 'from-[#2f6bff]/90 to-[#111]/40',
  },
  {
    id: 'ebooks',
    label: 'E-books',
    href: '/ebooks',
    blurb: 'Long-form reading for deeper worlds.',
    icon: 'lucide:book-open',
    cover: railFor('ebook')[0]?.coverUrl ?? comicCatalog[2]?.cover ?? '/m1/portrait/p03.webp',
    tone: 'from-[#111]/20 to-[#111]/80',
  },
  {
    id: 'oneshots',
    label: 'One-shots',
    href: '/oneshots',
    blurb: 'Complete in one sitting.',
    icon: 'lucide:sparkles',
    cover: comicCatalog[5]?.cover ?? '/m1/portrait/p06.webp',
    tone: 'from-[#e8a838]/85 to-[#111]/50',
  },
] as const

const spotlight = heroBanners.slice(0, 4)

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#111]">
      {/* Brand hero — multi-product hub */}
      <section className="relative overflow-hidden pt-[64px] lg:pt-[76px]">
        <div className="pointer-events-none absolute inset-0">
          <img
            src={spotlight[0]?.image}
            alt=""
            className="h-full w-full scale-110 object-cover opacity-30 blur-2xl"
          />
          <div className="absolute inset-0 bg-[#111]/78" />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-4 py-14 md:px-6 md:py-20">
          <p className="text-[12px] font-bold tracking-[0.22em] text-m1-soft uppercase">
            LIBLO library
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.05] text-white md:text-6xl">
            Stories across
            <span className="text-m1"> every format</span>
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/65 md:text-base">
            Comics, chat novels, e-books, and one-shots — pick a product tab and start reading.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/comic"
              className="inline-flex items-center gap-2 rounded-lg bg-m1 px-5 py-3 text-sm font-bold text-white"
            >
              Open Comics
              <Icon icon="lucide:arrow-right" width={16} height={16} />
            </Link>
            <Link
              to="/titles"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/16"
            >
              Browse all titles
            </Link>
          </div>
        </div>
      </section>

      {/* Product tabs */}
      <section className="relative bg-white">
        <div className="relative mx-auto max-w-[1200px] px-4 py-10 md:px-6 md:py-12">
          <span className="m1-watermark m1-watermark-light">PRODUCTS</span>
          <div className="relative mb-6 flex items-end justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold text-[#111] md:text-2xl">
              Choose a product
            </h2>
            <p className="text-[11px] font-semibold tracking-wide text-[#888]">
              LIBLO · multi-format
            </p>
          </div>

          <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p) => (
              <Link
                key={p.id}
                to={p.href}
                className="group relative overflow-hidden rounded-xl bg-[#111] ring-1 ring-black/10"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={p.cover}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className={cn('absolute inset-0 bg-gradient-to-t', p.tone)} />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur-sm">
                      <Icon icon={p.icon} width={18} height={18} />
                    </span>
                    <h3 className="font-display text-xl font-extrabold text-white">{p.label}</h3>
                    <p className="mt-1 text-[12px] leading-snug text-white/75">{p.blurb}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick rails */}
      <section className="m1-dot-bg">
        <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-6">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-display text-lg font-extrabold text-white md:text-xl">
              Jump back in
            </h2>
            <Link to="/comic" className="text-[12px] font-bold text-m1-soft hover:text-m1">
              Comics home →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {comicCatalog.slice(0, 6).map((t) => (
              <Link key={t.id} to="/comic" className="min-w-0">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#2a2a2a]">
                  <img src={t.cover} alt="" className="h-full w-full object-cover object-top" />
                  {t.isOriginal ? <CoverOriginalBadge /> : null}
                  <CoverChartBadge title={t} />
                </div>
                <ComicTitleLine title={t} className="mt-2" />
                <ComicCardMeta title={t} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
