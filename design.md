# Frontend Design System

Single source of truth for all frontend UI in this product (reader app, writer studio, auth, commerce).

**Stack:** Vite + React + TypeScript + Bun + Tailwind CSS + shadcn/ui + ReUI + Arc (Uiarc) + Iconify

---

## Goals

- Netflix-style discovery home for novels / series
- Readers: vertical scroll (Webtoon-like), chat novel (Joylada-like), e-book
- Writers: studio for upload, block editing, scheduling, earnings
- One visual language across marketing-light surfaces and dense product UI
- Copy-owned components (no opaque UI npm lock-in for design kit pieces)

---

## Library roles (use in this order)

| Priority | Library | Use for | Do not use for |
|----------|---------|---------|----------------|
| 1 | **Tailwind CSS** | Layout, spacing, typography utilities, reader chrome, Netflix rails, page shells | Replacing Arc internal styles with raw hex / conflicting color classes on Arc nodes |
| 2 | **shadcn/ui** | Base primitives: Button, Input, Dialog, Sheet, Dropdown, Tabs, Form, Avatar, Card, Toast/Sonner | One-off marketing effects; heavy data grids (prefer ReUI) |
| 3 | **ReUI** (`@reui`) | Composed product patterns on Tailwind/shadcn: Data Grid, Filters, File Upload, Stepper, Timeline, Kanban-like studio flows, dashboard blocks | Replacing every shadcn primitive; icons (use Iconify) |
| 4 | **Arc / Uiarc** (`@uiarc`) | Polished product blocks + motion-aware controls (settings, onboarding, pickers, charts, calm product surfaces). CSS Modules + tokens | Mixing Tailwind color utilities on Arc component roots; reinventing Arc focus rings |
| 5 | **Iconify** (`@iconify/react`) | **All** app icons we control | Do not default to Lucide/Heroicons as the project icon system (Arc may still ship Lucide internally; leave Arc internals alone) |

### Decision cheat sheet

```text
Need a basic control?          → shadcn
Need a composed studio/admin
pattern (table, filters,
upload, stepper)?              → ReUI registry item
Need a calm animated product
block / settings / onboarding? → Arc (@uiarc)
Need an icon?                  → Iconify only
Need page layout / rails?      → Tailwind (+ shadcn primitives)
```

When two libraries overlap, prefer **one surface family per screen region**:

- Reader discovery + reader chrome → Tailwind + shadcn (+ Iconify)
- Writer studio dense tools → shadcn + ReUI (+ Iconify)
- Account / settings / onboarding writer KYC → Arc blocks where they fit, else shadcn forms

---

## Tooling baseline

| Piece | Choice |
|-------|--------|
| App | Vite + React 19 + TypeScript |
| Package manager / scripts | Bun |
| Styling | Tailwind CSS v4 (align with ReUI docs) |
| Component install | `bunx shadcn@latest …` |
| Icons | `@iconify/react` |
| Path alias | `@/*` → `./src/*` |

---

## Project layout (frontend)

```text
.
  design.md                 # this file
  components.json
  src/
    main.tsx
    styles/
      globals.css           # Tailwind + CSS variables (shadcn theme)
    components/
      ui/                   # shadcn primitives
      reui/                 # ReUI installed / composed pieces (if CLI targets here)
      arc/                  # Arc foundation + Arc components (CLI default)
      icons/
        icon.tsx            # thin Iconify wrapper
      domain/               # product UI (home rails, readers, studio)
    lib/
      utils.ts              # cn() for Tailwind/shadcn
    pages/ or routes/
```

Keep **domain components** free of raw third-party marketing demos. Compose from the three registries + Iconify.

---

## `components.json` registries

Configure once; install everything through the shadcn CLI.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@reui": "https://reui.io/r/{style}/{name}.json",
    "@uiarc": "https://uiarc.dev/r/{name}.json"
  }
}
```

Notes:

- **shadcn:** `bunx shadcn@latest add button dialog sheet tabs form`
- **ReUI:** `bunx shadcn@latest add @reui/c-data-grid-1` (free `c-*` items; premium needs license header — see [ReUI registry](https://reui.io/docs/registry))
- **Arc:** `bunx shadcn@latest add @uiarc/arc-foundation` then `bunx shadcn@latest add @uiarc/button @uiarc/dialog`
- Vite projects: `rsc: false`. Map `@` in both `tsconfig` and `vite.config.ts`.

### Arc foundation (required once)

```ts
// src/main.tsx
import "@/components/arc/foundation.css";
import "@/styles/globals.css";
```

Arc theme hooks (when using Arc surfaces):

- Dark: `data-theme="dark"` on `<html>`
- Accent: `data-accent` = `neutral` | `violet` | `blue` | `green` | `amber` | `orange` | `coral` | `rose`

Prefer **one** accent for the product (suggest `rose` or `amber` for entertainment reading — avoid default purple-on-white AI look). Keep shadcn CSS variables aligned to the same accent family.

---

## Iconify standard

### Install

```bash
bun add @iconify/react
```

Optional offline sets for production reliability:

```bash
bun add -d @iconify-json/lucide @iconify-json/mdi @iconify-json/solar
```

### Wrapper (mandatory)

```tsx
// src/components/icons/icon.tsx
import { Icon as IconifyIcon, type IconProps } from "@iconify/react";
import { cn } from "@/lib/utils";

type Props = IconProps & {
  className?: string;
};

