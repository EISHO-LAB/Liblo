/** Comics product catalog — Japanese manga covers (AniList CDN links). */

import { jpCover } from './jp-covers'

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

export function comicTitleHref(title: Pick<ComicTitle, "href">): string {
  return title.href ?? "/comic"
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

const coverBanner = (n: number) =>
  `/m1/covers/c${String(((n - 1) % 61) + 1).padStart(2, '0')}.webp`

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

type Seed = {
  title: string
  subtitle: string
  writer: string
  genre: Exclude<ComicGenre, 'original' | 'new'>
}

/** 100 unique series seeds — names, pitches, writers, genres. */
const SEEDS: Seed[] = [
  { title: 'Pepper & Carrot', subtitle: 'The Potion of Flight — open-source webcomic', writer: 'David Revoy', genre: 'fantasy' },
  { title: 'Midnight Signal', subtitle: 'A late-night chat becomes destiny', writer: 'Rina Vale', genre: 'romance' },
  { title: 'Rainy Roof', subtitle: 'Secrets on a wet city skyline', writer: 'Ken Mori', genre: 'drama' },
  { title: 'Glass Garden', subtitle: 'Crystal blooms that never sleep', writer: 'Aya Frost', genre: 'fantasy' },
  { title: 'Blade Line', subtitle: 'One cut redraws the border', writer: 'Jin Park', genre: 'action' },
  { title: 'Soft Orbit', subtitle: 'Two lives circling until gravity wins', writer: 'Mia Chen', genre: 'romance' },
  { title: 'Harbor Ghost', subtitle: 'Fog hides what the ships left behind', writer: 'Leo Hart', genre: 'drama' },
  { title: 'Office 12F', subtitle: 'Overtime turns into a second life', writer: 'Sora Kim', genre: 'comedy' },
  { title: 'Last Train', subtitle: 'The final carriage home', writer: 'Noah Lee', genre: 'drama' },
  { title: 'Paper Hearts', subtitle: 'Letters that rewrite a year', writer: 'Yui Sato', genre: 'romance' },
  { title: 'Nebula Diary', subtitle: 'A journal that opens another galaxy', writer: 'Kai Nova', genre: 'fantasy' },
  { title: 'Silent Panel', subtitle: 'Quiet frames of ordinary days', writer: 'Hana Ide', genre: 'drama' },
  { title: 'Orbit Letters', subtitle: 'Messages across the dark', writer: 'Eli Quinn', genre: 'romance' },
  { title: 'Cerberus Club', subtitle: 'Three heads, one secret crush', writer: 'LIBLO Studio', genre: 'comedy' },
  { title: 'Sunday Spirit', subtitle: 'Magazine legends, remixed', writer: 'Taro Mag', genre: 'action' },
  { title: 'Coin Hunter', subtitle: 'Pay to play… or play to win', writer: 'Rex Coin', genre: 'comedy' },
  { title: 'Fairytale Out', subtitle: 'One-shot festival winners', writer: 'Luna Reed', genre: 'fantasy' },
  { title: 'Mob Pulse', subtitle: 'Power you never asked for', writer: 'Vin Cross', genre: 'action' },
  { title: 'Arena Ash', subtitle: 'Fight until the lights go out', writer: 'Ash Kane', genre: 'action' },
  { title: 'Chao Bloom', subtitle: 'Girls’ manga, full sparkle', writer: 'Ploy Chao', genre: 'romance' },
  { title: 'Flower Court', subtitle: 'Romance behind palace doors', writer: 'Iris Thorn', genre: 'romance' },
  { title: 'Steel Sunday', subtitle: 'Weekly heroes assemble', writer: 'Max Steel', genre: 'action' },
  { title: 'Superior Edge', subtitle: 'Crime, heat, and late nights', writer: 'Dane Voss', genre: 'drama' },
  { title: 'Spirit Walk', subtitle: 'Ghosts on the commute', writer: 'Nori Shade', genre: 'fantasy' },
  { title: 'Blue Ticket', subtitle: 'Win the trip of a lifetime', writer: 'Sky Blue', genre: 'comedy' },
  { title: 'Mask Parade', subtitle: 'Who are you under it?', writer: 'Vera Mask', genre: 'drama' },
  { title: 'Kitchen Wars', subtitle: 'Recipes and rivalry', writer: 'Chef Jun', genre: 'comedy' },
  { title: 'Neon Tutor', subtitle: 'Study sessions after dark', writer: 'Mika Neon', genre: 'romance' },
  { title: 'Drift School', subtitle: 'First love, last period', writer: 'Ren Drift', genre: 'romance' },
  { title: 'Crown Debt', subtitle: 'Royalty with a price tag', writer: 'Crown & Co.', genre: 'fantasy' },
  { title: 'Pixel Heart', subtitle: 'Game world, real feelings', writer: 'Pix Ell', genre: 'comedy' },
  // 31–100
  { title: 'Velvet Alarm', subtitle: 'When the siren means love', writer: 'Ada Wren', genre: 'romance' },
  { title: 'Iron Petal', subtitle: 'A knight who only blooms at dusk', writer: 'Goro Ike', genre: 'fantasy' },
  { title: 'Taxi 404', subtitle: 'Wrong turn, right person', writer: 'Bee Tran', genre: 'comedy' },
  { title: 'Redline Choir', subtitle: 'Sing until the asphalt breaks', writer: 'Jin Park', genre: 'action' },
  { title: 'Moonlit Desk', subtitle: 'Editors fall harder than deadlines', writer: 'Yui Sato', genre: 'romance' },
  { title: 'Ash Protocol', subtitle: 'The city burns on schedule', writer: 'Vin Cross', genre: 'action' },
  { title: 'Pond Mirror', subtitle: 'Reflections that talk back', writer: 'Aya Frost', genre: 'fantasy' },
  { title: 'Cafe After', subtitle: 'Open only when hearts close', writer: 'Rina Vale', genre: 'drama' },
  { title: 'Bolt Sisters', subtitle: 'Lightning in matching jackets', writer: 'Ploy Chao', genre: 'action' },
  { title: 'Ink Roommate', subtitle: 'He draws; she erases', writer: 'Sora Kim', genre: 'comedy' },
  { title: 'Glass Alibi', subtitle: 'Every window is a witness', writer: 'Dane Voss', genre: 'drama' },
  { title: 'Starfarm', subtitle: 'Crops that grow in zero-g', writer: 'Kai Nova', genre: 'fantasy' },
  { title: 'Locker 7', subtitle: 'Notes nobody was meant to find', writer: 'Mia Chen', genre: 'romance' },
  { title: 'Hollow Bell', subtitle: 'The temple rings for one soul', writer: 'Nori Shade', genre: 'fantasy' },
  { title: 'Rush Hour Kiss', subtitle: 'Platform 3, forever late', writer: 'Noah Lee', genre: 'romance' },
  { title: 'Chrome Fang', subtitle: 'Mechs with a soft spot', writer: 'Ash Kane', genre: 'action' },
  { title: 'Friday Ghost', subtitle: 'TGIF has a shadow', writer: 'Leo Hart', genre: 'drama' },
  { title: 'Sugar Duel', subtitle: 'Bake-off with knives out', writer: 'Chef Jun', genre: 'comedy' },
  { title: 'Royal Wi-Fi', subtitle: 'Password is the prophecy', writer: 'Crown & Co.', genre: 'fantasy' },
  { title: 'Sidewalk King', subtitle: 'Dance battles at dawn', writer: 'Rex Coin', genre: 'comedy' },
  { title: 'Pale Comet', subtitle: 'She fell from the wrong sky', writer: 'Eli Quinn', genre: 'fantasy' },
  { title: 'Contract Heart', subtitle: 'Love with a renewal clause', writer: 'Iris Thorn', genre: 'romance' },
  { title: 'Night Mechanic', subtitle: 'Fixing bikes, breaking rules', writer: 'Max Steel', genre: 'action' },
  { title: 'Quiet Stadium', subtitle: 'Empty seats, loud feelings', writer: 'Hana Ide', genre: 'drama' },
  { title: 'Bubble Rank', subtitle: 'Climb the chart or pop', writer: 'Taro Mag', genre: 'comedy' },
  { title: 'Silver Latch', subtitle: 'Keys to a house that moves', writer: 'Luna Reed', genre: 'fantasy' },
  { title: 'Crosswalk Crush', subtitle: 'Green light means go… maybe', writer: 'Mika Neon', genre: 'romance' },
  { title: 'Dust Runner', subtitle: 'Outrun the sandstorm inside', writer: 'Vin Cross', genre: 'action' },
  { title: 'Porcelain Lie', subtitle: 'Smile cracked, story sealed', writer: 'Vera Mask', genre: 'drama' },
  { title: 'Loop Cafe', subtitle: 'Same order, new timeline', writer: 'Pix Ell', genre: 'comedy' },
  { title: 'Thorn Ballet', subtitle: 'Dance until the roses bleed', writer: 'Iris Thorn', genre: 'drama' },
  { title: 'Sky Freight', subtitle: 'Cargo holds hearts too', writer: 'Sky Blue', genre: 'action' },
  { title: 'Winter Inbox', subtitle: 'One unread message left', writer: 'Ken Mori', genre: 'romance' },
  { title: 'Echo Armor', subtitle: 'The suit remembers every hit', writer: 'Ash Kane', genre: 'action' },
  { title: 'Garden Password', subtitle: 'Bloom if you belong', writer: 'Aya Frost', genre: 'fantasy' },
  { title: 'Bench Warmer', subtitle: 'Second string, first love', writer: 'Ren Drift', genre: 'romance' },
  { title: 'Blackboard Crush', subtitle: 'Chalk dust and destiny', writer: 'Sora Kim', genre: 'comedy' },
  { title: 'Tide Clerk', subtitle: 'Ocean files never close', writer: 'Leo Hart', genre: 'drama' },
  { title: 'Hex Market', subtitle: 'Spells on sale, no refunds', writer: 'Nori Shade', genre: 'fantasy' },
  { title: 'Turbo Etiquette', subtitle: 'Manners at 200 km/h', writer: 'Jin Park', genre: 'action' },
  { title: 'Pink Receipt', subtitle: 'Love taxed at 7%', writer: 'Ploy Chao', genre: 'romance' },
  { title: 'Fog Archive', subtitle: 'Classified feelings only', writer: 'Dane Voss', genre: 'drama' },
  { title: 'Comic Strike', subtitle: 'Editors vs. the blank page', writer: 'Taro Mag', genre: 'comedy' },
  { title: 'Lantern Due', subtitle: 'Pay with a memory', writer: 'Luna Reed', genre: 'fantasy' },
  { title: 'Elevator 13', subtitle: 'Stops between floors of fate', writer: 'Rina Vale', genre: 'romance' },
  { title: 'Shard Patrol', subtitle: 'Guarding a broken city', writer: 'Max Steel', genre: 'action' },
  { title: 'Sofa Kingdom', subtitle: 'Weekend warriors of rest', writer: 'Rex Coin', genre: 'comedy' },
  { title: 'Marble Vow', subtitle: 'Promises carved too deep', writer: 'Crown & Co.', genre: 'drama' },
  { title: 'Pixel Bailiff', subtitle: 'Arrested by the game master', writer: 'Pix Ell', genre: 'fantasy' },
  { title: 'Umbrella Two', subtitle: 'Share or get soaked', writer: 'Yui Sato', genre: 'romance' },
  { title: 'Gutter Crown', subtitle: 'King of the back alley', writer: 'Ash Kane', genre: 'action' },
  { title: 'Static Soft', subtitle: 'Radio love at 3 a.m.', writer: 'Kai Nova', genre: 'drama' },
  { title: 'Berry Heist', subtitle: 'Sweet crime, bitter chase', writer: 'Chef Jun', genre: 'comedy' },
  { title: 'Rune Intern', subtitle: 'Magic unpaid overtime', writer: 'Aya Frost', genre: 'fantasy' },
  { title: 'Dockside Halo', subtitle: 'Saints don’t work the pier', writer: 'Leo Hart', genre: 'drama' },
  { title: 'Heart Buffer', subtitle: 'Loading feelings… 99%', writer: 'Mika Neon', genre: 'romance' },
  { title: 'Alloy Tears', subtitle: 'Robots that learn to cry', writer: 'Vin Cross', genre: 'action' },
  { title: 'Postcard War', subtitle: 'Mail that starts battles', writer: 'Eli Quinn', genre: 'comedy' },
  { title: 'Obsidian Pet', subtitle: 'A familiar with attitude', writer: 'Nori Shade', genre: 'fantasy' },
  { title: 'Stage Left Crush', subtitle: 'Curtain call for two', writer: 'Hana Ide', genre: 'romance' },
  { title: 'Concrete Bloom', subtitle: 'Flowers through asphalt', writer: 'Mia Chen', genre: 'drama' },
  { title: 'Rapid Sketch', subtitle: 'Draw faster than fate', writer: 'LIBLO Studio', genre: 'action' },
  { title: 'Honey Trap Cafe', subtitle: 'Desserts with side quests', writer: 'Bee Tran', genre: 'comedy' },
  { title: 'Ivory Signal', subtitle: 'White noise, black truth', writer: 'Ada Wren', genre: 'drama' },
  { title: 'Comet Lease', subtitle: 'Rent a star, keep the wish', writer: 'Sky Blue', genre: 'fantasy' },
  { title: 'Final Draft Love', subtitle: 'Rewrite until it fits', writer: 'Yui Sato', genre: 'romance' },
  { title: 'Brake Light', subtitle: 'Stop means stay with me', writer: 'Jin Park', genre: 'action' },
  { title: 'Mochi Spy', subtitle: 'Soft cover, hard intel', writer: 'Sora Kim', genre: 'comedy' },
  { title: 'Chapel Static', subtitle: 'Vows under bad reception', writer: 'Vera Mask', genre: 'drama' },
  { title: 'Grove Protocol', subtitle: 'Trees that enforce the law', writer: 'Goro Ike', genre: 'fantasy' },
  { title: 'Spark Roommate', subtitle: 'Shared wattage, shared fate', writer: 'Ren Drift', genre: 'romance' },
  { title: 'Null Hero', subtitle: 'Power level: undefined', writer: 'Pix Ell', genre: 'action' },
  { title: 'Apron Duel', subtitle: 'Cook-off of destinies', writer: 'Chef Jun', genre: 'comedy' },
  { title: 'Tidebound', subtitle: 'The sea keeps receipts', writer: 'Leo Hart', genre: 'drama' },
  { title: 'Prism Shift', subtitle: 'Color decides the ending', writer: 'Aya Frost', genre: 'fantasy' },
  { title: 'Late Fee Love', subtitle: 'Overdue hearts return', writer: 'Rina Vale', genre: 'romance' },
]

const SEEDS_100 = SEEDS.slice(0, 100) // includes Pepper + 99 more

/** Smooth view curve: #1 ~2.5m → #100 ~200 */
function viewsForRank(rank1: number): number {
  const t = (rank1 - 1) / 99
  const v = 2_500_000 * Math.pow(1 - t, 2.15) + 180
  return Math.round(v)
}

const titles: Omit<ComicTitle, 'id' | 'chartRank'>[] = SEEDS_100.map((s, i) => {
  const rankHint = i + 1 // temporary order; real chartRank from views sort
  const views = viewsForRank(rankHint)
  const ep = 3 + ((i * 7) % 120)
  const isUp = i % 4 === 0 || i % 7 === 3
  const isOriginal = i % 5 === 0 || i % 11 === 2
  const isHot = i < 18 || i % 9 === 1
  const isNewSeason = i % 6 === 1 || i % 13 === 0

  return {
    title: s.title,
    subtitle: s.subtitle,
    writer: s.writer,
    cover: jpCover(i),
    chapter: i % 17 === 5 ? 'One-shot' : i % 11 === 4 ? `Vol. ${(i % 5) + 1}` : `Ep. ${ep}`,
    views,
    genre: s.genre,
    isUp: isUp || undefined,
    isOriginal: isOriginal || undefined,
    isHot: isHot || undefined,
    isNewSeason: isNewSeason || undefined,
  }
})

const withIds: ComicTitle[] = titles.map((t, i) => {
  const base = { ...t, id: `t${i + 1}` }
  if (t.title === "Pepper & Carrot") {
    return {
      ...base,
      cover: "/opensource/pepper-carrot/cover-portrait-600x800.jpg",
      href: "/title/pepper-and-carrot",
      isUp: true,
      isOriginal: true,
      isHot: true,
      isNewSeason: true,
      chapter: "Ep. 1–2",
      views: 3_120_000,
    }
  }
  return base
})

/** Assign chartRank by views (1 = highest) for TOP 10 / TOP 25 chips. */
const byViews = [...withIds].sort((a, b) => b.views - a.views)
const rankById = new Map(byViews.map((t, i) => [t.id, i + 1]))

export const catalog: ComicTitle[] = withIds.map((t) => ({
  ...t,
  chartRank: rankById.get(t.id),
}))

export const todayUpdates = catalog.filter((t) => t.isUp).slice(0, 21)
export const rankingPool = [...catalog].sort((a, b) => b.views - a.views).slice(0, 7)
export const recommended = [...catalog].sort((a, b) => b.views - a.views).slice(0, 16)
export const originals = catalog.filter((t) => t.isOriginal)
export const oneShots = catalog.filter((t) => t.chapter === 'One-shot').slice(0, 12)
export const comicsShelf = catalog.slice(8, 28)

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
