import { openSourceTitles } from '@/data/opensource-titles'

export type WriterSeries = {
  id: string
  title: string
  format: 'SCROLL' | 'CHAT' | 'EBOOK'
  status: 'draft' | 'published'
  cover: string
  episodeCount: number
  updatedAt: string
  /** Optional reader deep-link for open-source demos */
  readHref?: string
}

export type WriterEpisode = {
  id: string
  seriesId: string
  number: number
  title: string
  status: 'draft' | 'published'
  uploadMode: 'cuts' | 'long-strip' | null
  panelCount: number
  updatedAt: string
  readHref?: string
}

const SERIES_KEY = 'liblo.writer.series.v3'
const EPISODES_KEY = 'liblo.writer.episodes.v3'

const pepper = openSourceTitles[0]!

const DEFAULT_SERIES: WriterSeries[] = [
  {
    id: 'ws-pepper-carrot',
    title: pepper.title,
    format: 'SCROLL',
    status: 'published',
    cover: pepper.coverPortrait,
    episodeCount: pepper.episodes.length,
    updatedAt: new Date().toISOString(),
    readHref: `/title/${pepper.slug}`,
  },
  {
    id: 'ws-midnight',
    title: 'Midnight Station',
    format: 'SCROLL',
    status: 'published',
    cover: '/m1/portrait/p01.webp',
    episodeCount: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ws-paper',
    title: 'Paper Hearts',
    format: 'SCROLL',
    status: 'draft',
    cover: '/m1/portrait/p03.webp',
    episodeCount: 0,
    updatedAt: new Date().toISOString(),
  },
]

const DEFAULT_EPISODES: WriterEpisode[] = [
  ...pepper.episodes.map((ep) => ({
    id: `we-pepper-${ep.number}`,
    seriesId: 'ws-pepper-carrot',
    number: ep.number,
    title: ep.title,
    status: 'published' as const,
    uploadMode: 'cuts' as const,
    panelCount: ep.panels.length,
    updatedAt: new Date().toISOString(),
    readHref: `/title/${pepper.slug}/read/${ep.number}`,
  })),
  {
    id: 'we-1',
    seriesId: 'ws-midnight',
    number: 1,
    title: 'Platform 7',
    status: 'published',
    uploadMode: 'cuts',
    panelCount: 24,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'we-2',
    seriesId: 'ws-midnight',
    number: 2,
    title: 'Last Train',
    status: 'draft',
    uploadMode: 'long-strip',
    panelCount: 18,
    updatedAt: new Date().toISOString(),
  },
]

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function listWriterSeries(): WriterSeries[] {
  const stored = readJson<WriterSeries[] | null>(SERIES_KEY, null)
  if (!stored?.length) {
    writeJson(SERIES_KEY, DEFAULT_SERIES)
    return DEFAULT_SERIES
  }
  return stored
}

export function getWriterSeries(id: string) {
  return listWriterSeries().find((s) => s.id === id) ?? null
}

export function listWriterEpisodes(seriesId: string): WriterEpisode[] {
  const all = readJson<WriterEpisode[] | null>(EPISODES_KEY, null)
  if (!all) {
    writeJson(EPISODES_KEY, DEFAULT_EPISODES)
    return DEFAULT_EPISODES.filter((e) => e.seriesId === seriesId)
  }
  return all
    .filter((e) => e.seriesId === seriesId)
    .sort((a, b) => a.number - b.number)
}

export function saveWriterEpisodeDraft(input: {
  seriesId: string
  title: string
  uploadMode: 'cuts' | 'long-strip'
  panelCount: number
}): WriterEpisode {
  const series = getWriterSeries(input.seriesId)
  const episodes = readJson<WriterEpisode[]>(EPISODES_KEY, DEFAULT_EPISODES)
  const forSeries = episodes.filter((e) => e.seriesId === input.seriesId)
  const number = (forSeries.at(-1)?.number ?? 0) + 1
  const episode: WriterEpisode = {
    id: `we-${Date.now()}`,
    seriesId: input.seriesId,
    number,
    title: input.title.trim() || `Episode ${number}`,
    status: 'draft',
    uploadMode: input.uploadMode,
    panelCount: input.panelCount,
    updatedAt: new Date().toISOString(),
  }
  writeJson(EPISODES_KEY, [...episodes, episode])

  if (series) {
    const seriesList = listWriterSeries().map((s) =>
      s.id === series.id
        ? {
            ...s,
            episodeCount: forSeries.length + 1,
            updatedAt: new Date().toISOString(),
          }
        : s,
    )
    writeJson(SERIES_KEY, seriesList)
  }

  return episode
}
