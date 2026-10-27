import {
  CategoryRanking,
  DayRanking,
  HeroCarousel,
  RankDivider,
  RecommendRail,
  TodayUpdates,
} from '@/components/comic'
import { SiteFooter } from '@/components/layout'
import {
  comicsShelf,
  oneShots,
  originals,
  recommended,
} from '@/data/comic'

/** Comics product tab — vertical comics home. */
export function ComicPage() {
  return (
    <div className="min-h-screen bg-[#111]">
      <div className="flex h-dvh flex-col overflow-hidden">
        <div className="m1-dot-bg shrink-0">
          <HeroCarousel />
        </div>
        <DayRanking className="flex min-h-0 flex-1 flex-col" />
      </div>

      <RankDivider />
      <CategoryRanking />

      <TodayUpdates />

      <RecommendRail
        title="Recommended titles"
        watermark="RECOMMEND"
        items={recommended}
        light
      />

      <div className="m1-dot-bg">
        <RecommendRail title="LIBLO originals" watermark="ORIGINAL" items={originals} />
      </div>

      <RecommendRail title="One-shots" watermark="ONESHOT" items={oneShots} light />

      <div className="m1-dot-bg pb-4">
        <RecommendRail title="Comics" watermark="COMICS" items={comicsShelf} />

        <section className="relative mx-auto mt-10 max-w-[1200px] overflow-hidden px-4 md:px-6">
          <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-2xl bg-[#1a1a1a] px-6 py-10 md:flex-row md:justify-between">
            <img
              src="/m1/assets/home/movie-section/rectangle-left-sp.svg"
              alt=""
              className="pointer-events-none absolute top-0 left-0 h-full opacity-80"
            />
            <img
              src="/m1/assets/home/movie-section/rectangle-right-sp.svg"
              alt=""
              className="pointer-events-none absolute top-0 right-0 h-full opacity-80"
            />
            <div className="relative z-10 max-w-md">
              <p className="text-sm font-bold tracking-wide text-m1-soft uppercase">Featured PR</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-white md:text-3xl">
                LIBLO pick titles — trailer zone
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Highlighted series promo clips. Swap in your own videos when you adapt the catalog.
              </p>
            </div>
            <img
              src="/m1/assets/home/movie-section/cerberus-kun.png"
              alt=""
              className="relative z-10 h-36 w-auto md:h-44"
            />
          </div>
        </section>

        <section className="mx-auto mt-10 flex max-w-[1200px] flex-wrap items-end justify-center gap-8 px-4 py-8 md:px-6">
          <img
            src="/m1/assets/home/content-section/ninki-manga-no.png"
            alt="Popular manga"
            className="h-16 w-auto opacity-90"
          />
          <img src="/m1/assets/home/content-section/choitashi.png" alt="" className="h-20 w-auto" />
          <img src="/m1/assets/character/cerberus-kun.webp" alt="" className="h-24 w-auto" />
        </section>
      </div>

      <SiteFooter />
    </div>
  )
}
