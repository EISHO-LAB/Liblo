import { Link } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { useAuth } from '@/lib/auth'

export function AccountPage() {
  const { user, applyAsWriter, logout } = useAuth()
  if (!user) return null

  const writerLabel =
    user.writerStatus === 'approved'
      ? 'Approved writer'
      : user.writerStatus === 'pending'
        ? 'Writer application pending'
        : 'Reader account'

  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 md:px-[60px]">
        <h1 className="mb-8 font-display text-3xl font-bold text-white md:text-4xl">Account</h1>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#181818]">
          <div className="flex items-center gap-4 border-b border-white/10 p-6">
            <img
              src={user.avatarUrl}
              alt=""
              className="h-16 w-16 rounded object-cover"
            />
            <div>
              <p className="font-display text-xl font-semibold text-white">{user.displayName}</p>
              <p className="text-sm text-white/60">{user.email}</p>
              <p className="mt-1 text-xs text-brand">{writerLabel}</p>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            <Row label="Membership" value="Liblo Free · Mock" />
            <Row label="Sign-in method" value={user.provider === 'google' ? 'Google' : 'Email'} />
            <Row label="Plan details" value="Unlimited reading (demo)" />
          </div>
        </div>

        <section className="mt-8 rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Become a writer</h2>
              <p className="mt-1 text-sm text-white/60">
                Publish scroll, chat novels, and e-books. Earn from reader purchases.
              </p>
            </div>

            {user.writerStatus === 'none' ? (
              <button
                type="button"
                onClick={applyAsWriter}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
              >
                <Icon icon="lucide:pen-line" width={16} height={16} />
                สมัครเป็น Writer
              </button>
            ) : user.writerStatus === 'pending' ? (
              <Link
                to="/writer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                View application
              </Link>
            ) : (
              <Link
                to="/writer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90"
              >
                Open writer studio
              </Link>
            )}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/help"
            className="rounded-md border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/5"
          >
            Help Center
          </Link>
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer rounded-md border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-white/50">{label}</span>
      <span className="text-sm text-white">{value}</span>
    </div>
  )
}
