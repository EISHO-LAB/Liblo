import { Link } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { listWriterSeries } from '@/data/writer-demo'
import { useAuth } from '@/lib/auth'
import '@/styles/writer.css'

export function WriterStudioPage() {
  const { user, applyAsWriter } = useAuth()
  if (!user) return null

  if (user.writerStatus === 'none') {
    return (
      <main className="writer-studio">
        <div className="writer-shell">
          <nav className="writer-crumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span aria-current="page">Writer studio</span>
          </nav>
          <div className="writer-gate writer-panel">
            <p className="writer-eyebrow">
              <span /> WRITER STUDIO
            </p>
            <h1>Publish on Liblo.</h1>
            <p>
              Scroll comics, chat novels, and e-books — start as a writer to open
              the studio and upload episodes.
            </p>
            <button type="button" className="writer-primary" onClick={applyAsWriter}>
              <Icon icon="lucide:pen-line" width={16} height={16} />
              Apply as writer
            </button>
          </div>
        </div>
      </main>
    )
  }

  const series = listWriterSeries()
  const published = series.filter((s) => s.status === 'published').length
  const drafts = series.filter((s) => s.status === 'draft').length
  const episodes = series.reduce((sum, s) => sum + s.episodeCount, 0)

  return (
    <main className="writer-studio">
      <div className="writer-shell">
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

        <div className="writer-section-head">
          <div>
            <p className="writer-eyebrow">CATALOG</p>
            <h2>Your series</h2>
            <p>Open a title to manage episodes or upload a new chapter.</p>
          </div>
        </div>

        <div className="writer-series-list">
          {series.map((item) => (
            <Link
              key={item.id}
              to={`/writer/series/${item.id}`}
              className="writer-series-card"
            >
              <img src={item.cover} alt="" width={88} height={118} />
              <div>
                <h3>{item.title}</h3>
                <p>
                  Updated{' '}
                  {new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'medium',
                    timeZone: 'Asia/Bangkok',
                  }).format(new Date(item.updatedAt))}
                </p>
                <div className="writer-series-meta">
                  <span className="writer-chip">{item.format}</span>
                  <span className="writer-chip">{item.episodeCount} episodes</span>
                  <span
                    className={`writer-status-pill ${
                      item.status === 'published' ? 'is-live' : 'is-draft'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
              <Icon icon="lucide:chevron-right" width={20} height={20} className="text-white/40" />
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-white/40">
          Demo studio — episode uploads are saved in this browser until studio APIs are wired.
        </p>
      </div>
    </main>
  )
}
