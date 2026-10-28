import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { SeriesHeroCover } from '@/components/writer/series-hero-cover'
import { formatViews } from '@/data/comic'
import { getOpenSourceTitle } from '@/data/opensource-titles'
import {
  getWriterSeries,
  listWriterEpisodes,
  type WriterEpisode,
  type WriterSeries,
} from '@/data/writer-demo'
import { useAuth } from '@/lib/auth'
import '@/styles/writer.css'

export function WriterSeriesPage() {
  const { user } = useAuth()
  const { seriesId = '' } = useParams()
  if (!user) return null
  if (user.writerStatus === 'none') return <Navigate to="/writer" replace />

  const initial = getWriterSeries(seriesId)
  if (!initial) {
    return (
      <main className="writer-studio">
        <div className="writer-shell">
          <div className="writer-panel writer-gate">
            <h1>Series not found</h1>
            <p>That title isn’t in your demo studio.</p>
            <Link to="/writer" className="writer-primary">
              Back to studio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return <SeriesWorkspace key={initial.id} seriesId={initial.id} />
}

function SeriesWorkspace({ seriesId }: { seriesId: string }) {
  const seed = getWriterSeries(seriesId)!
  const [series, setSeries] = useState(seed)
  const episodes = listWriterEpisodes(series.id)
  const views = series.views ?? 0
  const likes = series.likes ?? 0
  const d = new Date()

  return (
    <main className="ws-series-page">
      <nav className="ws-series-crumb" aria-label="Breadcrumb">
        <div className="ws-series-crumb-inner">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/writer">Writer studio</Link>
          <span>/</span>
          <span aria-current="page">{series.title}</span>
        </div>
      </nav>

      <section className="ws-series-hero" aria-label={`${series.title} editor`}>
        <div
          className="ws-series-hero-bg"
          style={{ backgroundImage: `url(${series.cover})` }}
        />
        <div className="ws-series-hero-fade" />
        <div className="ws-series-hero-body">
          <SeriesHeroCover series={series} onSeriesChange={setSeries} />

          <div className="ws-series-hero-copy">
            <p className="ws-series-kicker">
              <span />
              {series.status === 'published' ? 'PUBLISHED SERIES' : 'DRAFT SERIES'} · EDIT
            </p>
            <h1>{series.title}</h1>
            {series.subtitle ? <p className="ws-series-subtitle">{series.subtitle}</p> : null}

            <div className="ws-series-chips">
              <span className="ws-series-chip">{series.format}</span>
              <span
                className={`ws-series-chip is-status ${
                  series.status === 'published' ? 'is-live' : 'is-draft'
                }`}
              >
                {series.status}
              </span>
              <span className="ws-series-chip">
                {episodes.length} episode{episodes.length === 1 ? '' : 's'}
              </span>
              <span className="ws-series-chip">Cover 600×800</span>
            </div>

            <div className="ws-series-stats" aria-label="Series performance">
              <div className="ws-series-stat">
                <Icon icon="lucide:eye" width={18} height={18} />
                <div>
                  <strong>{formatViews(views)}</strong>
                  <span>Views</span>
                </div>
              </div>
              <div className="ws-series-stat">
                <Icon icon="lucide:heart" width={18} height={18} />
                <div>
                  <strong>{formatViews(likes)}</strong>
                  <span>Likes</span>
                </div>
              </div>
              <div className="ws-series-stat">
                <Icon icon="lucide:book-open" width={18} height={18} />
                <div>
                  <strong>{episodes.length}</strong>
                  <span>Episodes</span>
                </div>
              </div>
            </div>

            {series.synopsis ? (
              <p className="ws-series-synopsis">{series.synopsis}</p>
            ) : (
              <p className="ws-series-synopsis">
                Click the cover to swap your catalog image. Manage episodes below.
              </p>
            )}

            <div className="ws-series-actions">
              <Link
                to={`/writer/series/${series.id}/upload`}
                className="writer-primary"
              >
                <Icon icon="lucide:plus" width={16} height={16} />
                New episode
              </Link>
              <Link to="/writer" className="writer-ghost">
                Back to studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="ws-series-detail"
        aria-labelledby="ws-episodes-heading"
      >
        <div className="ws-series-detail-inner">
          <span className="m1-watermark m1-watermark-light" aria-hidden>
            EPISODES
          </span>

          <div className="relative mb-5 flex flex-wrap items-end justify-between gap-2">
            <h2
              id="ws-episodes-heading"
              className="flex items-center gap-2 font-display text-lg font-extrabold text-[#111] md:text-xl"
            >
              <Icon icon="lucide:list" width={20} height={20} className="text-m1" />
              Episodes
            </h2>
            <p className="text-[11px] font-semibold tracking-wide text-[#888]">
              UPDATE | {d.getMonth() + 1}.{String(d.getDate()).padStart(2, '0')}
            </p>
          </div>

          <div className="relative space-y-3">
            {episodes.length === 0 ? (
              <div className="ws-episode-empty">
                <Icon icon="lucide:book-open" width={28} height={28} />
                <p>No episodes yet. Add your first chapter below.</p>
              </div>
            ) : (
              episodes.map((ep) => (
                <EpisodeRow key={ep.id} series={series} episode={ep} />
              ))
            )}

            <Link
              to={`/writer/series/${series.id}/upload`}
              className="ws-episode-add"
            >
              <span className="ws-episode-add-icon" aria-hidden>
                <Icon icon="lucide:plus" width={22} height={22} />
              </span>
              <div>
                <strong>
                  {episodes.length
                    ? `Add episode ${episodes[episodes.length - 1]!.number + 1}`
                    : 'Add episode 1'}
                </strong>
                <p>Upload cut panels or a long strip for readers.</p>
              </div>
              <Icon
                icon="lucide:chevron-right"
                width={18}
                height={18}
                className="text-[#bbb]"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

function EpisodeRow({
  series,
  episode,
}: {
  series: WriterSeries
  episode: WriterEpisode
}) {
  const thumb = episodeThumb(series, episode)

  return (
    <Link
      to={`/writer/series/${series.id}/episodes/${episode.id}`}
      className="ws-episode-card"
    >
      <div className="ws-episode-thumb">
        <img src={thumb} alt="" />
        <span>{String(episode.number).padStart(2, '0')}</span>
      </div>
      <div>
        <h3>
          Ep. {episode.number} — {episode.title}
        </h3>
        <p>
          {episode.panelCount} panels
          {episode.uploadMode
            ? ` · ${episode.uploadMode === 'cuts' ? 'Cut panels' : 'Long strip'}`
            : ''}
          {' · '}
          {new Intl.DateTimeFormat('en-GB', {
            dateStyle: 'medium',
            timeZone: 'Asia/Bangkok',
          }).format(new Date(episode.updatedAt))}
          {' · '}
          Watch preview
        </p>
      </div>
      <span
        className={`writer-status-pill ${
          episode.status === 'published' ? 'is-live' : 'is-draft'
        }`}
      >
        {episode.status}
      </span>
      <span className="ws-episode-watch" aria-hidden>
        <Icon icon="lucide:play" width={14} height={14} />
        Watch
      </span>
    </Link>
  )
}

function episodeThumb(series: WriterSeries, episode: WriterEpisode) {
  if (series.id === 'ws-pepper-carrot') {
    const open = getOpenSourceTitle('pepper-and-carrot')
    const ep = open?.episodes.find((e) => e.number === episode.number)
    const panel = ep?.panels[1] ?? ep?.panels[0]
    if (panel) return panel.src
  }
  return series.cover
}
