export type CoinPack = {
  /** DB id when loaded from API; falls back to slug for mock */
  id: string
  slug: string
  name: string
  coins: number
  bonus: number
  /** Major currency units (THB) */
  price: number
  priceCents?: number
  currency?: string
  artwork: string
  badge?: string
}

/** Local fallback if the API is offline — mirrors seed DEFAULT_COIN_PACKS. */
export const mockCoinPacks: CoinPack[] = [
  {
    id: 'starter',
    slug: 'starter',
    name: 'A new chapter',
    coins: 100,
    bonus: 0,
    price: 35,
    artwork: 'coin-single',
  },
  {
    id: 'stack',
    slug: 'stack',
    name: 'Keep turning pages',
    coins: 300,
    bonus: 15,
    price: 100,
    artwork: 'coin-stack',
    badge: '+15 bonus',
  },
  {
    id: 'pile',
    slug: 'pile',
    name: 'Just one more episode',
    coins: 500,
    bonus: 25,
    price: 169,
    artwork: 'coin-pile',
    badge: 'Most popular',
  },
  {
    id: 'pouch',
    slug: 'pouch',
    name: 'For the binge reader',
    coins: 1000,
    bonus: 100,
    price: 330,
    artwork: 'coin-pouch',
  },
  {
    id: 'satchel',
    slug: 'satchel',
    name: 'A whole new world',
    coins: 3000,
    bonus: 500,
    price: 999,
    artwork: 'coin-satchel',
  },
  {
    id: 'chest',
    slug: 'chest',
    name: 'Your next obsession',
    coins: 5000,
    bonus: 1500,
    price: 1650,
    artwork: 'coin-chest',
    badge: 'Biggest bonus',
  },
]

/** @deprecated Prefer mockCoinPacks or fetchCoinPacks() */
export const coinPacks = mockCoinPacks

export const formatCoins = (value: number) => value.toLocaleString('en-US')
export const formatBaht = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB' }).format(value)

type ApiPack = {
  id: string
  slug: string
  name: string
  coins: number
  bonusCoins: number
  price: number
  priceCents: number
  currency: string
  badge: string | null
  artwork: string | null
}

export async function fetchCoinPacks(): Promise<{
  packs: CoinPack[]
  payments: { enabled: boolean; publishableKey: string | null }
  source: 'api' | 'mock'
}> {
  try {
    const res = await fetch('/api/payments/coin-packs')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as {
      packs: ApiPack[]
      payments?: { enabled: boolean; publishableKey: string | null }
    }
    if (!Array.isArray(data.packs) || data.packs.length === 0) throw new Error('empty')
    return {
      packs: data.packs.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        coins: p.coins,
        bonus: p.bonusCoins,
        price: p.price,
        priceCents: p.priceCents,
        currency: p.currency,
        artwork: p.artwork || 'coin-single',
        badge: p.badge ?? undefined,
      })),
      payments: data.payments ?? { enabled: false, publishableKey: null },
      source: 'api',
    }
  } catch {
    return {
      packs: mockCoinPacks,
      payments: { enabled: false, publishableKey: null },
      source: 'mock',
    }
  }
}

export async function startCoinPackCheckout(packId: string) {
  const res = await fetch(`/api/payments/coin-packs/${packId}/checkout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Checkout failed (${res.status})`)
  }
  return data as {
    mode: 'stripe' | 'stub'
    checkoutUrl?: string
    purchaseId?: string
    wallet?: { coinBalance: number }
    totalCoins?: number
  }
}

/** In-app pay page — PaymentIntent client secret for Stripe Elements. */
export async function startCoinPackPaymentIntent(packId: string) {
  const res = await fetch(`/api/payments/coin-packs/${packId}/payment-intent`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || `Could not start payment (${res.status})`,
    )
  }
  return data as {
    mode: 'stripe' | 'stub'
    clientSecret?: string
    paymentIntentId?: string
    purchaseId?: string
    pack?: ApiPack
    totalCoins?: number
    wallet?: { coinBalance: number }
    payments?: { enabled: boolean; publishableKey: string | null }
  }
}

export async function confirmCoinPackPurchase(purchaseId: string) {
  const res = await fetch(`/api/payments/purchases/${purchaseId}/confirm`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Confirm failed (${res.status})`)
  }
  return data as {
    status: string
    fulfilled?: boolean
    wallet?: { coinBalance: number }
  }
}
