/**
 * Freely licensed titles bundled for Liblo demo.
 * Pepper & Carrot © David Revoy — CC BY 4.0 (see public/opensource/.../ATTRIBUTION.txt).
 *
 * Episode images are re-exported to Liblo SCROLL upload spec:
 * 800px wide · each cut ≤ 1280px tall · RGB JPEG.
 */

import { SCROLL_UPLOAD_SPEC } from '@/data/writer-upload-spec'

export type OpenSourcePanel = {
  src: string
  alt: string
  width: number
  height: number
}

export type OpenSourceEpisode = {
  number: number
  title: string
  /** Ordered cut panels (writer Mode A). */
  panels: OpenSourcePanel[]
  /** Optional single tall strip (writer Mode B). */
  longStrip?: string
}

export type OpenSourceTitle = {
  id: string
  slug: string
  title: string
  subtitle: string
  writer: string
  synopsis: string
  format: 'SCROLL'
  genre: 'fantasy' | 'comedy' | 'romance' | 'drama' | 'action'
  coverPortrait: string
  coverLandscape: string
  license: string
  licenseUrl: string
  sourceUrl: string
  attribution: string
  /** Matches studio upload guidelines. */
  uploadSpec: typeof SCROLL_UPLOAD_SPEC
  episodes: OpenSourceEpisode[]
}

const PC = '/opensource/pepper-carrot'

function cuts(
  episodeFolder: string,
  files: { file: string; h: number; label: string }[],
): OpenSourcePanel[] {
  return files.map((f) => ({
    src: `${PC}/${episodeFolder}/liblo-cuts/${f.file}`,
    alt: f.label,
    width: SCROLL_UPLOAD_SPEC.widthPx,
    height: f.h,
  }))
}

export const openSourceTitles: OpenSourceTitle[] = [
  {
    id: 'os-pepper-carrot',
    slug: 'pepper-and-carrot',
    title: 'Pepper & Carrot',
    subtitle: 'Hereva witches · Liblo 800px scroll format',
    writer: 'David Revoy',
    synopsis:
      'Young witch Pepper and her cat Carrot brew mischief in the magical land of Hereva. Episodes below are resized to Liblo’s writer upload spec (800px wide cuts, max 1280px tall) so they match the studio pipeline.',
    format: 'SCROLL',
    genre: 'fantasy',
    coverPortrait: `${PC}/cover-portrait-800.jpg`,
    coverLandscape: `${PC}/cover-landscape-1200.jpg`,
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://www.peppercarrot.com/',
    attribution:
      'Art & scenario by David Revoy. Pepper&Carrot is published under Creative Commons Attribution 4.0. Images re-exported to 800px Liblo cuts for demo.',
    uploadSpec: SCROLL_UPLOAD_SPEC,
    episodes: [
      {
        number: 1,
        title: 'The Potion of Flight',
        longStrip: `${PC}/ep01/liblo-long-strip.jpg`,
        panels: cuts('ep01', [
          { file: '01.jpg', h: 191, label: 'Episode 1 title banner' },
          { file: '02.jpg', h: 1107, label: 'Episode 1 — cut 1' },
          { file: '03.jpg', h: 1107, label: 'Episode 1 — cut 2' },
          { file: '04.jpg', h: 1107, label: 'Episode 1 — cut 3' },
        ]),
      },
      {
        number: 2,
        title: 'Rainbow Potions',
        longStrip: `${PC}/ep02/liblo-long-strip.jpg`,
        panels: cuts('ep02', [
          { file: '01.jpg', h: 191, label: 'Episode 2 title banner' },
          { file: '02.jpg', h: 1107, label: 'Episode 2 — cut 1' },
          { file: '03.jpg', h: 1107, label: 'Episode 2 — cut 2' },
          { file: '04.jpg', h: 1107, label: 'Episode 2 — cut 3' },
          { file: '05.jpg', h: 1107, label: 'Episode 2 — cut 4' },
          { file: '06.jpg', h: 1107, label: 'Episode 2 — cut 5' },
          { file: '07.jpg', h: 267, label: 'Episode 2 — cut 6' },
        ]),
      },
    ],
  },
]

export function getOpenSourceTitle(slug: string) {
  return openSourceTitles.find((t) => t.slug === slug) ?? null
}

export function getOpenSourceEpisode(slug: string, episodeNumber: number) {
  const title = getOpenSourceTitle(slug)
  if (!title) return null
  const episode = title.episodes.find((e) => e.number === episodeNumber) ?? null
  if (!episode) return null
  return { title, episode }
}
