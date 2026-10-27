import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { SeriesCoverUpload } from '@/components/writer/series-cover-upload'
import { getWriterSeries, listWriterEpisodes } from '@/data/writer-demo'
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

  return (
    <main className="writer-studio">
      <div className="writer-shell">
        <nav className="writer-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/writer">Writer studio</Link>
          <span>/</span>
          <span aria-current="page">{series.title}</span>
        </nav>

        <header className="writer-intro">
          <div className="flex items-start gap-5">
            <img
              src={series.cover}
              alt=""
              className="h-[140px] w-[104px] rounded-xl object-cover"
            />
            <div>
              <p className="writer-eyebrow">
                <span /> {series.format} SERIES
              </p>
              <h1>{series.title}</h1>
              <p className="writer-intro-copy">
                Set universal cover sizes first, then upload episode cuts or a long strip.
              </p>
              <div className="writer-series-meta">
                <span
                  className={`writer-status-pill ${
                    series.status === 'published' ? 'is-live' : 'is-draft'
                  }`}
                >
                  {series.status}
                </span>
                <span className="writer-chip">{episodes.length} episodes</span>
                <span className="writer-chip">Cover 600×800</span>
              </div>
            </div>
          </div>
          <Link to={`/writer/series/${series.id}/upload`} className="writer-primary">
            New episode
            <Icon icon="lucide:plus" width={16} height={16} />
          </Link>
        </header>

        <SeriesCoverUpload series={series} onSeriesChange={setSeries} />

        <div className="writer-section-head">
          <div>
            <p className="writer-eyebrow">EPISODES</p>
            <h2>Chapter list</h2>
            <p>Drafts stay private until you publish.</p>
          </div>
        </div>

        <div className="writer-panel writer-episode-table">
          {episodes.length === 0 ? (
            <div className="writer-empty">
              <Icon icon="lucide:book-open" width={28} height={28} className="mx-auto mb-3" />
              <p>No episodes yet. Upload your first chapter.</p>
              <Link
                to={`/writer/series/${series.id}/upload`}
                className="writer-primary mt-4 inline-flex"
              >
                Upload episode
              </Link>
            </div>
          ) : (
            episodes.map((ep) => {
              const body = (
                <>
                  <div className="writer-episode-num">
                    {String(ep.number).padStart(2, '0')}
                  </div>
                  <div>
                    <h3>{ep.title}</h3>
                    <p>
                      {ep.panelCount} panels
                      {ep.uploadMode
                        ? ` · ${ep.uploadMode === 'cuts' ? 'Cut panels' : 'Long strip'}`
                        : ''}
                      {' · '}
                      {new Intl.DateTimeFormat('en-GB', {
                        dateStyle: 'medium',
                        timeZone: 'Asia/Bangkok',
                      }).format(new Date(ep.updatedAt))}
                    </p>
                  </div>
                  <span
                    className={`writer-status-pill ${
                      ep.status === 'published' ? 'is-live' : 'is-draft'
                    }`}
                  >
                    {ep.status}
                  </span>
                </>
              )
              return ep.readHref ? (
                <Link key={ep.id} to={ep.readHref} className="writer-episode-row">
                  {body}
                </Link>
              ) : (
                <div key={ep.id} className="writer-episode-row">
                  {body}
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
