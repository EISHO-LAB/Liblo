/** Liblo SCROLL upload guidelines — aligned with WEBTOON Canvas–style practice. */

export const SCROLL_UPLOAD_SPEC = {
  widthPx: 800,
  cutMaxHeightPx: 1280,
  maxFileMb: 5,
  maxEpisodeMb: 20,
  maxCuts: 100,
  formats: ['image/jpeg', 'image/png', 'image/webp'] as const,
  formatLabels: 'JPG, PNG, or WebP',
  colorMode: 'RGB',
} as const

export type UploadMode = 'cuts' | 'long-strip'

export const UPLOAD_MODES: {
  id: UploadMode
  title: string
  subtitle: string
  detail: string
  icon: string
}[] = [
  {
    id: 'cuts',
    title: 'Cut panels',
    subtitle: 'You slice · we stack',
    detail:
      'Upload ordered panels (≈800×1280 each). Best if you already export cuts from Clip Studio or Photoshop.',
    icon: 'lucide:layout-list',
  },
  {
    id: 'long-strip',
    title: 'Long strip',
    subtitle: 'You draw long · we slice',
    detail:
      'Upload one tall strip at 800px wide. Liblo splits it near 1280px at quiet gutters so the episode scrolls as one story.',
    icon: 'lucide:move-vertical',
  },
]
