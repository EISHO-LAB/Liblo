/** Comics product catalog — covers from local manga-one scrape + Liblo art. */

export type ComicGenre =
  | 'original'
  | 'new'
  | 'action'
  | 'romance'
  | 'fantasy'
  | 'drama'
  | 'comedy'

export type ComicTitle = {
  id: string
  title: string
  /** Short pitch — used on genre ranking detail only. */
  subtitle: string
  /** Creator credit shown under the title on cards. */
  writer: string
  cover: string
  /** Deep link when the title has a real cover/reader page. */
  href?: string
  chapter?: string
  views: number
  genre?: ComicGenre
  isUp?: boolean
  isOriginal?: boolean
  isNewSeason?: boolean
  isHot?: boolean
  /** 1-based chart place by views — drives TOP 10 / TOP 25 chips (not shown in ranking). */
  chartRank?: number
}

export function comicTitleHref(title: Pick<ComicTitle, 'href'>): string {
  return title.href ?? '/comic'
}

/** Compact view score: 980 · 12.4k · 1.2m */
export function formatViews(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    const s = v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')
    return `${s}m`
  }
  if (n >= 1_000) {
    const v = n / 1_000
    const s = v >= 100 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')
    return `${s}k`
  }
  return String(n)
}

/** @deprecated Prefer ComicTitle */
export type M1Title = ComicTitle

const c = (n: number) => `/m1/portrait/p${String(n).padStart(2, '0')}.webp`
const coverBanner = (n: number) => `/m1/covers/c${String(n).padStart(2, '0')}.webp`

/** Real JP comic landscape banners only (no ultra-wide ranking strips / broken notice art). */
export const heroBanners = [
  { id: 'h1', title: 'Weekly Ranking Special', image: '/m1/banners/b01.webp', href: '/comic' },
  { id: 'h2', title: 'New Family — Updated Today', image: '/m1/banners/b02.webp', href: '/comic' },
  { id: 'h3', title: 'Salesman in Another World', image: '/m1/banners/b03.webp', href: '/comic' },
  { id: 'h4', title: 'MADBOY', image: coverBanner(1), href: '/comic' },
  { id: 'h5', title: 'Deadline Fever', image: coverBanner(2), href: '/comic' },
  { id: 'h6', title: 'Magic Library — Now Open', image: coverBanner(3), href: '/comic' },
  { id: 'h7', title: 'Frontline Romance', image: coverBanner(4), href: '/comic' },
  { id: 'h8', title: 'Editor Spotlight', image: coverBanner(5), href: '/comic' },
]

