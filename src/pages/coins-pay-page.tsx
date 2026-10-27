import {
  Elements,
  ExpressCheckoutElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe, type Stripe, type StripeExpressCheckoutElementReadyEvent } from '@stripe/stripe-js'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { coinIcons } from '@/data/coin-icons'
import {
  confirmCoinPackPurchase,
  fetchCoinPacks,
  formatBaht,
  formatCoins,
  mockCoinPacks,
  startCoinPackPaymentIntent,
  type CoinPack,
} from '@/data/coin-packs'
import { useAuth } from '@/lib/auth'
import { readDemoWallet, topUpDemoWallet } from '@/lib/demo-wallet'
import '@/styles/coins.css'
import '@/styles/coins-pay.css'

let stripePromiseCache: Promise<Stripe | null> | null = null
function getStripePromise(publishableKey: string) {
  if (!stripePromiseCache) {
    stripePromiseCache = loadStripe(publishableKey)
  }
  return stripePromiseCache
}

export function CoinsPayPage() {
  const { user } = useAuth()
  const [params] = useSearchParams()
  const packKey = params.get('pack') || 'pile'
  if (!user) return null
  return <CoinPayFlow key={`${user.id}-${packKey}`} userId={user.id} packKey={packKey} />
}

function CoinPayFlow({ userId, packKey }: { userId: string; packKey: string }) {
  const navigate = useNavigate()
  const [pack, setPack] = useState<CoinPack | null>(null)
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'stripe' | 'stub'>('stub')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [purchaseId, setPurchaseId] = useState<string | null>(null)
  const [publishableKey, setPublishableKey] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const catalog = await fetchCoinPacks()
        const found =
          catalog.packs.find((p) => p.slug === packKey || p.id === packKey) ??
          mockCoinPacks.find((p) => p.slug === packKey) ??
          catalog.packs[0] ??
          mockCoinPacks[2]!
        if (cancelled) return
        setPack(found)

        try {
          const intent = await startCoinPackPaymentIntent(found.id)
          if (cancelled) return

          if (intent.mode === 'stub') {
            setMode('stub')
            setPhase('ready')
            return
          }

          if (!intent.clientSecret || !intent.payments?.publishableKey) {
            throw new Error('Payment is missing Stripe credentials')
          }

          setMode('stripe')
          setClientSecret(intent.clientSecret)
          setPurchaseId(intent.purchaseId ?? null)
          setPublishableKey(intent.payments.publishableKey)
          setPhase('ready')
        } catch {
          // API down or Stripe unset — still show the card entry page in demo mode.
          if (cancelled) return
          setMode('stub')
          setPhase('ready')
        }
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Could not open payment')
        setPhase('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [packKey])

  const stripePromise = useMemo(
    () => (publishableKey ? getStripePromise(publishableKey) : null),
    [publishableKey],
  )

  if (phase === 'loading' || !pack) {
    return (
      <main className="coin-pay">
        <div className="coin-pay-shell">
          <p className="coin-pay-status">Preparing secure checkout…</p>
        </div>
      </main>
    )
  }

  if (phase === 'error') {
    return (
      <main className="coin-pay">
        <div className="coin-pay-shell">
          <nav aria-label="Breadcrumb" className="coin-breadcrumb">
            <Link to="/coins">Buy coins</Link>
            <span>/</span>
            <span aria-current="page">Payment</span>
          </nav>
          <div className="coin-pay-error-card" role="alert">
            <h1>Couldn’t open payment</h1>
            <p>{error || 'Something went wrong starting checkout.'}</p>
            <Link to="/coins" className="coin-primary-button">
              Back to coin shop
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const total = pack.coins + pack.bonus

  return (
    <main className="coin-pay">
      <div className="coin-pay-shell">
        <nav aria-label="Breadcrumb" className="coin-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/coins">Buy coins</Link>
          <span>/</span>
          <span aria-current="page">Payment</span>
        </nav>

        <header className="coin-pay-intro">
          <p className="coin-eyebrow">
            <span /> SECURE PAYMENT
          </p>
          <h1>How do you want to pay?</h1>
          <p>
            If Chrome or your phone already has a card or wallet, we’ll offer it
            first. Otherwise enter a new card — Liblo never stores the number.
          </p>
        </header>

        <div className="coin-pay-layout">
          <section className="coin-pay-panel" aria-labelledby="coin-pay-methods-heading">
            <h2 id="coin-pay-methods-heading">Payment method</h2>

            {mode === 'stripe' && clientSecret && stripePromise ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#0071eb',
                      colorBackground: '#1a1a1a',
                      colorText: '#f5f5f5',
                      colorDanger: '#ff6278',
                      borderRadius: '12px',
                      fontFamily: 'inherit',
                    },
                  },
                }}
              >
                <StripePayForm
                  pack={pack}
                  purchaseId={purchaseId}
                  onPaid={() => navigate(`/coins?checkout=success&pack=${pack.slug}`, { replace: true })}
                  onCancel={() => navigate('/coins')}
                />
              </Elements>
            ) : (
              <DemoCardForm
                userId={userId}
                pack={pack}
                onPaid={() => navigate(`/coins?checkout=success&pack=${pack.slug}`, { replace: true })}
                onCancel={() => navigate('/coins')}
              />
            )}
          </section>

          <aside className="coin-pay-summary" aria-labelledby="coin-pay-summary-heading">
            <span className="coin-eyebrow">ORDER</span>
            <h2 id="coin-pay-summary-heading">{pack.name}</h2>
            <img src={`/coins/${pack.artwork}.svg`} alt="" width={180} height={135} />
            <dl>
              <div>
                <dt>Coins</dt>
                <dd>{formatCoins(pack.coins)}</dd>
              </div>
              <div>
                <dt>Bonus</dt>
                <dd className="coin-gold">+{formatCoins(pack.bonus)}</dd>
              </div>
              <div className="coin-pay-summary-total">
                <dt>You get</dt>
                <dd>
                  <img src="/brand/liblo-coin.svg" alt="" />
                  {formatCoins(total)}
                </dd>
              </div>
              <div className="coin-pay-summary-price">
                <dt>Total</dt>
                <dd>{formatBaht(pack.price)}</dd>
              </div>
            </dl>
            <p className="coin-pay-lock">
              <Icon icon={coinIcons.info} width={14} height={14} />
              Card details go only to Stripe. Apple Pay & Google Pay appear when
              this browser has a wallet linked.
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}

