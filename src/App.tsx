import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { GuestOnly, RequireAuth } from '@/components/auth/require-auth'
import { Navbar } from '@/components/netflix/navbar'
import { AuthProvider } from '@/lib/auth'
import { AccountPage } from '@/pages/account-page'
import { BrowsePage } from '@/pages/browse-page'
import { HelpPage } from '@/pages/help-page'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/login-page'
import { MyListPage } from '@/pages/my-list-page'
import { SignupPage } from '@/pages/signup-page'
import { VerifyOtpPage } from '@/pages/verify-otp-page'
import { WriterPage } from '@/pages/writer-page'

const AUTH_PATHS = new Set(['/login', '/signup', '/verify-otp'])

function AppShell() {
  const location = useLocation()
  const hideNav = AUTH_PATHS.has(location.pathname)

  return (
    <div className="min-h-screen bg-netflix-black">
      {hideNav ? null : <Navbar />}
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/scroll"
            element={
              <BrowsePage
                title="Vertical Scroll"
                categoryId="scroll"
                description="Webtoon-style vertical stories"
              />
            }
          />
          <Route
            path="/chat"
            element={
              <BrowsePage
                title="Chat novels"
                categoryId="chat"
                description="Conversation-first stories"
              />
            }
          />
          <Route
            path="/ebooks"
            element={
              <BrowsePage title="E-books" categoryId="ebook" description="Long-form reading" />
            }
          />
          <Route
            path="/new"
            element={
              <BrowsePage
                title="New & Popular"
                categoryId="trending"
                description="Trending on Liblo right now"
              />
            }
          />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/writer" element={<WriterPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  )
}