/** Project icon primitive — use this everywhere instead of ad-hoc icon imports. */
export function Icon({ className, width = 20, height = 20, ...props }: Props) {
  return (
    <IconifyIcon
      width={width}
      height={height}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
```

### Usage rules

- Always: `<Icon icon="lucide:home" />` or `mdi:…` / `solar:…`
- Prefer **Lucide** set via Iconify for UI chrome consistency (`lucide:search`, `lucide:bookmark`, `lucide:pen-line`)
- Reader immersive chrome: prefer simple stroke icons; avoid filled noisy sets
- Do not sprinkle multiple icon libraries in domain code
- Sizes: 16 (dense), 20 (default), 24 (nav), 32 (empty states)

```tsx
import { Icon } from "@/components/icons/icon";

<button type="button" className="inline-flex items-center gap-2">
  <Icon icon="lucide:book-open" width={20} height={20} />
  Continue reading
</button>
```

---

## Visual direction (product)

Entertainment / reading platform — not a SaaS dashboard first impression on the **reader home**.

### Reader home (Netflix-like)

- Full-bleed hero series backdrop
- Brand mark as a primary signal in the first viewport
- Horizontal rails: Continue, Trending, Romance, Chat novels, New scroll series, E-books
- Cards = posters / covers only (interaction containers). No badge clutter on hero art
- Motion: subtle rail slide, hero fade/ken-burns light, hover scale on covers (2–3 intentional motions max per view)

### Readers

| Mode | UI notes |
|------|----------|
| Scroll comic | Centered column ~800px content width; virtualized strips; minimal chrome; progress bar |
| Chat novel | Mobile-first column; avatar + bubble blocks; character color tokens; soft system messages |
| E-book | Serif/readable measure, theme sepia/night, font size controls |

### Writer studio

- Dense but calm: ReUI grids/filters/upload + shadcn forms
- Episode pipeline: draft → assets → preview → schedule → publish (Stepper)
- KYC / payout onboarding: Arc or shadcn multi-step forms; clear fee/percentage copy

### Color & type

- Define tokens in `globals.css` (shadcn variables) and keep Arc `data-accent` in sync
- Avoid: purple-indigo gradient cliché, cream+terracotta default, broadsheet dense rules, glow soup, emoji as UI
- Expressive display font for brand/hero; readable text font for chat/ebook body (load via Fontsource or similar — not system Inter-only)

---

## Screen → library map

| Surface | Primary building blocks |
|---------|-------------------------|
| Login / register | shadcn Form + Arc input/button if already installed |
| Netflix home | Tailwind layout + shadcn Skeleton/Button + Iconify |
| Series detail | Tailwind + shadcn Tabs/Dialog + Iconify |
| Scroll reader | Custom domain + Tailwind; Iconify chrome |
| Chat reader | Custom block renderer + Tailwind; shadcn Avatar |
| E-book reader | Custom + Tailwind |
| Studio dashboard | ReUI composed + shadcn |
| Upload scroll episode | ReUI file upload / stepper |
| Chat episode editor | Custom block editor + shadcn + Iconify |
| Earnings / payout | ReUI Data Grid + shadcn + Arc settings blocks |
| Admin (later) | ReUI Data Grid + Filters |

---

## Install cookbook (Bun + Vite)

```bash
# from Liblo-front root
bunx shadcn@latest init

# primitives
bunx shadcn@latest add button input label textarea select checkbox switch
bunx shadcn@latest add dialog sheet drawer dropdown-menu popover tabs
bunx shadcn@latest add card badge avatar separator scroll-area skeleton
bunx shadcn@latest add form sonner table

# Arc foundation + core
bunx shadcn@latest add @uiarc/arc-foundation
bunx shadcn@latest add @uiarc/button @uiarc/dialog @uiarc/input

# ReUI examples (pick concrete catalog ids as needed)
bunx shadcn@latest add @reui/c-file-upload-1
bunx shadcn@latest add @reui/c-data-grid-1
bunx shadcn@latest add @reui/c-filters-1
bunx shadcn@latest add @reui/c-stepper-1

# icons
bun add @iconify/react
```

Browse catalogs:

- shadcn: https://ui.shadcn.com  
- ReUI: https://reui.io/components  
- Arc: https://uiarc.dev  

---

## Coding conventions

1. **Own the source** — registry components live in-repo; customize tokens, do not wrap forever in unreachable abstractions.
2. **`cn()`** for Tailwind class merges on shadcn/ReUI surfaces.
3. **Do not** put Tailwind color utilities on Arc component roots (Arc uses CSS Modules + semantic variables).
4. **Do not** hand-roll focus rings on Arc; use foundation tokens.
5. **Icons** only through `@/components/icons/icon`.
6. **Accessibility:** keyboard paths for reader chrome and studio; `prefers-reduced-motion` respected (Arc already branches; custom motion must too).
7. **Performance:** virtualize webtoon strips; lazy cover images; avoid loading entire ReUI/Arc catalogs — install only what a feature needs.
8. **RTL / i18n later:** keep string literals out of low-level UI primitives.

---

## Agent / contributor rules

When adding UI:

1. Read this file first.
2. Prefer existing `components/ui`, `components/reui`, `components/arc` before inventing.
3. Install missing pieces with `bunx shadcn@latest add …` (correct registry prefix).
4. Map the screen to the table above; do not mix three libraries in one tiny control.
5. Use Iconify names, not SVG paste, unless the asset is brand-specific.
6. For reader hero/home, follow the visual direction section (brand-first, no hero sticker clutter).

---

## Out of scope for this document

- Backend API, Prisma, auth implementation details
- Exact brand name / final palette hex (set during visual identity pass; keep tokens centralized)
- Native mobile apps (web-first; reuse tokens later)

---

## Changelog

| Date | Change |
|------|--------|
| 2026-10-26 | Initial design system: Tailwind + shadcn + ReUI + Arc (Uiarc) + Iconify |
