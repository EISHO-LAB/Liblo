import { Link } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { listWriterSeries, type WriterSeries } from '@/data/writer-demo'
import { useAuth } from '@/lib/auth'
import '@/styles/writer.css'

export function WriterStudioPage() {
  const { user, applyAsWriter } = useAuth()
  if (!user) return null

  if (user.writerStatus === 'none') {
    return (
      <main className="writer-studio writer-studio-split">
        <div className="writer-top m1-dot-bg">
          <div className="writer-shell writer-shell-top">
            <nav className="writer-crumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span aria-current="page">Writer studio</span>
            </nav>
            <header className="writer-intro">
              <div>
                <p className="writer-eyebrow">
                  <span /> WRITER STUDIO
                </p>
                <h1>Publish on Liblo.</h1>
                <p className="writer-intro-copy">
                  Scroll comics, chat novels, and e-books — start as a writer to open
                  the studio and upload episodes.
                </p>
              </div>
            </header>
          </div>
        </div>

        <section className="writer-content-band">
          <div className="writer-shell writer-shell-band">
            <span className="m1-watermark m1-watermark-light" aria-hidden>
              STUDIO
            </span>
            <div className="relative mx-auto max-w-md text-center">
              <h2 className="font-display text-xl font-extrabold text-[#111] md:text-2xl">
                Become a Liblo writer
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#888]">
                Apply once. When you’re approved, manage series, covers, and episode
                uploads from this studio.
              </p>
              <button
                type="button"
                className="writer-primary mt-6 inline-flex"
                onClick={applyAsWriter}
              >
                <Icon icon="lucide:pen-line" width={16} height={16} />
                Apply as writer
              </button>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const series = listWriterSeries()
  const published = series.filter((s) => s.status === 'published').length
  const drafts = series.filter((s) => s.status === 'draft').length
  const episodes = series.reduce((sum, s) => sum + s.episodeCount, 0)
  const d = new Date()

  return (
    <main className="writer-studio writer-studio-split">
      {/* Dark top — same role as comic hero */}
      <div className="writer-top m1-dot-bg">
        <div className="writer-shell writer-shell-top">
          <nav className="writer-crumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span aria-current="page">Writer studio</span>
          </nav>

          <header className="writer-intro">
            <div>
              <p className="writer-eyebrow">
                <span /> WRITER STUDIO
              </p>
              <h1>
                Your next
                <br />
                <span>chapter</span> starts here.
              </h1>
              <p className="writer-intro-copy">
                Manage series, upload cut panels or a long strip, and keep every
                episode ready for readers.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`writer-status-pill ${
                  user.writerStatus === 'approved' ? 'is-live' : 'is-pending'
                }`}
              >
                {user.writerStatus === 'approved' ? 'Approved' : 'Pending review'}
              </span>
              {series[0] ? (
                <Link
                  to={`/writer/series/${series[0].id}/upload`}
                  className="writer-primary"
                >
                  Upload episode
                  <Icon icon="lucide:upload" width={16} height={16} />
                </Link>
              ) : null}
            </div>
          </header>

          <div className="writer-grid">
            <div className="writer-stat">
              <p>Series</p>
              <strong>{series.length}</strong>
            </div>
            <div className="writer-stat">
              <p>Episodes</p>
              <strong>{episodes}</strong>
            </div>
            <div className="writer-stat">
              <p>Live / drafts</p>
              <strong>
                {published}
                <span className="text-lg font-semibold text-white/40"> / {drafts}</span>
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* White content — same role as comic Weekly ranking */}
      <section className="writer-content-band" aria-labelledby="writer-series-heading">
        <div className="writer-shell writer-shell-band">
          <span className="m1-watermark m1-watermark-light" aria-hidden>
            SERIES
          </span>

          <div className="relative mb-5 flex flex-wrap items-end justify-between gap-2">
            <h2
              id="writer-series-heading"
              className="flex items-center gap-2 font-display text-lg font-extrabold text-[#111] md:text-xl"
            >
              <Icon icon="lucide:pen-line" width={20} height={20} className="text-m1" />
              Your series
            </h2>
            <p className="text-[11px] font-semibold tracking-wide text-[#888]">
              UPDATE | {d.getMonth() + 1}.{String(d.getDate()).padStart(2, '0')}
            </p>
          </div>

          {series.length === 0 ? (
            <p className="relative py-16 text-center text-sm text-[#888]">
              No series yet. Create one from the studio tools when ready.
            </p>
          ) : (
            <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {series.map((item, i) => (
                <SeriesCoverCard key={item.id} series={item} index={i} />
              ))}
            </div>
          )}

          <p className="relative mt-10 text-center text-[11px] text-[#aaa]">
            Demo studio — episode uploads are saved in this browser until studio APIs are
            wired.
          </p>
        </div>
      </section>
    </main>
  )
}

function SeriesCoverCard({
  series,
  index,
}: {
  series: WriterSeries
  index: number
}) {
  return (
    <Link to={`/writer/series/${series.id}`} className="writer-cover-card group relative min-w-0">
      <div className="relative overflow-visible">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#eee] ring-1 ring-black/8">
          <img
            src={series.cover}
            alt=""
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
          <span
            className={`absolute top-1.5 left-1.5 z-[2] rounded-[2px] px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-white ${
              series.status === 'published' ? 'bg-[#22c55e]' : 'bg-[#5a5a5a]'
            }`}
          >
            {series.status === 'published' ? 'LIVE' : 'DRAFT'}
          </span>
          <span className="absolute right-1.5 bottom-1.5 rounded-[2px] bg-black/55 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-white backdrop-blur-sm">
            {series.format}
          </span>
        </div>
        <span className="writer-series-rank" aria-hidden>
          {index + 1}
        </span>
      </div>
      <p className="mt-3 truncate text-[12px] font-extrabold text-[#111]">
        {series.title}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2 text-[10px] font-semibold text-[#888]">
        <span>{series.episodeCount} eps</span>
        <span>
          {new Intl.DateTimeFormat('en-GB', {
            month: 'short',
            day: 'numeric',
            timeZone: 'Asia/Bangkok',
          }).format(new Date(series.updatedAt))}
        </span>
      </div>
    </Link>
  )
}
