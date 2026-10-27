# Design source

**100% layout clone (English) of [マンガワン / Manga One](https://manga-one.com/)**

Implemented on branch **`kenji-design`** mainly by **TTIANQII**.  
Full style analysis for matching that work: **[`docs/TTIANQII_KENJI_DESIGN_STYLE.md`](./docs/TTIANQII_KENJI_DESIGN_STYLE.md)**

Local scrape: `~/Desktop/manga_one.com`  
Served assets: `Liblo-front/public/m1/` (UI chrome + scraped covers/banners for prototyping)

## What matches Manga One

- White desktop pill header (logo + nav + login / search / menu)
- Mobile centered logo capsule header
- Hero multi-card carousel + dots
- “Today’s updates!!” rail with **UP** badges + See more
- Weekday ranking tabs + ordinal badge cards + ORIGINAL badge
- Recommended / Original / One-shot / Comics rails with giant watermark text
- Light `RECOMMEND` band (`#f2f2f2`)
- Dot-grid dark body, magenta primary `#F6334F`
- Footer CTA + app badges + ABJ + mascot assets

## English / Liblo deltas

- All chrome copy translated to English
- Brand wordmark **LIBLO** (speech-bubble + book mark) instead of マンガワン logotype
- Title names/synopses are English placeholders — swap for your catalog later

## Note

Scraped manga artwork is for local UI prototyping only. Replace with licensed Liblo catalog before any public release.
