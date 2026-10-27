import { Link, Navigate, useParams } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { getOpenSourceTitle } from '@/data/opensource-titles'
import '@/styles/title-reader.css'

export function TitleCoverPage() {
  const { slug = '' } = useParams()
  const title = getOpenSourceTitle(slug)
  if (!title) return <Navigate to="/comic" replace />

  const first = title.episodes[0]

  return (
    <main className="title-page">
      <section className="title-hero" aria-label={`${title.title} cover`}>
        <div
          className="title-hero-bg"
          style={{ backgroundImage: `url(${title.coverLandscape})` }}
        />
        <div className="title-hero-fade" />
        <div className="title-hero-body">
          <img
            className="title-cover"
            src={title.coverPortrait}
            alt=""
            width={168}
            height={232}
          />
          <div>
            <p className="title-kicker">
              <span /> OPEN SOURCE · {title.license}
            </p>
            <h1>{title.title}</h1>
            <p className="title-subtitle">{title.subtitle}</p>
            <div className="title-meta">
              <span className="title-chip">{title.format}</span>
              <span className="title-chip">{title.genre}</span>
              <span className="title-chip">{title.writer}</span>
              <span className="title-chip">
                {title.episodes.length} episode{title.episodes.length === 1 ? '' : 's'}
              </span>
              <span className="title-chip">
                {title.uploadSpec.widthPx}×≤{title.uploadSpec.cutMaxHeightPx} cuts
              </span>
            </div>
            <p className="title-synopsis">{title.synopsis}</p>
            <div className="title-actions">
              {first ? (
                <Link
                  to={`/title/${title.slug}/read/${first.number}`}
                  className="title-btn title-btn-primary"
                >
                  <Icon icon="lucide:play" width={16} height={16} />
                  Read episode {first.number}
                </Link>
              ) : null}
              <a
                href={title.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="title-btn title-btn-ghost"
              >
                Official site
                <Icon icon="lucide:external-link" width={14} height={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="title-shell">
        <section className="title-section" aria-labelledby="title-episodes-heading">
          <h2 id="title-episodes-heading">Episodes</h2>
          <div className="space-y-3">
            {title.episodes.map((ep) => (
              <Link
                key={ep.number}
                to={`/title/${title.slug}/read/${ep.number}`}
                className="title-episode-card"
              >
                <img src={ep.panels[1]?.src ?? ep.panels[0]?.src} alt="" />
                <div>
                  <h3>
                    Ep. {ep.number} — {ep.title}
                  </h3>
                  <p>
                    {ep.panels.length} Liblo cuts · {title.uploadSpec.widthPx}px wide · free to
                    read
                  </p>
                </div>
                <Icon icon="lucide:chevron-right" width={18} height={18} className="text-white/35" />
              </Link>
            ))}
          </div>
        </section>

        <aside className="title-credit">
          <strong>Credits · {title.license}</strong>
          <br />
          {title.attribution}{' '}
          <a href={title.licenseUrl} target="_blank" rel="noreferrer">
            License
          </a>
          {' · '}
          <a href={title.sourceUrl} target="_blank" rel="noreferrer">
            peppercarrot.com
          </a>
        </aside>
      </div>
    </main>
  )
}