const titles: Omit<ComicTitle, 'id' | 'chartRank'>[] = [
  {
    title: 'Pepper & Carrot',
    subtitle: 'The Potion of Flight — open-source webcomic',
    writer: 'David Revoy',
    cover: '/opensource/pepper-carrot/cover-portrait-800.jpg',
    href: '/title/pepper-and-carrot',
    chapter: 'Ep. 1–2',
    views: 3_120_000,
    genre: 'fantasy',
    isUp: true,
    isOriginal: true,
    isHot: true,
    isNewSeason: true,
  },
  { title: 'Midnight Signal', subtitle: 'A late-night chat becomes destiny', writer: 'Rina Vale', cover: c(1), chapter: 'Ep. 42', views: 2_450_000, genre: 'romance', isUp: true, isOriginal: true, isHot: true, isNewSeason: true },
  { title: 'Rainy Roof', subtitle: 'Secrets on a wet city skyline', writer: 'Ken Mori', cover: c(2), chapter: 'Ep. 18', views: 1_180_000, genre: 'drama', isUp: true, isHot: true },
  { title: 'Glass Garden', subtitle: 'Crystal blooms that never sleep', writer: 'Aya Frost', cover: c(3), chapter: 'Ep. 7', views: 890_000, genre: 'fantasy', isUp: true, isOriginal: true, isNewSeason: true },
  { title: 'Blade Line', subtitle: 'One cut redraws the border', writer: 'Jin Park', cover: c(4), chapter: 'Ep. 31', views: 512_000, genre: 'action', isUp: true, isHot: true },
  { title: 'Soft Orbit', subtitle: 'Two lives circling until gravity wins', writer: 'Mia Chen', cover: c(5), chapter: 'Ep. 12', views: 348_000, genre: 'romance', isUp: true, isNewSeason: true },
  { title: 'Harbor Ghost', subtitle: 'Fog hides what the ships left behind', writer: 'Leo Hart', cover: c(6), chapter: 'Ep. 9', views: 276_000, genre: 'drama' },
  { title: 'Office 12F', subtitle: 'Overtime turns into a second life', writer: 'Sora Kim', cover: c(7), chapter: 'Ep. 55', views: 198_000, genre: 'comedy', isUp: true, isHot: true },
  { title: 'Last Train', subtitle: 'The final carriage home', writer: 'Noah Lee', cover: c(8), chapter: 'Ep. 21', views: 154_000, genre: 'drama' },
  { title: 'Paper Hearts', subtitle: 'Letters that rewrite a year', writer: 'Yui Sato', cover: c(9), chapter: 'Vol. 3', views: 121_000, genre: 'romance', isNewSeason: true },
  { title: 'Nebula Diary', subtitle: 'A journal that opens another galaxy', writer: 'Kai Nova', cover: c(10), chapter: 'Ep. 4', views: 98_500, genre: 'fantasy', isOriginal: true },
  { title: 'Silent Panel', subtitle: 'Quiet frames of ordinary days', writer: 'Hana Ide', cover: c(11), chapter: 'Ep. 88', views: 76_200, genre: 'drama', isUp: true },
  { title: 'Orbit Letters', subtitle: 'Messages across the dark', writer: 'Eli Quinn', cover: c(12), chapter: 'Ep. 16', views: 64_800, genre: 'romance' },
  { title: 'Cerberus Club', subtitle: 'Three heads, one secret crush', writer: 'LIBLO Studio', cover: c(13), chapter: 'Ep. 6', views: 52_400, genre: 'comedy', isOriginal: true, isHot: true },
  { title: 'Sunday Spirit', subtitle: 'Magazine legends, remixed', writer: 'Taro Mag', cover: c(14), chapter: 'Ep. 2', views: 41_900, genre: 'action', isNewSeason: true },
  { title: 'Coin Hunter', subtitle: 'Pay to play… or play to win', writer: 'Rex Coin', cover: c(15), chapter: 'Ep. 11', views: 33_600, genre: 'comedy' },
  { title: 'Fairytale Out', subtitle: 'One-shot festival winners', writer: 'Luna Reed', cover: c(16), chapter: 'One-shot', views: 28_100, genre: 'fantasy' },
  { title: 'Mob Pulse', subtitle: 'Power you never asked for', writer: 'Vin Cross', cover: c(17), chapter: 'Ep. 120', views: 22_700, genre: 'action', isHot: true },
  { title: 'Arena Ash', subtitle: 'Fight until the lights go out', writer: 'Ash Kane', cover: c(18), chapter: 'Ep. 67', views: 18_400, genre: 'action' },
  { title: 'Chao Bloom', subtitle: 'Girls’ manga, full sparkle', writer: 'Ploy Chao', cover: c(19), chapter: 'Ep. 33', views: 14_900, genre: 'romance' },
  { title: 'Flower Court', subtitle: 'Romance behind palace doors', writer: 'Iris Thorn', cover: c(20), chapter: 'Ep. 14', views: 12_200, genre: 'romance', isNewSeason: true },
  { title: 'Steel Sunday', subtitle: 'Weekly heroes assemble', writer: 'Max Steel', cover: c(21), chapter: 'Ep. 201', views: 9_850, genre: 'action' },
  { title: 'Superior Edge', subtitle: 'Crime, heat, and late nights', writer: 'Dane Voss', cover: c(22), chapter: 'Ep. 45', views: 7_640, genre: 'drama' },
  { title: 'Spirit Walk', subtitle: 'Ghosts on the commute', writer: 'Nori Shade', cover: c(23), chapter: 'Ep. 8', views: 5_210, genre: 'fantasy', isUp: true },
  { title: 'Blue Ticket', subtitle: 'Win the trip of a lifetime', writer: 'Sky Blue', cover: c(24), chapter: 'Ep. 3', views: 3_880, genre: 'comedy' },
  { title: 'Mask Parade', subtitle: 'Who are you under it?', writer: 'Vera Mask', cover: c(25), chapter: 'Ep. 19', views: 2_450, genre: 'drama' },
  { title: 'Kitchen Wars', subtitle: 'Recipes and rivalry', writer: 'Chef Jun', cover: c(26), chapter: 'Ep. 27', views: 1_620, genre: 'comedy' },
  { title: 'Neon Tutor', subtitle: 'Study sessions after dark', writer: 'Mika Neon', cover: c(27), chapter: 'Ep. 10', views: 980, genre: 'romance', isOriginal: true },
  { title: 'Drift School', subtitle: 'First love, last period', writer: 'Ren Drift', cover: c(28), chapter: 'Ep. 5', views: 740, genre: 'romance' },
  { title: 'Crown Debt', subtitle: 'Royalty with a price tag', writer: 'Crown & Co.', cover: c(29), chapter: 'Ep. 22', views: 520, genre: 'fantasy' },
  { title: 'Pixel Heart', subtitle: 'Game world, real feelings', writer: 'Pix Ell', cover: c(30), chapter: 'Ep. 41', views: 310, genre: 'comedy' },
]

