# Liblo-front

Reader + writer studio frontend for **Liblo** — novels, vertical scroll series, chat novels, and e-books.

## Stack

- Bun + Vite + React + TypeScript
- Tailwind CSS v4
- shadcn/ui + ReUI + Arc (Uiarc) — see `design.md`
- Iconify (`@/components/icons/icon`)

## Develop

```bash
bun install
bun dev
```

API proxy: `/api` → `http://localhost:3000` (Liblo-back).

## UI conventions

Read [`design.md`](./design.md) before adding components. Install registry pieces with:

```bash
bunx shadcn@latest add button
bunx shadcn@latest add @reui/c-file-upload-1
bunx shadcn@latest add @uiarc/arc-foundation
```
