import { useRef, useState, type ChangeEvent } from 'react'
import { Icon } from '@/components/icons/icon'
import { COVER_SPEC, coverKindSpec } from '@/data/writer-cover-spec'
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

/** Portrait cover in the series hero — click (or drop) is the only way to change it. */
export function SeriesHeroCover({ series, onSeriesChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [ok, setOk] = useState(false)
  const spec = coverKindSpec('portrait')

  async function ingest(file: File | undefined) {
    if (!file) return
    setError('')
    setOk(false)
    const allowed = new Set<string>(COVER_SPEC.formats)
    if (!allowed.has(file.type)) {
      setError(`Use ${COVER_SPEC.formatLabels} only.`)
      return
    }
    if (file.size > spec.maxFileMb * 1024 * 1024) {
      setError(`Max ${spec.maxFileMb} MB.`)
      return
    }

    try {
      const meta = await readImage(file)
      const exact = meta.width === spec.widthPx && meta.height === spec.heightPx
      if (!exact) {
        setError(
          `Need ${spec.widthPx}×${spec.heightPx}px (${spec.ratio}). Got ${meta.width}×${meta.height}px.`,
        )
        URL.revokeObjectURL(meta.url)
        return
      }
      URL.revokeObjectURL(meta.url)
      const dataUrl = await fileToDataUrl(file)
      const updated = updateWriterSeriesCover(series.id, 'portrait', dataUrl)
      if (updated) {
        onSeriesChange(updated)
        setOk(true)
      }
    } catch {
      setError('Could not upload that image.')
    }
  }

  function onInput(e: ChangeEvent<HTMLInputElement>) {
    void ingest(e.target.files?.[0])
    e.target.value = ''
  }

  return (
    <div className="ws-hero-cover-wrap">
      <input
        ref={inputRef}
        type="file"
        accept={COVER_SPEC.formats.join(',')}
        className="sr-only"
        onChange={onInput}
      />
      <button
        type="button"
        className="ws-hero-cover"
        aria-label="Change series cover image"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          void ingest(e.dataTransfer.files?.[0])
        }}
      >
        <img src={series.cover} alt="" width={168} height={224} />
        <span className="ws-hero-cover-scrim" aria-hidden />
        <span className="ws-hero-cover-hint">
          <Icon icon="lucide:image-plus" width={22} height={22} />
          <strong>Change cover</strong>
          <em>
            {spec.widthPx}×{spec.heightPx}px · click or drop
          </em>
        </span>
      </button>
      {error ? (
        <p className="ws-hero-cover-msg is-error" role="alert">
          {error}
        </p>
      ) : null}
      {ok && !error ? (
        <p className="ws-hero-cover-msg is-ok" role="status">
          Cover updated
        </p>
      ) : null}
    </div>
  )
}
