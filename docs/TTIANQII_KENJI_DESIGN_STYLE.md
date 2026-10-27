# TTIANQII / kenji-design — design style guide

Analysis of **TTIANQII** (`ttianqii.dev@gmail.com`) work on branch **`kenji-design`**, from the Manga One shell commit through the latest visual consistency pass.

Use this doc when building or restyling Liblo UI so new surfaces match his comic-home language — not Netflix-purple gradients, not generic AI cream/serif layouts.

**Primary references**

| Item | Value |
|------|--------|
| Branch | `kenji-design` |
| Author | TTIANQII |
| Anchor commit | `d7e8351` — *Enhance Liblo UI with Manga One design elements* |
| Latest polish | `3ed7ba1` — *Refactor comic components to enhance visual consistency* |
| Layout source | [Manga One](https://manga-one.com/) (English Liblo shell) + MagaPocket-style badges |
| Tokens / CSS | `src/styles/globals.css` |
| Comic UI | `src/components/comic/*` |
| Short source note | `DESIGN_SOURCE.md` |

---

## 1. Design thesis

1. **Manga One structure, MagaPocket badge language, Liblo brand.**  
   Home/comic rails clone Manga One density and chrome; cover badges borrow MagaPocket (ORIGINAL glass, TOP pills, ¥0 → ฿0 promo squares).
2. **Dark catalog body + white “paper” bands.**  
   Page chrome is `#111`. Ranking / product / recommend strips often flip to **white** or `#f2f2f2` so covers pop.
3. **Cover-first cards.**  
   Portrait covers (`aspect-[3/4]` or `2/3`) carry status; titles stay short one-liners with tiny chips.
4. **Expressive display type, quiet UI type.**  
   Headings = Outfit ExtraBold. Body/meta = DM Sans, small, medium–bold — never Inter/Roboto as the face of the brand.
5. **Sharp micro-UI, soft large radius.**  
   Chips ≈ `2px` radius. Covers ≈ `rounded-lg`. Header = **full pill**. Avoid over-rounded “AI SaaS” pills everywhere.

---

## 2. Color system

Defined in `globals.css` (`@theme` + `:root`).

| Token / role | Hex / value | Use |
|--------------|-------------|-----|
| Background | `#111111` | Page, dark rails |
| Surface | `#1a1a1a` | Panels, dot-grid base |
| Surface 2 | `#242424` | Elevated dark blocks |
| Brand / m1 | `#F6334F` | Primary CTA, accents, HOT chip |
| Brand soft | `#FF6278` | Eyebrows, hover soft red |
| Chip red | `#E1203C` | UP / N / FREE-leaning badges |
| TOP25 gray | `#5A5A5A` | Lower chart pill |
| Deal blue | `#2F6BFF` | Promo “deal” tone (also chat product wash) |
| Brand blue | `#1A7AFF` | Secondary brand (sparingly) |
| Light band | `#F2F2F2` | Header pill, light recommend |
| Light title | `#111` / `#333` | Text on white bands |
| Light meta | `#888` / `#AAA` | Writer / views on light |
| Dark meta | `white/50`–`white/40` | Writer / views on dark |
| Match green | `#22C55E` | Success / match (rare) |
| Border | `rgba(255,255,255,0.12)` | Dark hairlines |
| Cover ring (light) | `ring-black/8` | Subtle card edge on white |

**Rules**

- Primary interactive red is **`#F6334F`**, not purple, not Netflix `#E50914` as the hero identity (legacy `netflix-*` tokens alias to the same magenta family).
- On white sections, headings go **near-black**; red is reserved for icons, chips, CTAs.
- Do not invent a second accent palette per page unless it maps to an existing tone (`hot` / `free` / `deal`).

---

## 3. Typography

| Role | Font | Weight / size cues |
|------|------|--------------------|
| Display | **Outfit Variable** (`font-display`) | ExtraBold / Black; home hero `text-4xl`→`md:text-6xl`, `leading-[1.05]`; section titles `text-lg`→`md:text-xl` or `text-2xl` |
| UI / body | **DM Sans Variable** (`font-sans`) | Default body; card titles ~`12px` bold; meta ~`10–11px` |
| Watermark | Outfit ExtraBold | `clamp(3.5rem, 12vw, 7rem)`, `tracking-[0.04em]`, ~6% opacity |
| Rank numeral | Outfit + `.rank-num` | Black fill, **5px white stroke**, drop-shadow |
| Eyebrow | DM Sans | `12px`, bold, `tracking-[0.22em]`, uppercase, `text-m1-soft` |

**Rules**

- Truncate card titles (`truncate`); never wrap long titles under covers.
- Prefer `font-extrabold` / `font-black` for section headers — kenji-design is high-contrast type, not light editorial serif.

---

## 4. Layout & spacing

| Pattern | Spec |
|---------|------|
| Content width | `max-w-[1200px]` + `px-4 md:px-6` |
| Header height | `--header-h: 64px`; desktop float pill with `pt-3` |
| Section rhythm | Tight stacks (`mb-4`, `gap-3`); ranking grids `gap-3` |
| Cover aspect | Ranking/cards: **`aspect-[3/4]`**; some rails `2/3` |
| Cover radius | `rounded-lg` |
| Object fit | `object-cover object-top` (faces stay in frame) |
| Horizontal rails | `overflow-x-auto` + `.scrollbar-hide` |
| Alternating bands | Dark `#111` ↔ white ↔ `#f2f2f2` recommend |

**Composition**

- Giant **watermark** word behind section titles (`.m1-watermark` / `-light`).
- Section header row: title left (+ optional flame icon in brand red), meta/date or controls right.
- Product hub: full-bleed blurred hero image under dark scrim, then white product grid.

---

## 5. Header chrome (signature)

Desktop (`SiteHeader`):

- Floating **pill** `rounded-full bg-[#f2f2f2]` with soft shadow.
- Logo **LIBLO** in brand red (speech-bubble mark).
- Nav: `13px` bold `#111`, hover `text-m1`.
- Actions: **black** `rounded-lg` buttons (login, search, menu) — high contrast squares on the light pill.

Mobile: centered logo capsule; menu overlay.

Do not replace this with a flat full-bleed dark nav unless explicitly redesigning the whole product shell.

---

## 6. Comic card anatomy

Canonical stack (see `DayRanking`, `RecommendRail`, `TodayUpdates`):

```
┌─────────────────────┐
│ ORIGINAL   TOP10    │  ← CoverOriginalBadge TL / CoverChartBadge TR
│                     │
│      COVER ART      │  ← aspect 3/4, rounded-lg
│              [฿0]   │  ← ComicPromoBadge BR (optional)
└─────────────────────┘
  12  RANK              ← ComicRankBadge straddles BL (ranking only)
UP HOT Title title…
writer·········· 👁 12.4k
```

| Component | Behavior |
|-----------|----------|
| `CoverOriginalBadge` | `bg-black/55` + blur, `8px` extrabold, top-left |
| `CoverChartBadge` | Pill; TOP10 = `#e1203c`, TOP25 = `#5a5a5a`; only if `chartRank ≤ 25`; **not** on ranking boards that already show numerals |
| `ComicPromoBadge` | Bottom-right; tones `hot` / `free` / `deal`; white “฿0” strip; hot uses jagged `clip-path` |
| `ComicRankBadge` | `.rank-num`, absolute `-left-2.5`, `translate-y-[16%]` |
| `ComicTitleLine` | UP **or** N (new season), optional HOT, then truncated title |
| `ComicCardMeta` | Writer left, eye + `formatViews` right |

Chip CSS (`.comic-chip*`): ~`9px`, weight 800, radius **`2px`**, red fills — sharp, not soft pills (except TOP chart pills which are `rounded-full`).

---

## 7. Motion & interaction

- Cover hover: mild `scale-[1.02]` on featured ranking art (`duration-500`).
- Rails: button scroll by ~360px.
- Hero carousel: multi-card + dots (Manga One style).
- Custom thin overlay scrollbars (native scrollbars hidden globally).
- Prefer intentional, quiet motion — not glow storms or bouncing pills.

---

## 8. Component / file map (ttianqii)

| Area | Path |
|------|------|
| Tokens | `src/styles/globals.css` |
| Header / footer | `src/components/layout/*` |
| Logo | `src/components/brand/liblo-logo.tsx` |
| Comic system | `src/components/comic/*` |
| Home hub | `src/pages/home-page.tsx` |
| Comics surface | `src/pages/comic/*` |
| Catalog data | `src/data/comic/*` |
| Assets | `public/m1/*`, `public/brand/*` |

---

## 9. Commit arc (what he optimized)

1. **`d7e8351`** — Full Manga One English shell: header pill, rails, watermarks, assets, `#F6334F`.
2. **Hero / day-ranking / today-updates** — Responsive density, promo badge system, carousel spacing.
3. **`2dfa84a`+** — Genre tabs + `CategoryRanking` (MagaPocket board: featured #1 + list).
4. **`c5f3c04` → `3ed7ba1`** — Shared `ComicTitleLine`, cover badges, `ComicCardMeta`, view formatting; ORIGINAL glass badge replaces older ticket mark on covers.

When matching his style, prefer **reusing these primitives** over one-off badge CSS.

---

## 10. Do / don’t (for agents & new pages)

**Do**

- Use Outfit + DM Sans and the magenta brand tokens above.
- Alternate dark and white section bands for catalog browsing.
- Put status on the **cover** (ORIGINAL / TOP / promo) and keep title rows compact.
- Keep max content width ~1200px and the floating light header pill.
- Use English chrome copy; brand as **LIBLO**.

**Don’t**

- Default to purple/indigo SaaS gradients or cream+terracotta “AI landing” tropes.
- Use large soft full-pill chips for UP/HOT (those stay sharp `2px`).
- Dump long synopses under every card — synopsis belongs on title/detail, not rail cards.
- Fight the Manga One information density with sparse “hero-only” marketing layouts on `/comic`.
- Restyle writer/studio tools to look Netflix-dashboard unless they still share tokens (brand red, Outfit, `#111` body).

---

## 11. Quick recipe — new catalog section

1. Section wrapper: `relative` + `bg-[#111]` or `bg-white`.
2. Optional `m1-watermark` / `m1-watermark-light`.
3. Header: `font-display font-extrabold` + small meta right.
4. Grid or horizontal rail of cover cards (`aspect-[3/4] rounded-lg`).
5. Compose `CoverOriginalBadge` + `CoverChartBadge` + `ComicTitleLine` + `ComicCardMeta`.
6. CTA “See more”: `.see-more-btn` (black, `12px`, `rounded-4px`).

---

## 12. Related docs

- `DESIGN_SOURCE.md` — short Manga One provenance.
- This file — **how to draw like TTIANQII on kenji-design**.

When in doubt, open `/comic` and `/` on `kenji-design` (or current branch merged from it) and match spacing, badge placement, and type weights before inventing new patterns.
