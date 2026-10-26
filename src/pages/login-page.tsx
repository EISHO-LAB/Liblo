import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { AuthShell } from '@/components/auth/auth-shell'
import { MOCK_AUTH_HINTS, useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function LoginPage() {
  const { loginWithPassword, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/'

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const finish = () => navigate(from, { replace: true })

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithPassword(identifier, password)
      finish()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const onGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      finish()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="mb-8 font-display text-3xl font-semibold text-white sm:text-4xl">Sign in</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            autoComplete="username"
            placeholder="Email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={cn(
              'w-full rounded-md bg-neutral-700 px-4 py-3.5 text-white outline-none ring-0 transition focus:ring-2 focus:ring-brand',
            )}
          />
        </div>
        <div>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-neutral-700 px-4 py-3.5 text-white outline-none transition focus:ring-2 focus:ring-brand"
          />
        </div>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full cursor-pointer rounded-md bg-brand py-3 font-semibold text-white transition hover:bg-brand/90 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="mt-1 flex items-center justify-between text-sm text-gray-400">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="cursor-pointer accent-brand" defaultChecked />
            Remember me
          </label>
          <Link to="/help" className="hover:underline">
            Need help?
          </Link>
        </div>
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
        Continue with Google
      </button>

      <p className="mt-8 text-neutral-400">
        New to Liblo?{' '}
        <Link to="/signup" className="text-white hover:underline">
          Sign up now
        </Link>
      </p>

      <p className="mt-4 rounded-md bg-white/5 px-3 py-2 text-xs text-neutral-400">
        Mock demo: <span className="text-white">{MOCK_AUTH_HINTS.username}</span> /{' '}
        <span className="text-white">{MOCK_AUTH_HINTS.password}</span>
      </p>
    </AuthShell>
  )
}
