import type { CoinPack } from '@/data/coin-packs'

export type DemoTopUp = {
  id: string
  date: string
  coins: number
  bonus: number
  price: number
}

export type DemoWallet = {
  purchased: number
  bonus: number
  history: DemoTopUp[]
}

export function readDemoWallet(userId: string): DemoWallet {
  try {
    const value = JSON.parse(
      localStorage.getItem(`liblo.demo.wallet.${userId}`) ?? 'null',
    )
    if (
      value &&
      Number.isSafeInteger(value.purchased) &&
      value.purchased >= 0 &&
      Number.isSafeInteger(value.bonus) &&
      value.bonus >= 0 &&
      Array.isArray(value.history)
    ) {
      const history = value.history
        .filter(
          (item: DemoTopUp) =>
            typeof item?.id === 'string' &&
            typeof item.date === 'string' &&
            Number.isFinite(Date.parse(item.date)) &&
            Number.isSafeInteger(item.coins) &&
            item.coins > 0 &&
            Number.isSafeInteger(item.bonus) &&
            item.bonus >= 0 &&
            Number.isFinite(item.price) &&
            item.price > 0,
        )
        .slice(0, 20)
      return { purchased: value.purchased, bonus: value.bonus, history }
    }
  } catch {
    /* A fresh demo wallet is safe if storage is unavailable or invalid. */
  }
  return { purchased: 0, bonus: 0, history: [] }
}

export function saveDemoWallet(userId: string, wallet: DemoWallet) {
  localStorage.setItem(`liblo.demo.wallet.${userId}`, JSON.stringify(wallet))
}

export function topUpDemoWallet(
  userId: string,
  wallet: DemoWallet,
  pack: CoinPack,
): DemoWallet {
  const next = {
    purchased: wallet.purchased + pack.coins,
    bonus: wallet.bonus + pack.bonus,
    history: [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        coins: pack.coins,
        bonus: pack.bonus,
        price: pack.price,
      },
      ...wallet.history,
    ].slice(0, 20),
  }
  saveDemoWallet(userId, next)
  return next
}
