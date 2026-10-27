// Local icon data keeps the coin shop complete without a network icon lookup.
const outline = (path: string) => ({
  width: 24,
  height: 24,
  body: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</g>`,
})

export const coinIcons = {
  arrowRight: outline('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  check: outline('<path d="m5 12 4 4L19 6"/>'),
  close: outline('<path d="m6 6 12 12M6 18 18 6"/>'),
  history: outline('<path d="M3 11a9 9 0 1 1 2.4 7M3 4v7h7m2-4v5l3 2"/>'),
  info: outline('<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>'),
  plus: outline('<path d="M12 5v14M5 12h14"/>'),
  book: outline(
    '<path d="M12 6v15m0-15C9 3 5 3 2 4v15c3-1 7-1 10 2m0-15c3-3 7-3 10-2v15c-3-1-7-1-10 2"/>',
  ),
}
