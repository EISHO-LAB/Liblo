/** Comics product catalog — covers from local manga-one scrape + Liblo art. */

export type ComicTitle = {
  id: string
  title: string
  subtitle: string
  cover: string
  chapter?: string
  views: number
  isUp?: boolean
  isOriginal?: boolean
  isNewSeason?: boolean
  isHot?: boolean
  /** 1-based chart place by views — drives TOP 10 / TOP 25 chips (not shown in ranking). */
  chartRank?: number
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
  { title: 'Midnight Signal', subtitle: 'A late-night chat becomes destiny', cover: c(1), chapter: 'Ep. 42', views: 11949, isUp: true, isOriginal: true, isHot: true, isNewSeason: true },
  { title: 'Rainy Roof', subtitle: 'Secrets on a wet city skyline', cover: c(2), chapter: 'Ep. 18', views: 9495, isUp: true, isHot: true },
  { title: 'Glass Garden', subtitle: 'Crystal blooms that never sleep', cover: c(3), chapter: 'Ep. 7', views: 7597, isUp: true, isOriginal: true, isNewSeason: true },
  { title: 'Blade Line', subtitle: 'One cut redraws the border', cover: c(4), chapter: 'Ep. 31', views: 4770, isUp: true, isHot: true },
  { title: 'Soft Orbit', subtitle: 'Two lives circling until gravity wins', cover: c(5), chapter: 'Ep. 12', views: 4228, isUp: true, isNewSeason: true },
  { title: 'Harbor Ghost', subtitle: 'Fog hides what the ships left behind', cover: c(6), chapter: 'Ep. 9', views: 3881 },
  { title: 'Office 12F', subtitle: 'Overtime turns into a second life', cover: c(7), chapter: 'Ep. 55', views: 3602, isUp: true, isHot: true },
  { title: 'Last Train', subtitle: 'The final carriage home', cover: c(8), chapter: 'Ep. 21', views: 3410 },
  { title: 'Paper Hearts', subtitle: 'Letters that rewrite a year', cover: c(9), chapter: 'Vol. 3', views: 2988, isNewSeason: true },
  { title: 'Nebula Diary', subtitle: 'A journal that opens another galaxy', cover: c(10), chapter: 'Ep. 4', views: 2771, isOriginal: true },
  { title: 'Silent Panel', subtitle: 'Quiet frames of ordinary days', cover: c(11), chapter: 'Ep. 88', views: 2654, isUp: true },
  { title: 'Orbit Letters', subtitle: 'Messages across the dark', cover: c(12), chapter: 'Ep. 16', views: 2501 },
  { title: 'Cerberus Club', subtitle: 'Three heads, one secret crush', cover: c(13), chapter: 'Ep. 6', views: 2390, isOriginal: true, isHot: true },
  { title: 'Sunday Spirit', subtitle: 'Magazine legends, remixed', cover: c(14), chapter: 'Ep. 2', views: 2214, isNewSeason: true },
  { title: 'Coin Hunter', subtitle: 'Pay to play… or play to win', cover: c(15), chapter: 'Ep. 11', views: 2108 },
  { title: 'Fairytale Out', subtitle: 'One-shot festival winners', cover: c(16), chapter: 'One-shot', views: 1995 },
  { title: 'Mob Pulse', subtitle: 'Power you never asked for', cover: c(17), chapter: 'Ep. 120', views: 1880, isHot: true },
  { title: 'Arena Ash', subtitle: 'Fight until the lights go out', cover: c(18), chapter: 'Ep. 67', views: 1766 },
  { title: 'Chao Bloom', subtitle: 'Girls’ manga, full sparkle', cover: c(19), chapter: 'Ep. 33', views: 1655 },
  { title: 'Flower Court', subtitle: 'Romance behind palace doors', cover: c(20), chapter: 'Ep. 14', views: 1544, isNewSeason: true },
  { title: 'Steel Sunday', subtitle: 'Weekly heroes assemble', cover: c(21), chapter: 'Ep. 201', views: 1433 },
  { title: 'Superior Edge', subtitle: 'Crime, heat, and late nights', cover: c(22), chapter: 'Ep. 45', views: 1322 },
  { title: 'Spirit Walk', subtitle: 'Ghosts on the commute', cover: c(23), chapter: 'Ep. 8', views: 1211, isUp: true },
  { title: 'Blue Ticket', subtitle: 'Win the trip of a lifetime', cover: c(24), chapter: 'Ep. 3', views: 1100 },
  { title: 'Mask Parade', subtitle: 'Who are you under it?', cover: c(25), chapter: 'Ep. 19', views: 998 },
  { title: 'Kitchen Wars', subtitle: 'Recipes and rivalry', cover: c(26), chapter: 'Ep. 27', views: 887 },
  { title: 'Neon Tutor', subtitle: 'Study sessions after dark', cover: c(27), chapter: 'Ep. 10', views: 776, isOriginal: true },
  { title: 'Drift School', subtitle: 'First love, last period', cover: c(28), chapter: 'Ep. 5', views: 665 },
  { title: 'Crown Debt', subtitle: 'Royalty with a price tag', cover: c(29), chapter: 'Ep. 22', views: 554 },
  { title: 'Pixel Heart', subtitle: 'Game world, real feelings', cover: c(30), chapter: 'Ep. 41', views: 443 },
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