function StripePayForm({
  pack,
  purchaseId,
  onPaid,
  onCancel,
}: {
  pack: CoinPack
  purchaseId: string | null
  onPaid: () => void
  onCancel: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [walletReady, setWalletReady] = useState(false)
  const total = pack.coins + pack.bonus

  async function finishPaid() {
    if (purchaseId) {
      try {
        await confirmCoinPackPurchase(purchaseId)
      } catch {
        // Webhook may still credit; UI continues to success.
      }
    }
    onPaid()
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!stripe || !elements || submitting) return
    setSubmitting(true)
    setError('')
    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Check your card details')
      setSubmitting(false)
      return
    }
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/coins?checkout=success&pack=${pack.slug}`,
      },
    })
    if (result.error) {
      setError(result.error.message || 'Payment failed')
      setSubmitting(false)
      return
    }
    await finishPaid()
  }

  return (
    <form className="coin-pay-form" onSubmit={handleSubmit}>
      <div className={`coin-pay-wallets ${walletReady ? 'is-visible' : ''}`}>
        <p className="coin-pay-wallets-label">
          {walletReady
            ? 'A wallet on this browser is ready — pick a saved card'
            : 'Checking for Google Pay / Apple Pay on this browser…'}
        </p>
        <ExpressCheckoutElement
          options={{
            paymentMethods: {
              googlePay: 'always',
              applePay: 'always',
              link: 'auto',
            },
            layout: { maxColumns: 1, maxRows: 3, overflow: 'auto' },
          }}
          onReady={(event: StripeExpressCheckoutElementReadyEvent) => {
            const methods = event.availablePaymentMethods
            setWalletReady(Boolean(methods && Object.values(methods).some(Boolean)))
          }}
          onConfirm={async () => {
            if (!stripe || !elements || submitting) return
            setSubmitting(true)
            setError('')
            const result = await stripe.confirmPayment({
              elements,
              redirect: 'if_required',
              confirmParams: {
                return_url: `${window.location.origin}/coins?checkout=success&pack=${pack.slug}`,
              },
            })
            if (result.error) {
              setError(result.error.message || 'Wallet payment failed')
              setSubmitting(false)
              return
            }
            await finishPaid()
          }}
        />
      </div>

      <div className="coin-pay-divider" role="separator">
        <span>{walletReady ? 'Or enter a new card' : 'Enter card details'}</span>
      </div>

      <PaymentElement
        options={{
          layout: 'tabs',
          wallets: { applePay: 'never', googlePay: 'never' },
          fields: { billingDetails: { address: 'auto' } },
        }}
      />

      {error ? (
        <p className="coin-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="coin-primary-button" disabled={!stripe || submitting}>
        {submitting ? 'Processing…' : `Pay ${formatBaht(pack.price)} · ${formatCoins(total)} coins`}
        <Icon icon={coinIcons.arrowRight} width={18} height={18} />
      </button>
      <button type="button" className="coin-cancel-button" onClick={onCancel} disabled={submitting}>
        Cancel
      </button>
    </form>
  )
}

function DemoCardForm({
  userId,
  pack,
  onPaid,
  onCancel,
}: {
  userId: string
  pack: CoinPack
  onPaid: () => void
  onCancel: () => void
}) {
  const [number, setNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const total = pack.coins + pack.bonus

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return
    setError('')
    const digits = number.replace(/\s+/g, '')
    if (digits.length < 12) {
      setError('Enter a card number (demo accepts any 12+ digits).')
      return
    }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError('Use expiry as MM/YY.')
      return
    }
    if (cvc.replace(/\D/g, '').length < 3) {
      setError('Enter a CVC.')
      return
    }
    if (!name.trim()) {
      setError('Enter the name on the card.')
      return
    }

    setSubmitting(true)
    try {
      await startCoinPackPaymentIntent(pack.id)
      const wallet = readDemoWallet(userId)
      topUpDemoWallet(userId, wallet, pack)
      onPaid()
    } catch {
      try {
        const wallet = readDemoWallet(userId)
        topUpDemoWallet(userId, wallet, pack)
        onPaid()
      } catch {
        setError('Demo top-up failed. Allow local storage or sign in again.')
        setSubmitting(false)
      }
    }
  }

  return (
    <form className="coin-pay-form" onSubmit={handleSubmit}>
      <p className="coin-demo-notice">
        <Icon icon={coinIcons.info} width={18} height={18} />
        <span>
          Stripe keys are not set — this is a demo card form. Nothing is charged;
          coins are added locally after you continue.
        </span>
      </p>

      <label className="coin-pay-field">
        <span>Card number</span>
        <input
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="ACCT-000015"
          value={number}
          onChange={(e) => setNumber(formatCardNumber(e.target.value))}
          maxLength={19}
        />
      </label>

      <div className="coin-pay-field-row">
        <label className="coin-pay-field">
          <span>Expiry</span>
          <input
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            maxLength={5}
          />
        </label>
        <label className="coin-pay-field">
          <span>CVC</span>
          <input
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
          />
        </label>
      </div>

      <label className="coin-pay-field">
        <span>Name on card</span>
        <input
          autoComplete="cc-name"
          placeholder="Name as printed"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      {error ? (
        <p className="coin-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="coin-primary-button" disabled={submitting}>
        {submitting ? 'Adding coins…' : `Pay ${formatBaht(pack.price)} · ${formatCoins(total)} coins`}
        <Icon icon={coinIcons.arrowRight} width={18} height={18} />
      </button>
      <button type="button" className="coin-cancel-button" onClick={onCancel} disabled={submitting}>
        Cancel
      </button>
    </form>
  )
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}
