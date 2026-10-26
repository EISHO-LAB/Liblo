import { Link } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { todayUpdates } from '@/data/manga-one-en'

export function TodayUpdates() {
  const d = new Date()
  const label = `Today’s updates!! ${d.getMonth() + 1}/${d.getDate()} (${d.toLocaleDateString('en-US', { weekday: 'short' })})`

  return (
    <section className="relative mt-0 bg-white">
      {/* soft top fade from dark hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[#111]/15 to-transparent" />

      <div className="relative mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10">
        <span className="m1-watermark m1-watermark-light">UPDATE</span>

        <div className="relative mb-5 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-extrabold text-[#111] md:text-xl">{label}</h2>
          <Link to="/new" className="see-more-btn shrink-0">
            See more
            <img src="/m1/assets/home/todays-updated-section/more-arrow.svg" alt="" className="h-2.5" />
          </Link>
        </div>

        <div className="relative scrollbar-hide flex gap-3 overflow-x-auto pb-1">
          {todayUpdates.map((t) => (
            <Link key={t.id} to="/comic" className="w-[128px] shrink-0 sm:w-[148px]">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#eee] shadow-sm ring-1 ring-black/5">
                <img src={t.cover} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="mt-2 space-y-0.5">
                {t.isUp ? <span className="up-badge">UP</span> : null}
                <p className="line-clamp-2 text-[12px] font-bold leading-snug text-[#111]">{t.title}</p>
                <p className="flex items-center gap-1 text-[11px] text-[#888]">
                  {t.chapter}
                  <Icon icon="lucide:book-marked" width={11} height={11} className="opacity-70" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