const withIds: ComicTitle[] = titles.map((t, i) => ({
  ...t,
  id: `t${i + 1}`,
  cover: t.cover,
}))

/** Assign chartRank by views (1 = highest) for TOP 10 / TOP 25 chips. */
const byViews = [...withIds].sort((a, b) => b.views - a.views)
const rankById = new Map(byViews.map((t, i) => [t.id, i + 1]))

export const catalog: ComicTitle[] = withIds.map((t) => ({
  ...t,
  chartRank: rankById.get(t.id),
}))

export const todayUpdates = catalog.filter((t) => t.isUp).slice(0, 10)
export const rankingPool = catalog.slice(0, 7)
export const recommended = catalog.slice(0, 12)
export const originals = catalog.filter((t) => t.isOriginal)
export const oneShots = catalog.slice(15, 25)
export const comicsShelf = catalog.slice(5, 17)

/** Tabs for CategoryRanking (Overall + genres). */
export const rankingTabs = [
  { key: 'overall', label: 'Overall' },
  { key: 'original', label: 'Original' },
  { key: 'new', label: 'New' },
  { key: 'action', label: 'Action' },
  { key: 'romance', label: 'Romance' },
  { key: 'fantasy', label: 'Fantasy' },
  { key: 'drama', label: 'Drama' },
  { key: 'comedy', label: 'Comedy' },
] as const

export type RankingTabKey = (typeof rankingTabs)[number]['key']

export const RANKING_PREVIEW = 10
export const RANKING_MAX = 25

/** Ranked list for a category tab — up to 25 by views. */
export function rankingForTab(tab: RankingTabKey) {
  let pool = catalog
  if (tab === 'original') pool = catalog.filter((t) => t.isOriginal)
  else if (tab === 'new') pool = catalog.filter((t) => t.isNewSeason || t.isUp)
  else if (tab !== 'overall') pool = catalog.filter((t) => t.genre === tab)

  return [...pool].sort((a, b) => b.views - a.views).slice(0, RANKING_MAX)
}

export const days = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
] as const

export function todayKey(): (typeof days)[number]['key'] {
  const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
  return map[new Date().getDay()]!
}
