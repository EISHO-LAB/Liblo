# Liblo Design System — Master

Source: ui-ux-pro-max recommendations adapted for **Netflix-style browse + minimal cosmic**.

## Product

Entertainment reading platform (scroll comics, chat novels, e-books). Immersive, content-first, discovery-heavy.

## Style

- Minimal cosmic: deep space voids, soft nebula haze, sparse stars, quiet chrome
- Netflix browse: left icon sidebar + hero + horizontal category rails
- Avoid: purple-indigo gradients, emoji icons, card clutter on hero, heavy glow soup

## Color tokens

| Role | Hex | Notes |
|------|-----|-------|
| Background | `#05050A` | Near-void |
| Surface | `#0C0C14` | Rails / panels |
| Elevated | `#14141F` | Hover / cards |
| Foreground | `#F4F2EC` | Soft starlight |
| Muted | `#8B8798` | Secondary text |
| Border | `#1E1E2A` | Hairlines |
| Accent | `#7DD3FC` | Cosmic cyan CTA |
| Accent soft | `#A5F3FC` | Highlights |
| Warm | `#E8C99B` | Brand secondary / titles |

## Typography

- Display / brand: **Outfit**
- Body / UI: **DM Sans**
- Base 16px, line-height 1.5; display tracking tight (−0.02em)

## Layout

- Sidebar: 72px collapsed icons (expand labels on desktop hover/focus)
- Main: hero ~78dvh with parallax layer, then stacked rails
- Rail cards: poster 2:3, hover scale 1.04 / 200ms, no badge clutter on art
- Mobile: bottom-safe content; sidebar becomes top icon strip or sheet

## Motion

- Micro 150–250ms ease-out
- Hero parallax: translateY on scroll (disabled under `prefers-reduced-motion`)
- Rail enter: subtle fade/slide once
- Max 2–3 intentional motions per viewport

## Accessibility

- Contrast ≥4.5:1 on text
- Icon buttons have aria-label
- Focus rings visible (cyan soft)
- Touch targets ≥44px
- Horizontal rails: keyboard scroll affordance + no page-level horizontal overflow
