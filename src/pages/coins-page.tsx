import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CoinDialog } from '@/components/coins/coin-dialog'
import { Icon } from '@/components/icons/icon'
import { coinIcons } from '@/data/coin-icons'
import {
  fetchCoinPacks,
  formatBaht,
  formatCoins,
  mockCoinPacks,
  type CoinPack,
} from '@/data/coin-packs'
import { useAuth } from '@/lib/auth'
import { readDemoWallet } from '@/lib/demo-wallet'
import '@/styles/coins.css'

const faqs = [
  [
    'What are Liblo coins?',
    'Coins are used to unlock paid episodes and stories on Liblo. Choose a pack that suits the way you read.',
  ],
  [
    'How do bonus coins work?',
    'The bonus shown on a pack is added alongside its regular coins. For example, the 500 + 25 pack adds 525 coins to your demo wallet.',
  ],
  [
    'Will I be charged?',
    'Continue opens a secure payment page. If Chrome or your phone already has Google Pay / Apple Pay, you can pick a saved card. Otherwise enter a new card — Liblo never stores the number. Without Stripe keys, the page stays in demo mode and nothing is charged.',
  ],
]

export function CoinsPage() {
  const { user } = useAuth()
  return user ? <CoinShop key={user.id} userId={user.id} /> : null
}

