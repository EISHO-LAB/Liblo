import { Link, Navigate, useParams } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { getOpenSourceTitle } from '@/data/opensource-titles'
import {
  getWriterSeries,
  listWriterEpisodes,
} from '@/data/writer-demo'
import { useAuth } from '@/lib/auth'
import '@/styles/writer.css'
import '@/styles/writer-reader.css'

/** Writer-only episode preview — scroll comic reader inside the studio. */
export function WriterEpisodePage() {
  const { user } = useAuth()
  const { seriesId = '', episodeId = '' } = useParams()
  if (!user) return null
  if (user.writerStatus === 'none') return <Navigate to="/writer" replace />

  const series = getWriterSeries(seriesId)
  if (!series) return <Navigate to="/writer" replace />

  const episodes = listWriterEpisodes(series.id)
  const episode = episodes.find((e) => e.id === episodeId)
  if (!episode) {
    return <Navigate to={`/writer/series/${series.id}`} replace />
  }

  const panels = resolveEpisodePanels(series.id, episode.number)
  const prev = episodes.find((e) => e.number === episode.number - 1)
  const next = episodes.find((e) => e.number === episode.number + 1)
  const seriesHref = `/writer/series/${series.id}`

  return (
    <main className="writer-reader-page">
      <div className="writer-reader-bar">
        <Link to={seriesHref}>
          <Icon icon="lucide:arrow-left" width={14} height={14} />
          {series.title}
        </Link>
        <strong>
          Ep. {episode.number} · {episode.title}
        </strong>
        <span className="writer-reader-badge">
          {episode.status === 'published' ? 'Published' : 'Draft'} · writer preview
        </span>
      </div>

      <div
        className="writer-reader-strip"
        aria-label={`${episode.title} panels`}
      >
        {panels.length > 0 ? (
          panels.map((panel) => (
            <img
              key={panel.src}
              src={panel.src}
              alt={panel.alt}
              width={panel.width}
              height={panel.height}
            />
          ))
        ) : (
          <div className="writer-reader-empty">
            <Icon icon="lucide:image-off" width={32} height={32} />
            <h2>No preview panels yet</h2>
            <p>
              This draft has no saved cut images in the demo. Re-upload the episode
              to preview the scroll reader.
            </p>
            <Link
              to={`/writer/series/${series.id}/upload`}
              className="writer-primary inline-flex"
            >
              Upload panels
            </Link>
          </div>
        )}
      </div>

      <footer className="writer-reader-end">
        <p>
          End of episode {episode.number}
          {panels.length ? ` · ${panels.length} panels` : ''}.
        </p>
        <div className="writer-reader-nav">
          {prev ? (
            <Link to={`/writer/series/${series.id}/episodes/${prev.id}`}>
              ← Ep. {prev.number}
            </Link>
          ) : (
            <span />
          )}
          <Link to={seriesHref}>Back to series</Link>
          {next ? (
            <Link to={`/writer/series/${series.id}/episodes/${next.id}`}>
              Ep. {next.number} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </footer>
    </main>
  )
}

function resolveEpisodePanels(seriesId: string, episodeNumber: number) {
  if (seriesId === 'ws-pepper-carrot') {
    const open = getOpenSourceTitle('pepper-and-carrot')
    const ep = open?.episodes.find((e) => e.number === episodeNumber)
    if (ep?.panels.length) return ep.panels
  }
  return [] as { src: string; alt: string; width: number; height: number }[]
}
