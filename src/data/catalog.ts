export type SeriesFormat = 'SCROLL' | 'CHAT' | 'EBOOK'

export type SeriesCard = {
  id: string
  slug: string
  title: string
  format: SeriesFormat
  genre: string
  tags: string[]
  year: number
  seasons: string
  quality: string
  synopsis: string
  coverUrl: string
  tone: string
}

export const categories = [
  { id: 'continue', label: 'Continue reading' },
  { id: 'trending', label: 'Trending now' },
  { id: 'romance', label: 'Romance' },
  { id: 'fantasy', label: 'Fantasy & action' },
  { id: 'chat', label: 'Chat novels' },
  { id: 'scroll', label: 'Vertical scroll' },
  { id: 'ebook', label: 'E-books' },
] as const

export const catalog: SeriesCard[] = [
  {
    id: '1',
    slug: 'midnight-chat',
    title: 'Midnight Chat',
    format: 'CHAT',
    genre: 'Romance',
    tags: ['Romance', 'Drama', 'Mystery'],
    year: 2024,
    seasons: '3 Seasons',
    quality: '4K',
    synopsis:
      'A late-night message turns into a secret orbit only two people share — until the screen light starts to feel like home.',
    coverUrl: '/covers/midnight-chat.jpg',
    tone: 'from-slate-800 via-sky-950 to-cyan-900',
  },
  {
    id: '2',
    slug: 'rainy-roof',
    title: 'Rainy Roof',
    format: 'SCROLL',
    genre: 'Drama',
    tags: ['Drama', 'Thriller'],
    year: 2023,
    seasons: '2 Seasons',
    quality: 'HD',
    synopsis: 'On a wet rooftop above the city, silence says more than words.',
    coverUrl: '/covers/rainy-roof.jpg',
    tone: 'from-zinc-900 via-indigo-950 to-slate-800',
  },
  {
    id: '3',
    slug: 'glass-garden',
    title: 'Glass Garden',
    format: 'SCROLL',
    genre: 'Fantasy',
    tags: ['Fantasy', 'Adventure'],
    year: 2024,
    seasons: '1 Season',
    quality: '4K',
    synopsis: 'A greenhouse of crystal blooms under a sky that never sleeps.',
    coverUrl: '/covers/glass-garden.jpg',
    tone: 'from-emerald-950 via-teal-900 to-cyan-950',
  },
  {
    id: '4',
    slug: 'blade-line',
    title: 'Blade Line',
    format: 'SCROLL',
    genre: 'Action',
    tags: ['Action', 'Crime'],
    year: 2025,
    seasons: '1 Season',
    quality: '4K',
    synopsis: 'One cut decides the border between mercy and war.',
    coverUrl: '/covers/blade-line.jpg',
    tone: 'from-stone-900 via-orange-950 to-red-950',
  },
  {
    id: '5',
    slug: 'soft-orbit',
    title: 'Soft Orbit',
    format: 'CHAT',
    genre: 'Romance',
    tags: ['Romance', 'Sci-Fi'],
    year: 2024,
    seasons: '2 Seasons',
    quality: 'HD',
    synopsis: 'Two lives circle each other until gravity finally wins.',
    coverUrl: '/covers/soft-orbit.jpg',
    tone: 'from-fuchsia-950 via-rose-950 to-amber-950',
  },
  {
    id: '6',
    slug: 'harbor-ghost',
    title: 'Harbor Ghost',
    format: 'SCROLL',
    genre: 'Thriller',
    tags: ['Thriller', 'Mystery'],
    year: 2023,
    seasons: '1 Season',
    quality: 'HD',
    synopsis: 'Something waits in the fog where the ships no longer dock.',
    coverUrl: '/covers/harbor-ghost.jpg',
    tone: 'from-slate-950 via-blue-950 to-zinc-900',
  },
  {
    id: '7',
    slug: 'office-12f',
    title: 'Office 12F',
    format: 'CHAT',
    genre: 'Romance',
    tags: ['Romance', 'Comedy'],
    year: 2024,
    seasons: '2 Seasons',
    quality: 'HD',
    synopsis: 'Overtime on the twelfth floor becomes a second life.',
    coverUrl: '/covers/office-12f.jpg',
    tone: 'from-neutral-900 via-stone-800 to-amber-950',
  },
  {
    id: '8',
    slug: 'last-train',
    title: 'Last Train',
    format: 'CHAT',
    genre: 'Drama',
    tags: ['Drama', 'Romance'],
    year: 2022,
    seasons: '1 Season',
    quality: 'HD',
    synopsis: 'The final carriage home carries every unfinished goodbye.',
    coverUrl: '/covers/last-train.jpg',
    tone: 'from-violet-950 via-slate-900 to-sky-950',
  },
  {
    id: '9',
    slug: 'paper-hearts',
    title: 'Paper Hearts',
    format: 'EBOOK',
    genre: 'Romance',
    tags: ['Romance', 'Slice of Life'],
    year: 2021,
    seasons: 'Novel',
    quality: 'EBOOK',
    synopsis: 'Letters folded into hearts rewrite a year they almost lost.',
    coverUrl: '/covers/paper-hearts.jpg',
    tone: 'from-rose-950 via-pink-950 to-orange-950',
  },
  {
    id: '10',
    slug: 'nebula-diary',
    title: 'Nebula Diary',
    format: 'EBOOK',
    genre: 'Sci-Fi',
    tags: ['Sci-Fi', 'Mystery'],
    year: 2025,
    seasons: 'Novel',
    quality: 'EBOOK',
    synopsis: 'A personal journal that opens into another galaxy.',
    coverUrl: '/covers/nebula-diary.jpg',
    tone: 'from-cyan-950 via-blue-950 to-indigo-950',
  },
  {
    id: '11',
    slug: 'silent-panel',
    title: 'Silent Panel',
    format: 'SCROLL',
    genre: 'Slice of Life',
    tags: ['Slice of Life', 'Drama'],
    year: 2023,
    seasons: '3 Seasons',
    quality: 'HD',
    synopsis: 'Quiet frames of ordinary days that somehow feel infinite.',
    coverUrl: '/covers/silent-panel.jpg',
    tone: 'from-zinc-900 via-neutral-800 to-stone-900',
  },
  {
    id: '12',
    slug: 'orbit-letters',
    title: 'Orbit Letters',
    format: 'CHAT',
    genre: 'Romance',
    tags: ['Romance', 'Fantasy'],
    year: 2024,
    seasons: '1 Season',
    quality: '4K',
    synopsis: 'Messages sent across the dark find their way home.',
    coverUrl: '/covers/orbit-letters.jpg',
    tone: 'from-sky-950 via-cyan-900 to-teal-950',
  },
]

export const featuredSeries = catalog[0]!

export function railFor(categoryId: string): SeriesCard[] {
  switch (categoryId) {
    case 'continue':
      return catalog.slice(0, 4)
    case 'trending':
      return [...catalog].reverse().slice(0, 8)
    case 'romance':
      return catalog.filter((s) => s.genre === 'Romance')
    case 'fantasy':
      return catalog.filter((s) => ['Fantasy', 'Action', 'Sci-Fi'].includes(s.genre))
    case 'chat':
      return catalog.filter((s) => s.format === 'CHAT')
    case 'scroll':
      return catalog.filter((s) => s.format === 'SCROLL')
    case 'ebook':
      return catalog.filter((s) => s.format === 'EBOOK')
    default:
      return catalog
  }
}
