import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { AuthShell } from '@/components/auth/auth-shell'
import { useAuth } from '@/lib/auth'

export function SignupPage() {
  const { startSignup, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await startSignup(email, password)
      navigate('/verify-otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const onGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="mb-2 font-display text-3xl font-semibold text-white sm:text-4xl">
        Create account
      </h1>
      <p className="mb-8 text-sm text-neutral-400">
        Set your email and password, then verify with OTP.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md bg-neutral-700 px-4 py-3.5 text-white outline-none transition focus:ring-2 focus:ring-brand"
          required
        />
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md bg-neutral-700 px-4 py-3.5 text-white outline-none transition focus:ring-2 focus:ring-brand"
          required
        />
        <input
          type="password"
          autoComplete="new-password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-md bg-neutral-700 px-4 py-3.5 text-white outline-none transition focus:ring-2 focus:ring-brand"
          required
        />

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full cursor-pointer rounded-md bg-brand py-3 font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? 'Continue…' : 'Continue'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3 text-sm text-neutral-500">
        <div className="h-px flex-1 bg-neutral-700" />
        or
        <div className="h-px flex-1 bg-neutral-700" />
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={onGoogle}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-white/20 bg-white/5 py-3 font-medium text-white transition hover:bg-white/10 disabled:opacity-60"
      >
        <Icon icon="logos:google-icon" width={18} height={18} />
        Sign up with Google
      </button>

      <p className="mt-8 text-neutral-400">
        Already have an account?{' '}
        <Link to="/login" className="text-white hover:underline">
          Sign in now
        </Link>
      </p>
    </AuthShell>
  )
}
