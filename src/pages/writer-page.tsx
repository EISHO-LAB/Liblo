import { Link } from 'react-router-dom'
import { Icon } from '@/components/icons/icon'
import { useAuth } from '@/lib/auth'

export function WriterPage() {
  const { user, applyAsWriter } = useAuth()
  if (!user) return null

  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 md:px-[60px]">
        <h1 className="mb-2 font-display text-3xl font-bold text-white md:text-4xl">
          Writer studio
        </h1>
        <p className="mb-8 text-white/60">Mock writer onboarding for Liblo.</p>

        {user.writerStatus === 'none' ? (
          <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
            <p className="text-white">You are not a writer yet.</p>
            <button
              type="button"
              onClick={applyAsWriter}
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand/90"
            >
              <Icon icon="lucide:pen-line" width={16} height={16} />
              สมัครเป็น Writer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-brand/40 bg-brand/10 p-6">
              <p className="font-semibold text-white">
                Status:{' '}
                {user.writerStatus === 'pending' ? 'Pending review (mock)' : 'Approved'}
              </p>
              <p className="mt-2 text-sm text-white/70">
                Studio APIs live on Liblo-back. This screen is UI-only for now.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: 'lucide:book-open', label: 'Series' },
                { icon: 'lucide:coins', label: 'Earnings' },
                { icon: 'lucide:upload', label: 'Uploads' },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-lg border border-white/10 bg-[#181818] p-5 text-center"
                >
                  <Icon
                    icon={card.icon}
                    width={22}
                    height={22}
                    className="mx-auto text-brand"
                  />
                  <p className="mt-2 text-sm text-white">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link to="/account" className="mt-8 inline-block text-sm text-brand hover:underline">
          Back to Account
        </Link>
      </div>
    </div>
  )
}
