import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Icon } from '@/components/icons/icon'
import {
  COVER_KINDS,
  COVER_SPEC,
  coverKindSpec,
  type CoverKind,
} from '@/data/writer-cover-spec'
import {
  updateWriterSeriesCover,
  type WriterSeries,
} from '@/data/writer-demo'

type Props = {
  series: WriterSeries
  onSeriesChange: (series: WriterSeries) => void
}

function readImage(file: File): Promise<{ url: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ url, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image'))
    }
    img.src = url
  })
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not encode image'))
    reader.readAsDataURL(file)
  })
}

export function SeriesCoverUpload({ series, onSeriesChange }: Props) {
  const [active, setActive] = useState<CoverKind>('portrait')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const spec = coverKindSpec(active)

  const previewSrc =
    active === 'portrait'
      ? series.cover
      : active === 'square'
        ? series.coverSquare
        : series.coverVertical

  async function ingest(file: File | undefined) {
    if (!file) return
    setError('')
    const allowed = new Set<string>(COVER_SPEC.formats)
    if (!allowed.has(file.type)) {
      setError(`Use ${COVER_SPEC.formatLabels} only.`)
      return
    }
    if (file.size > spec.maxFileMb * 1024 * 1024) {
      setError(`Max ${spec.maxFileMb} MB for ${spec.label.toLowerCase()}.`)
      return
    }

    try {
      const meta = await readImage(file)
      const exact =
        meta.width === spec.widthPx && meta.height === spec.heightPx
      if (!exact) {
        setError(
          `Need exactly ${spec.widthPx}×${spec.heightPx}px (${spec.ratio}). Got ${meta.width}×${meta.height}px.`,
        )
        URL.revokeObjectURL(meta.url)
        return
      }
      URL.revokeObjectURL(meta.url)
      const dataUrl = await fileToDataUrl(file)
      const updated = updateWriterSeriesCover(series.id, active, dataUrl)
      if (updated) onSeriesChange(updated)
    } catch {
      setError('Could not upload that image.')
    }
  }

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    void ingest(e.target.files?.[0])
    e.target.value = ''
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragOver(false)
    void ingest(e.dataTransfer.files?.[0])
  }

  function clearCover() {
    if (active === 'portrait') {
      setError('Portrait cover is required — upload a replacement instead of clearing.')
      return
    }
    const updated = updateWriterSeriesCover(series.id, active, null)
    if (updated) onSeriesChange(updated)
    setError('')
  }

  return (
    <section className="writer-panel writer-cover-section" aria-labelledby="writer-cover-heading">
      <div className="writer-cover-intro">
        <div>
          <p className="writer-eyebrow">
            <span /> SERIES COVER
          </p>
          <h2 id="writer-cover-heading">Upload cover art</h2>
          <p className="writer-muted">
            Sizes match what major novel & comic platforms use. Portrait{' '}
            <b>600×800</b> is required for the catalog; square and vertical follow WEBTOON.
          </p>
        </div>
      </div>

      <div className="writer-cover-tabs" role="tablist" aria-label="Cover type">
        {COVER_KINDS.map((kind) => {
          const item = coverKindSpec(kind)
          return (
            <button
              key={kind}
              type="button"
              role="tab"
              aria-selected={active === kind}
              className={`writer-cover-tab ${active === kind ? 'is-active' : ''}`}
              onClick={() => {
                setActive(kind)
                setError('')
              }}
            >
              <strong>{item.label}</strong>
              <span>
                {item.widthPx}×{item.heightPx}px · {item.ratio}
                {item.required ? ' · required' : ' · optional'}
              </span>
            </button>
          )
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={COVER_SPEC.formats.join(',')}
        className="sr-only"
        onChange={onInput}
      />

      <div className="writer-cover-layout">
        <button
          type="button"
          className={`writer-cover-frame is-${active}`}
          aria-label={
            previewSrc
              ? `Change ${spec.label.toLowerCase()}`
              : `Upload ${spec.label.toLowerCase()}`
          }
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            void ingest(e.dataTransfer.files?.[0])
          }}
        >
          {previewSrc ? (
            <img src={previewSrc} alt="" />
          ) : (
            <div className="writer-cover-placeholder">
              <Icon icon="lucide:image" width={28} height={28} />
              <p>No {spec.label.toLowerCase()} yet</p>
            </div>
          )}
          <span className="writer-cover-change">
            <Icon icon="lucide:pencil" width={14} height={14} />
            {previewSrc ? 'Change image' : 'Add image'}
          </span>
        </button>

        <div className="writer-cover-side">
          <dl className="writer-cover-spec">
            <div>
              <dt>Exact size</dt>
              <dd>
                {spec.widthPx} × {spec.heightPx} px
              </dd>
            </div>
            <div>
              <dt>Ratio</dt>
              <dd>{spec.ratio}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>
                {COVER_SPEC.formatLabels} · {COVER_SPEC.colorMode}
              </dd>
            </div>
            <div>
              <dt>Max file</dt>
              <dd>≤ {spec.maxFileMb} MB</dd>
            </div>
            <div>
              <dt>Used by</dt>
              <dd>{spec.usedBy}</dd>
            </div>
          </dl>

          <label
            className={`writer-drop writer-cover-drop ${dragOver ? 'is-active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={(e) => {
              e.preventDefault()
              inputRef.current?.click()
            }}
          >
            <Icon icon="lucide:cloud-upload" width={24} height={24} className="text-brand-bright" />
            <strong>Drop {spec.label.toLowerCase()} here</strong>
            <span>
              Exactly {spec.widthPx}×{spec.heightPx}px · {COVER_SPEC.formatLabels}
            </span>
          </label>

          <div className="writer-actions">
            <button
              type="button"
              className="writer-primary"
              onClick={() => inputRef.current?.click()}
            >
              Choose file
              <Icon icon="lucide:folder-open" width={16} height={16} />
            </button>
            {active !== 'portrait' ? (
              <button type="button" className="writer-ghost" onClick={clearCover}>
                Remove
              </button>
            ) : null}
          </div>

          {error ? (
            <p className="writer-error" role="alert">
              {error}
            </p>
          ) : previewSrc ? (
            <p className="writer-cover-ok">Cover saved for this series (demo · this browser).</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
