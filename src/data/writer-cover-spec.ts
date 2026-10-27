/**
 * Universal series-cover sizes used across major novel / comic platforms.
 * Primary = web-novel catalog card (Qidian / WebNovel family: 600×800, 3:4).
 * Square + vertical match WEBTOON Canvas series thumbnails.
 */

export const COVER_SPEC = {
  /** Catalog / card cover — most common web-novel size worldwide. */
  portrait: {
    id: 'portrait' as const,
    label: 'Portrait cover',
    widthPx: 600,
    heightPx: 800,
    ratio: '3:4',
    maxFileMb: 5,
    required: true,
    usedBy: 'Qidian, WebNovel, Tapas-style cards, most CN/KR novel apps',
  },
  /** App / discovery tile — WEBTOON Canvas square series thumbnail. */
  square: {
    id: 'square' as const,
    label: 'Square thumbnail',
    widthPx: 1080,
    heightPx: 1080,
    ratio: '1:1',
    maxFileMb: 1,
    required: false,
    usedBy: 'WEBTOON Canvas (1080×1080, ≤500KB ideal)',
  },
  /** Full-bleed vertical poster — WEBTOON Canvas vertical series thumbnail. */
  vertical: {
    id: 'vertical' as const,
    label: 'Vertical poster',
    widthPx: 1080,
    heightPx: 1920,
    ratio: '9:16',
    maxFileMb: 2,
    required: false,
    usedBy: 'WEBTOON Canvas (1080×1920)',
  },
  formats: ['image/jpeg', 'image/png', 'image/webp'] as const,
  formatLabels: 'JPG, PNG, or WebP',
  colorMode: 'RGB' as const,
} as const

export type CoverKind = keyof Pick<typeof COVER_SPEC, 'portrait' | 'square' | 'vertical'>

export const COVER_KINDS: CoverKind[] = ['portrait', 'square', 'vertical']

export function coverKindSpec(kind: CoverKind) {
  return COVER_SPEC[kind]
}
