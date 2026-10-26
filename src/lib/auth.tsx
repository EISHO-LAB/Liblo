import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type AuthUser = {
  id: string
  email: string
  displayName: string
  avatarUrl: string
  provider: 'password' | 'google'
  isWriter: boolean
  writerStatus: 'none' | 'pending' | 'approved'
}

type PendingSignup = {
  email: string
  password: string
}

type AuthContextValue = {
  user: AuthUser | null
  pendingSignup: PendingSignup | null
  lastOtpHint: string | null
  loginWithPassword: (identifier: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  startSignup: (email: string, password: string) => Promise<void>
  verifyOtp: (code: string) => Promise<void>
  resendOtp: () => Promise<void>
  applyAsWriter: () => void
  logout: () => void
}

const STORAGE_KEY = 'liblo.mock.auth'
const MOCK_OTP = '123456'

const DEMO_USER: AuthUser = {
  id: 'user-admin',
  email: 'admin@liblo.test',
  displayName: 'Admin',
  avatarUrl: '/covers/midnight-chat.jpg',
  provider: 'password',
  isWriter: false,
  writerStatus: 'none',
}

const DEMO_CREDENTIALS = {
  username: 'admin',
  email: 'admin@liblo.test',
  password: 'admin123',
}

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

function persistUser(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function delay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())
  const [pendingSignup, setPendingSignup] = useState<PendingSignup | null>(null)
  const [lastOtpHint, setLastOtpHint] = useState<string | null>(null)

  const setSession = useCallback((next: AuthUser | null) => {
    setUser(next)
    persistUser(next)
  }, [])

  const loginWithPassword = useCallback(
    async (identifier: string, password: string) => {
      await delay()
      const id = identifier.trim().toLowerCase()
      const okIdentity =
        id === DEMO_CREDENTIALS.username || id === DEMO_CREDENTIALS.email
      if (!okIdentity || password !== DEMO_CREDENTIALS.password) {
        throw new Error('Invalid email/username or password. Try admin / admin123')
      }
      const existing = readStoredUser()
      setSession({
        ...DEMO_USER,
        isWriter: existing?.email === DEMO_USER.email ? existing.isWriter : false,
        writerStatus:
          existing?.email === DEMO_USER.email ? existing.writerStatus : 'none',
      })
      setPendingSignup(null)
      setLastOtpHint(null)
    },
    [setSession],
  )

  const loginWithGoogle = useCallback(async () => {
    await delay()
    setSession({
      id: 'user-google',
      email: 'reader@gmail.com',
      displayName: 'Google Reader',
      avatarUrl: '/covers/soft-orbit.jpg',
      provider: 'google',
      isWriter: false,
      writerStatus: 'none',
    })
    setPendingSignup(null)
    setLastOtpHint(null)
  }, [setSession])

  const startSignup = useCallback(async (email: string, password: string) => {
    await delay()
    const normalized = email.trim().toLowerCase()
    if (!/\S+@\S+\.\S+/.test(normalized)) {
      throw new Error('Please enter a valid email address.')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }
    setPendingSignup({ email: normalized, password })
    setLastOtpHint(MOCK_OTP)
  }, [])

  const verifyOtp = useCallback(
    async (code: string) => {
      await delay()
      if (!pendingSignup) {
        throw new Error('No signup in progress. Start again from Sign up.')
      }
      if (code.trim() !== MOCK_OTP) {
        throw new Error(`Invalid OTP. Use mock code ${MOCK_OTP}`)
      }
      setSession({
        id: `user-${Date.now()}`,
        email: pendingSignup.email,
        displayName: pendingSignup.email.split('@')[0] || 'Reader',
        avatarUrl: '/covers/paper-hearts.jpg',
        provider: 'password',
        isWriter: false,
        writerStatus: 'none',
      })
      setPendingSignup(null)
      setLastOtpHint(null)
    },
    [pendingSignup, setSession],
  )

  const resendOtp = useCallback(async () => {
    await delay(300)
    if (!pendingSignup) {
      throw new Error('No signup in progress.')
    }
    setLastOtpHint(MOCK_OTP)
  }, [pendingSignup])

  const applyAsWriter = useCallback(() => {
    setUser((current) => {
      if (!current) return current
      const next: AuthUser = {
        ...current,
        isWriter: true,
        writerStatus: 'pending',
      }
      persistUser(next)
      return next
    })
  }, [])

  const logout = useCallback(() => {
    setSession(null)
    setPendingSignup(null)
    setLastOtpHint(null)
  }, [setSession])

  const value = useMemo(
    () => ({
      user,
      pendingSignup,
      lastOtpHint,
      loginWithPassword,
      loginWithGoogle,
      startSignup,
      verifyOtp,
      resendOtp,
      applyAsWriter,
      logout,
    }),
    [
      user,
      pendingSignup,
      lastOtpHint,
      loginWithPassword,
      loginWithGoogle,
      startSignup,
      verifyOtp,
      resendOtp,
      applyAsWriter,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const MOCK_AUTH_HINTS = {
  username: DEMO_CREDENTIALS.username,
  password: DEMO_CREDENTIALS.password,
  otp: MOCK_OTP,
}
