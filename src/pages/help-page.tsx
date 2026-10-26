import { Link } from 'react-router-dom'
import { MOCK_AUTH_HINTS } from '@/lib/auth'

const faqs = [
  {
    q: 'How do I sign in?',
    a: `Use Google, or email/password. Demo account: ${MOCK_AUTH_HINTS.username} / ${MOCK_AUTH_HINTS.password}`,
  },
  {
    q: 'How does email signup work?',
    a: `Create a password, then enter the mock OTP (${MOCK_AUTH_HINTS.otp}) to verify.`,
  },
  {
    q: 'How do I become a writer?',
    a: 'Open Account → สมัครเป็น Writer. Your application is mocked as pending.',
  },
  {
    q: 'Where is my list?',
    a: 'Use My List in the top nav to save titles for later.',
  },
]

export function HelpPage() {
  return (
    <div className="min-h-screen bg-netflix-black pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 md:px-[60px]">
        <h1 className="mb-2 font-display text-3xl font-bold text-white md:text-4xl">
          Help Center
        </h1>
        <p className="mb-8 text-white/60">Common questions while Liblo is in mock mode.</p>

        <div className="space-y-3">
          {faqs.map((item) => (
            <details
              key={item.q}
              className="group rounded-lg border border-white/10 bg-[#181818] open:bg-[#1f1f1f]"
            >
              <summary className="cursor-pointer list-none px-5 py-4 font-medium text-white marker:content-none">
                {item.q}
              </summary>
              <p className="border-t border-white/10 px-5 py-4 text-sm text-white/70">{item.a}</p>
            </details>
          ))}
        </div>

        <Link
          to="/account"
          className="mt-8 inline-block text-sm text-brand hover:underline"
        >
          Back to Account
        </Link>
      </div>
    </div>
  )
}
