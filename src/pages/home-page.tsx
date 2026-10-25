import { Icon } from '@/components/icons/icon'
import { Button } from '@/components/ui/button'

const rails = [
  {
    title: 'Continue reading',
    items: ['Midnight Chat', 'Rainy Roof', 'Glass Garden'],
  },
  {
    title: 'Trending scroll series',
    items: ['Blade Line', 'Soft Orbit', 'Harbor Ghost'],
  },
  {
    title: 'Chat novels',
    items: ['Office 12F', 'Last Train', 'Paper Hearts'],
  },
]

export function HomePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-background/90 to-transparent">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:book-open" width={24} height={24} className="text-primary" />
          <span className="text-xl font-semibold tracking-tight">Liblo</span>
        </div>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Icon icon="lucide:search" />
          </Button>
          <Button variant="secondary" size="sm">
            <Icon icon="lucide:pen-line" width={16} height={16} />
            Studio
          </Button>
        </nav>
      </header>

      <section className="relative flex min-h-[78dvh] items-end overflow-hidden px-6 pb-16 pt-28">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.12_45/_0.45),transparent_55%),linear-gradient(180deg,oklch(0.2_0.03_40),oklch(0.12_0.02_40))]"
        />
        <div className="relative z-10 max-w-xl space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Featured</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Stories that scroll, chat, and stay with you</h1>
          <p className="max-w-md text-muted-foreground">
            Read vertical comics, Joylada-style chat novels, and e-books in one place. Write and publish from the same account.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button size="lg">
              <Icon icon="lucide:play" />
              Start reading
            </Button>
            <Button size="lg" variant="outline">
              Browse catalog
            </Button>
          </div>
        </div>
      </section>

      <main className="space-y-10 px-6 pb-16">
        {rails.map((rail) => (
          <section key={rail.title} className="space-y-4">
            <h2 className="text-lg font-medium">{rail.title}</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {rail.items.map((title) => (
                <article
                  key={title}
                  className="group w-36 shrink-0 cursor-pointer sm:w-40"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-md bg-card ring-1 ring-border transition duration-300 group-hover:scale-[1.03]">
                    <div className="flex h-full items-end bg-gradient-to-t from-black/70 to-transparent p-3">
                      <span className="text-sm font-medium leading-snug">{title}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