function CoinShop({ userId }: { userId: string }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [wallet, setWallet] = useState(() => readDemoWallet(userId))
  const [packs, setPacks] = useState<CoinPack[]>(mockCoinPacks)
  const [paymentsEnabled, setPaymentsEnabled] = useState(false)
  const [packSlug, setPackSlug] = useState('pile')
  const [modal, setModal] = useState<'history' | 'success' | null>(null)
  const pack = packs.find((item) => item.slug === packSlug) ?? packs[2] ?? mockCoinPacks[2]!
  const total = pack.coins + pack.bonus
  const balance = wallet.purchased + wallet.bonus
  const closeModal = () => setModal(null)

  useEffect(() => {
    let cancelled = false
    void fetchCoinPacks().then((result) => {
      if (cancelled) return
      setPacks(result.packs)
      setPaymentsEnabled(result.payments.enabled)
      setPackSlug((current) =>
        result.packs.some((p) => p.slug === current)
          ? current
          : (result.packs[0]?.slug ?? 'pile'),
      )
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (searchParams.get('checkout') !== 'success') return
    setWallet(readDemoWallet(userId))
    setModal('success')
    const next = new URLSearchParams(searchParams)
    next.delete('checkout')
    next.delete('purchaseId')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams, userId])

  function goToPayment() {
    navigate(`/coins/pay?pack=${encodeURIComponent(pack.slug)}`)
  }

  return (
    <main className="coin-shop">
      <div className="coin-container">
        <nav aria-label="Breadcrumb" className="coin-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span aria-current="page">Buy coins</span>
        </nav>

        <header className="coin-intro">
          <div>
            <p className="coin-eyebrow">
              <span /> THE LIBLO COIN SHOP
            </p>
            <h1>
              More coins.
              <br />
              More <span>chapters.</span>
            </h1>
            <p className="coin-intro-copy">
              Keep the good stories going. Top up and unlock your next favorite.
            </p>
          </div>
          <section className="coin-wallet" aria-label="Your demo wallet">
            <div className="coin-wallet-heading">
              <span>Your balance</span>
              <span className="coin-demo-label">DEMO WALLET</span>
            </div>
            <div className="coin-balance" aria-live="polite">
              <img src="/brand/liblo-coin.svg" alt="" />
              <strong>{formatCoins(balance)}</strong>
              <span>coins</span>
            </div>
            <div className="coin-wallet-bottom">
              <p>
                Purchased <b>{formatCoins(wallet.purchased)}</b>
                <span>·</span>Bonus <b>{formatCoins(wallet.bonus)}</b>
              </p>
              <button
                type="button"
                onClick={() => setModal('history')}
                aria-label="View top-up history"
              >
                <Icon icon={coinIcons.history} width={15} height={15} /> History
              </button>
            </div>
          </section>
        </header>

        <div className="coin-store-layout">
          <section
            className="coin-packs-section"
            aria-labelledby="coin-packs-heading"
          >
            <div className="coin-section-heading">
              <div>
                <h2 id="coin-packs-heading">Pick your pack</h2>
                <p>A little top-up or a whole reading marathon.</p>
              </div>
              <span className="coin-currency">THB ฿</span>
            </div>
            <fieldset className="coin-pack-grid">
              <legend className="sr-only">Choose a coin package</legend>
              {packs.map((item) => (
                <label
                  key={item.slug}
                  className={`coin-pack ${packSlug === item.slug ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="coin-pack"
                    value={item.slug}
                    checked={packSlug === item.slug}
                    onChange={() => setPackSlug(item.slug)}
                    className="sr-only"
                  />
                  {item.badge ? (
                    <span
                      className={`coin-pack-badge ${item.slug === 'chest' ? 'is-gold' : ''}`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                  <span className="coin-radio" aria-hidden="true">
                    {packSlug === item.slug ? (
                      <Icon icon={coinIcons.check} width={12} height={12} />
                    ) : null}
                  </span>
                  <img
                    className="coin-pack-art"
                    src={`/coins/${item.artwork}.svg`}
                    alt=""
                    width={240}
                    height={180}
                  />
                  <span className="coin-pack-amount">
                    {formatCoins(item.coins)}
                    {item.bonus ? (
                      <span> + {formatCoins(item.bonus)}</span>
                    ) : null}
                  </span>
                  <span className="coin-pack-name">{item.name}</span>
                  <span className="coin-pack-bottom">
                    <strong>{formatBaht(item.price)}</strong>
                    <span>
                      {item.bonus
                        ? `+${formatCoins(item.bonus)} bonus`
                        : 'Starter pack'}
                    </span>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="coin-pack-note">
              <Icon icon={coinIcons.info} width={14} height={14} /> One-time
              packs. Pick one whenever you need more coins.
            </p>
          </section>

          <aside className="coin-order" aria-labelledby="coin-order-heading">
            <div className="coin-order-top">
              <span className="coin-eyebrow">YOUR NEXT CHAPTER</span>
              <h2 id="coin-order-heading">A good story awaits.</h2>
            </div>
            <div className="coin-order-art">
              <div />
              <img src={`/coins/${pack.artwork}.svg`} alt="" />
            </div>
            <div className="coin-order-details" aria-live="polite">
              <div>
                <span>Coin pack</span>
                <b>{formatCoins(pack.coins)} coins</b>
              </div>
              <div>
                <span>Bonus coins</span>
                <b className="coin-gold">+{formatCoins(pack.bonus)}</b>
              </div>
              <div className="coin-order-total">
                <span>You get</span>
                <b>
                  <img src="/brand/liblo-coin.svg" alt="" />
                  {formatCoins(total)} <small>coins</small>
                </b>
              </div>
              <div className="coin-order-price">
                <span>Total</span>
                <b>{formatBaht(pack.price)}</b>
              </div>
            </div>
            <button type="button" className="coin-primary-button" onClick={goToPayment}>
              Continue to payment
              <Icon icon={coinIcons.arrowRight} width={18} height={18} />
            </button>
            <p className="coin-checkout-note">
              {paymentsEnabled
                ? 'Next: pick a saved wallet card or enter a new card'
                : 'Next: demo card page · no charge until Stripe keys are set'}
            </p>
            <div className="coin-order-foot">
              <Icon icon={coinIcons.book} width={17} height={17} />
              <span>
                Big feelings. New worlds.
                <br />
                Your next favorite is a chapter away.
              </span>
            </div>
          </aside>
        </div>

        <section
          className="coin-premium"
          aria-labelledby="coin-premium-heading"
        >
          <div className="coin-premium-intro">
            <span className="coin-premium-label">FOR THE EVERYDAY READER</span>
            <h2 id="coin-premium-heading">Make it a monthly thing.</h2>
            <p>
              A little extra for your reading ritual.
              <br />
              Liblo Premium is on its way.
            </p>
            <span className="coin-coming-soon">Coming soon</span>
          </div>
          {[
            { coins: 150, bonus: 50, price: 49, name: 'Premium' },
            { coins: 300, bonus: 150, price: 99, name: 'Premium Plus' },
          ].map((plan) => (
            <article key={plan.name} className="coin-premium-plan">
              <p>{plan.name}</p>
              <div className="coin-premium-amount">
                <img src="/brand/liblo-coin.svg" alt="" />
                <strong>
                  {plan.coins}
                  <span> + {plan.bonus}</span>
                </strong>
              </div>
              <p className="coin-premium-benefit">
                <Icon icon={coinIcons.check} width={14} height={14} /> Bonus
                coins every month
              </p>
              <p className="coin-premium-plan-price">
                {formatBaht(plan.price)}
                <span> / month</span>
              </p>
            </article>
          ))}
        </section>

        <section className="coin-help" aria-labelledby="coin-help-heading">
          <div>
            <p className="coin-eyebrow">GOOD TO KNOW</p>
            <h2 id="coin-help-heading">A few little details.</h2>
            <p>
              Need a hand?{' '}
              <Link to="/help">
                Visit the Help Center <span aria-hidden="true">↗</span>
              </Link>
            </p>
          </div>
          <div className="coin-faqs">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Icon icon={coinIcons.plus} width={17} height={17} />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <footer className="coin-footer">
          <Link to="/">LIBLO</Link>
          <p>Every coin starts a new chapter.</p>
          <Link to="/comic">
            Find your next read <span aria-hidden="true">→</span>
          </Link>
        </footer>
      </div>

      {modal ? (
        <CoinDialog
          title={
            modal === 'history'
              ? 'Your top-up history'
              : 'Ready for the next chapter.'
          }
          onClose={closeModal}
        >
          {modal === 'history' ? (
            wallet.history.length ? (
              <>
                <p className="coin-modal-muted">
                  Demo activity saved in this browser. Showing the latest 20
                  top-ups.
                </p>
                <ul className="coin-history">
                  {wallet.history.map((entry) => (
                    <li key={entry.id}>
                      <img src="/brand/liblo-coin.svg" alt="" />
                      <div>
                        <strong>
                          +{formatCoins(entry.coins + entry.bonus)} coins
                        </strong>
                        <span>
                          {new Intl.DateTimeFormat('en-GB', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            timeZone: 'Asia/Bangkok',
                          }).format(new Date(entry.date))}{' '}
                          ICT
                        </span>
                      </div>
                      <b>{formatBaht(entry.price)}</b>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="coin-empty-history">
                <Icon icon={coinIcons.history} width={32} height={32} />
                <h3>Your story starts here.</h3>
                <p>
                  Your demo top-ups will appear here once you choose your first
                  pack.
                </p>
                <button
                  type="button"
                  className="coin-primary-button"
                  onClick={closeModal}
                >
                  Explore coin packs
                </button>
              </div>
            )
          ) : (
            <div className="coin-success">
              <img src={`/coins/${pack.artwork}.svg`} alt="" />
              <h3>{formatCoins(total)} coins ready.</h3>
              <p>
                Your balance shows <b>{formatCoins(balance)} coins</b>
                {paymentsEnabled
                  ? '. Thanks for topping up.'
                  : '. Demo payment — no card was charged.'}
              </p>
              <button
                type="button"
                className="coin-primary-button"
                onClick={closeModal}
              >
                Back to the shop
              </button>
              <Link to="/comic" onClick={closeModal}>
                Explore stories →
              </Link>
            </div>
          )}
        </CoinDialog>
      ) : null}
    </main>
  )
}
