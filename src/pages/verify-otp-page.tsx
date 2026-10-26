import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthShell } from '@/components/auth/auth-shell'
import { MOCK_AUTH_HINTS, useAuth } from '@/lib/auth'

export function VerifyOtpPage() {
  const { pendingSignup, lastOtpHint, verifyOtp, resendOtp } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (lastOtpHint) {
      setInfo(`Mock OTP sent: ${lastOtpHint}`)
    }
  }, [lastOtpHint])

  if (!pendingSignup) {
    return <Navigate to="/signup" replace />
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyOtp(code)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const onResend = async () => {
    setError('')
    try {
      await resendOtp()
      setInfo(`Mock OTP resent: ${MOCK_AUTH_HINTS.otp}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend OTP')
    }
  }

  return (
    <AuthShell>
      <h1 className="mb-2 font-display text-3xl font-semibold text-white sm:text-4xl">
        Verify email
      </h1>
      <p className="mb-8 text-sm text-neutral-400">
        Enter the 6-digit code sent to{' '}
        <span className="text-white">{pendingSignup.email}</span>
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="OTP code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full rounded-md bg-neutral-700 px-4 py-3.5 text-center text-2xl tracking-[0.4em] text-white outline-none transition focus:ring-2 focus:ring-brand"
          required
        />

        {info ? <p className="text-sm text-brand">{info}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={loading || code.length < 6}
          className="mt-2 w-full cursor-pointer rounded-md bg-brand py-3 font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? 'Verifying…' : 'Verify & continue'}
        </button>
      </form>

      <button
        type="button"
        onClick={onResend}
        className="mt-4 w-full cursor-pointer text-sm text-neutral-400 hover:text-white hover:underline"
      >
        Resend code
      </button>

      <p className="mt-8 text-neutral-400">
        Wrong email?{' '}
        <Link to="/signup" className="text-white hover:underline">
          Go back
        </Link>
      </p>
    </AuthShell>
  )
}
