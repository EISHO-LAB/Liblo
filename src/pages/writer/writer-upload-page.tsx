import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { getWriterSeries, saveWriterEpisodeDraft } from '@/data/writer-demo'
import {
  SCROLL_UPLOAD_SPEC,
  UPLOAD_MODES,
  type UploadMode,
} from '@/data/writer-upload-spec'
import { useAuth } from '@/lib/auth'
import '@/styles/writer.css'

type LocalCut = {
  id: string
  file: File
  url: string
  width: number
  height: number
}

function revokeCuts(cuts: LocalCut[]) {
  for (const cut of cuts) URL.revokeObjectURL(cut.url)
}

function readImageSize(file: File): Promise<{ width: number; height: number; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, url })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image'))
    }
    img.src = url
  })
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function WriterUploadPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { seriesId = '' } = useParams()
  if (!user) return null
  if (user.writerStatus === 'none') return <Navigate to="/writer" replace />

  const series = getWriterSeries(seriesId)
  if (!series) {
    return (
      <main className="writer-studio">
        <div className="writer-shell">
          <div className="writer-panel writer-gate">
            <h1>Series not found</h1>
            <Link to="/writer" className="writer-primary">
              Back to studio
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (series.format !== 'SCROLL') {
    return (
      <main className="writer-studio">
        <div className="writer-shell">
          <div className="writer-panel writer-gate">
            <h1>Scroll upload only</h1>
            <p>Cut / long-strip upload is for SCROLL comics. Chat & ebook use file uploads.</p>
            <Link to={`/writer/series/${series.id}`} className="writer-primary">
              Back to series
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return <UploadFlow seriesId={series.id} seriesTitle={series.title} onDone={() => navigate(`/writer/series/${series.id}`)} />
}

function UploadFlow({
  seriesId,
  seriesTitle,
  onDone,
}: {
  seriesId: string
  seriesTitle: string
  onDone: () => void
}) {
  const [title, setTitle] = useState('')
  const [mode, setMode] = useState<UploadMode>('cuts')
  const [cuts, setCuts] = useState<LocalCut[]>([])
  const [longStrip, setLongStrip] = useState<LocalCut | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const totalBytes = useMemo(() => {
    if (mode === 'cuts') return cuts.reduce((sum, c) => sum + c.file.size, 0)
    return longStrip?.file.size ?? 0
  }, [cuts, longStrip, mode])

  const estimatedSlices = useMemo(() => {
    if (!longStrip) return 0
    return Math.max(1, Math.ceil(longStrip.height / SCROLL_UPLOAD_SPEC.cutMaxHeightPx))
  }, [longStrip])

  const sliceMarks = useMemo(() => {
    if (!longStrip) return [] as number[]
    const marks: number[] = []
    for (let y = SCROLL_UPLOAD_SPEC.cutMaxHeightPx; y < longStrip.height; y += SCROLL_UPLOAD_SPEC.cutMaxHeightPx) {
      marks.push(y)
    }
    return marks
  }, [longStrip])

  const ingestFiles = useCallback(
    async (fileList: FileList | File[]) => {
      setError('')
      const files = Array.from(fileList)
      if (!files.length) return

      const allowed = new Set<string>(SCROLL_UPLOAD_SPEC.formats)
      const next: LocalCut[] = []

      for (const file of files) {
        if (!allowed.has(file.type)) {
          setError(`Use ${SCROLL_UPLOAD_SPEC.formatLabels} only.`)
          return
        }
        if (file.size > SCROLL_UPLOAD_SPEC.maxFileMb * 1024 * 1024) {
          setError(`Each file must be under ${SCROLL_UPLOAD_SPEC.maxFileMb} MB.`)
          return
        }
        try {
          const size = await readImageSize(file)
          next.push({
            id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
            file,
            url: size.url,
            width: size.width,
            height: size.height,
          })
        } catch {
          setError('One of the images could not be read.')
          return
        }
      }

      if (mode === 'long-strip') {
        const first = next[0]
        if (!first) return
        setLongStrip((prev) => {
          if (prev) URL.revokeObjectURL(prev.url)
          return first
        })
        for (const extra of next.slice(1)) URL.revokeObjectURL(extra.url)
        return
      }

      setCuts((prev) => {
        const merged = [...prev, ...next]
        if (merged.length > SCROLL_UPLOAD_SPEC.maxCuts) {
          setError(`Up to ${SCROLL_UPLOAD_SPEC.maxCuts} cuts per episode.`)
          for (const extra of next) URL.revokeObjectURL(extra.url)
          return prev
        }
        return merged
      })
    },
    [mode],
  )

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) void ingestFiles(event.target.files)
    event.target.value = ''
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragOver(false)
    if (event.dataTransfer.files) void ingestFiles(event.dataTransfer.files)
  }

  function moveCut(index: number, delta: number) {
    setCuts((prev) => {
      const target = index + delta
      if (target < 0 || target >= prev.length) return prev
      const copy = [...prev]
      const [item] = copy.splice(index, 1)
      if (!item) return prev
      copy.splice(target, 0, item)
      return copy
    })
  }

  function removeCut(id: string) {
    setCuts((prev) => {
      const found = prev.find((c) => c.id === id)
      if (found) URL.revokeObjectURL(found.url)
      return prev.filter((c) => c.id !== id)
    })
  }

  function clearAll() {
    revokeCuts(cuts)
    if (longStrip) URL.revokeObjectURL(longStrip.url)
    setCuts([])
    setLongStrip(null)
    setSaved(false)
    setError('')
  }

  async function handleSave() {
    setError('')
    setSaved(false)
    const panelCount = mode === 'cuts' ? cuts.length : estimatedSlices
    if (!title.trim()) {
      setError('Add an episode title.')
      return
    }
    if (panelCount <= 0) {
      setError(mode === 'cuts' ? 'Add at least one cut panel.' : 'Upload a long strip first.')
      return
    }
    if (totalBytes > SCROLL_UPLOAD_SPEC.maxEpisodeMb * 1024 * 1024) {
      setError(`Episode total must stay under ${SCROLL_UPLOAD_SPEC.maxEpisodeMb} MB.`)
      return
    }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 450))
    saveWriterEpisodeDraft({
      seriesId,
      title,
      uploadMode: mode,
      panelCount,
    })
    setSaving(false)
    setSaved(true)
    window.setTimeout(onDone, 700)
  }

  return (
    <main className="writer-studio">
      <div className="writer-shell">
        <nav className="writer-crumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/writer">Writer studio</Link>
          <span>/</span>
          <Link to={`/writer/series/${seriesId}`}>{seriesTitle}</Link>
          <span>/</span>
          <span aria-current="page">Upload</span>
        </nav>

        <header className="writer-intro">
          <div>
            <p className="writer-eyebrow">
              <span /> NEW EPISODE
            </p>
            <h1>
              How do you want
              <br />
              to <span>upload?</span>
            </h1>
            <p className="writer-intro-copy">
              Choose cut panels or one long strip. Specs match phone-first scroll comics —
              width {SCROLL_UPLOAD_SPEC.widthPx}px, not print paper sizes.
            </p>
          </div>
        </header>

        <div className="writer-upload-layout">
          <section className="writer-panel" aria-labelledby="writer-upload-heading">
            <h2 id="writer-upload-heading">Episode files</h2>
            <p className="writer-muted">
              Liblo never asks for A4. Prepare RGB images at {SCROLL_UPLOAD_SPEC.widthPx}px wide.
            </p>

            <label className="writer-field">
              <span>Episode title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Last Train"
                maxLength={120}
              />
            </label>

            <fieldset className="writer-modes">
              <legend className="sr-only">Upload mode</legend>
              {UPLOAD_MODES.map((item) => (
                <label
                  key={item.id}
                  className={`writer-mode ${mode === item.id ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="upload-mode"
                    value={item.id}
                    checked={mode === item.id}
                    onChange={() => {
                      clearAll()
                      setMode(item.id)
                    }}
                  />
                  <div className="writer-mode-top">
                    <span className="writer-mode-icon" aria-hidden>
                      <Icon icon={item.icon} width={18} height={18} />
                    </span>
                    <div>
                      <p className="writer-mode-sub">{item.subtitle}</p>
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                  <p>{item.detail}</p>
                </label>
              ))}
            </fieldset>

            <label
              className={`writer-drop ${dragOver ? 'is-active' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <Icon icon="lucide:cloud-upload" width={28} height={28} className="text-brand-bright" />
              <strong>
                {mode === 'cuts' ? 'Drop cut panels here' : 'Drop your long strip here'}
              </strong>
              <span>
                {SCROLL_UPLOAD_SPEC.formatLabels} · max {SCROLL_UPLOAD_SPEC.maxFileMb} MB each
                {mode === 'cuts' ? ` · up to ${SCROLL_UPLOAD_SPEC.maxCuts} files` : ' · one tall image'}
              </span>
              <input
                type="file"
                accept={SCROLL_UPLOAD_SPEC.formats.join(',')}
                multiple={mode === 'cuts'}
                className="sr-only"
                onChange={onInputChange}
              />
            </label>

            {mode === 'cuts' && cuts.length > 0 ? (
              <ul className="writer-cut-list">
                {cuts.map((cut, index) => (
                  <li key={cut.id} className="writer-cut-item">
                    <img src={cut.url} alt="" />
                    <div>
                      <h4>
                        Cut {String(index + 1).padStart(2, '0')} · {cut.file.name}
                      </h4>
                      <p>
                        {cut.width}×{cut.height}px · {formatBytes(cut.file.size)}
                        {cut.width !== SCROLL_UPLOAD_SPEC.widthPx
                          ? ` · width tip: ${SCROLL_UPLOAD_SPEC.widthPx}px`
                          : ''}
                        {cut.height > SCROLL_UPLOAD_SPEC.cutMaxHeightPx
                          ? ` · taller than ${SCROLL_UPLOAD_SPEC.cutMaxHeightPx}px`
                          : ''}
                      </p>
                    </div>
                    <div className="writer-cut-actions">
                      <button
                        type="button"
                        className="writer-icon-btn"
                        aria-label="Move up"
                        onClick={() => moveCut(index, -1)}
                      >
                        <Icon icon="lucide:chevron-up" width={16} height={16} />
                      </button>
                      <button
                        type="button"
                        className="writer-icon-btn"
                        aria-label="Move down"
                        onClick={() => moveCut(index, 1)}
                      >
                        <Icon icon="lucide:chevron-down" width={16} height={16} />
                      </button>
                      <button
                        type="button"
                        className="writer-icon-btn"
                        aria-label="Remove"
                        onClick={() => removeCut(cut.id)}
                      >
                        <Icon icon="lucide:trash-2" width={16} height={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            {mode === 'long-strip' && longStrip ? (
              <div className="writer-long-preview">
                <div className="writer-long-preview-inner">
                  <img src={longStrip.url} alt="Long strip preview" />
                  {sliceMarks.map((y) => (
                    <div
                      key={y}
                      className="writer-slice-line"
                      style={{ top: `${(y / longStrip.height) * 100}%` }}
                    >
                      <span>slice ~{y}px</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-xs text-white/55">
                  {longStrip.width}×{longStrip.height}px · {formatBytes(longStrip.file.size)} ·
                  estimated {estimatedSlices} reader panels after auto-slice
                </div>
              </div>
            ) : null}

            {error ? (
              <p className="writer-error" role="alert">
                {error}
              </p>
            ) : null}
            {saved ? (
              <p className="writer-success" role="status">
                Draft episode saved in this browser. Returning to series…
              </p>
            ) : null}

            <div className="writer-actions">
              <button
                type="button"
                className="writer-primary"
                disabled={saving}
                onClick={() => void handleSave()}
              >
                {saving ? 'Saving…' : 'Save draft episode'}
                <Icon icon="lucide:check" width={16} height={16} />
              </button>
              <button type="button" className="writer-ghost" onClick={clearAll}>
                Clear files
              </button>
              <Link to={`/writer/series/${seriesId}`} className="writer-ghost">
                Cancel
              </Link>
            </div>
          </section>

          <aside className="writer-preview" aria-labelledby="writer-preview-heading">
            <div className="writer-phone" aria-label="Phone preview of published episode">
              <div className="writer-phone-notch" aria-hidden />
              <div className="writer-phone-bar">
                <span>LIVE PREVIEW</span>
                <strong id="writer-preview-heading">
                  {title.trim() || 'Untitled episode'}
                </strong>
              </div>
              <div className="writer-phone-scroll">
                {mode === 'cuts' && cuts.length > 0 ? (
                  <div className="writer-reader-strip">
                    {cuts.map((cut, index) => (
                      <img
                        key={cut.id}
                        src={cut.url}
                        alt={`Panel ${index + 1}`}
                        className="writer-reader-panel"
                      />
                    ))}
                  </div>
                ) : null}

                {mode === 'long-strip' && longStrip ? (
                  <div className="writer-reader-strip writer-reader-strip-long">
                    <img
                      src={longStrip.url}
                      alt="Long strip as readers will scroll"
                      className="writer-reader-panel"
                    />
                    {sliceMarks.map((y) => (
                      <div
                        key={y}
                        className="writer-reader-slice"
                        style={{ top: `${(y / longStrip.height) * 100}%` }}
                        aria-hidden
                      />
                    ))}
                  </div>
                ) : null}

                {(mode === 'cuts' ? cuts.length === 0 : !longStrip) ? (
                  <div className="writer-preview-empty">
                    <Icon icon="lucide:smartphone" width={28} height={28} />
                    <p>Upload on the left to see how this episode will look when published.</p>
                    <span>
                      {SCROLL_UPLOAD_SPEC.widthPx}px wide · scroll comic
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="writer-phone-home" aria-hidden />
            </div>

            <p className="writer-preview-meta">
              {mode === 'cuts'
                ? `${cuts.length} panel${cuts.length === 1 ? '' : 's'}`
                : longStrip
                  ? `${estimatedSlices} slice${estimatedSlices === 1 ? '' : 's'}`
                  : 'Empty'}
              {' · '}
              {formatBytes(totalBytes)}
            </p>
            <p className="writer-preview-hint">
              Scroll inside the phone — this is the published reader layout (panels stacked,
              no paper pages).
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
