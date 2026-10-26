import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export function RequireAuth() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function GuestOnly() {
  const { user } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from || '/'

  if (user) {
    return <Navigate to={from} replace />
  }

  return <Outlet />
}
