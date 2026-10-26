import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { days, rankingPool, todayKey } from '@/data/manga-one-en'

const ordinals = [
  '1st',
  '2nd',
  '3rd',
  '4th',
  '5th',
  '6th',
  '7th',
  '8th',
  '9th',
  '10th',
  '11th',
  '12th',
  '13th',
  '14th',
  '15th',
]

export function DayRanking() {
  const [day, setDay] = useState(todayKey())
  const d = new Date()
  const dayLabel = days.find((x) => x.key === day)?.label ?? 'Tue'

  const items = useMemo(() => {
    // rotate pool by weekday so each day looks different
    const offset = days.findIndex((x) => x.key === day)
    return [...rankingPool.slice(offset), ...rankingPool.slice(0, offset)].slice(0, 15)
  }, [day])

  return (
    <section className="relative mx-auto mt-10 max-w-[1200px] px-4 md:px-6">
      <span className="m1-watermark">RANK</span>
      <div className="relative mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-white md:text-xl">
          <span aria-hidden>🔥</span>
          {dayLabel} update ranking
        </h2>
        <p className="text-[11px] font-semibold tracking-wide text-white/45">
          UPDATE | {d.getMonth() + 1}.{String(d.getDate()).padStart(2, '0')}
        </p>
      </div>

      <div className="relative mb-4 flex overflow-hidden rounded-lg bg-[#2a2a2a]">
        {days.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setDay(x.key)}
            className={`flex-1 cursor-pointer py-2.5 text-center text-[12px] font-extrabold transition sm:text-sm ${
              day === x.key ? 'bg-m1 text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="relative scrollbar-hide flex gap-3 overflow-x-auto pb-2">
        {items.map((t, i) => (
          <Link key={`${day}-${t.id}`} to="/comic" className="w-[140px] shrink-0 sm:w-[160px]">
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-lg bg-cover bg-center"
              style={{ backgroundImage: 'url(/m1/assets/home/day-of-week-update-ranking-section/bg-card.png)' }}
            >
              <img
                src={t.cover}
                alt=""
                className="absolute inset-[8%_8%_20%] h-[72%] w-[84%] rounded-md object-cover shadow-lg"
              />
              <img
                src={`/m1/assets/ranking/${ordinals[i]}.svg`}
                alt={`#${i + 1}`}
                className="absolute bottom-2 left-2 h-7 w-auto"
              />
              {t.isOriginal ? (
                <img
                  src="/m1/assets/home/day-of-week-update-ranking-section/badge/original.svg"
                  alt="Original"
                  className="absolute top-2 right-2 h-5"
                />
              ) : null}
            </div>
            <p className="mt-2 line-clamp-2 text-[12px] font-bold text-white">{t.title}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
