import { Link, Navigate, useParams } from 'react-router-dom'
import { getOpenSourceEpisode } from '@/data/opensource-titles'
import '@/styles/title-reader.css'

export function TitleReaderPage() {
  const { slug = '', episodeNumber = '1' } = useParams()
  const num = Number(episodeNumber)
  const data = Number.isFinite(num) ? getOpenSourceEpisode(slug, num) : null
  if (!data) return <Navigate to="/comic" replace />

  const { title, episode } = data

  return (
    <main className="reader-page">
      <div className="reader-bar">
        <Link to={`/title/${title.slug}`}>← {title.title}</Link>
        <strong>
          Ep. {episode.number} · {episode.title}
        </strong>
        <span className="text-xs text-white/45">{title.license}</span>
      </div>

      <div className="reader-strip" aria-label={`${episode.title} pages`}>
        {episode.panels.map((panel) => (
          <img key={panel.src} src={panel.src} alt={panel.alt} />
        ))}
      </div>

      <footer className="reader-end">
        <p>
          End of episode {episode.number}. {title.attribution}
        </p>
        <p className="mt-3">
          <Link to={`/title/${title.slug}`} className="text-brand-bright hover:underline">
            Back to cover
          </Link>
        </p>
      </footer>
    </main>
  )
}
