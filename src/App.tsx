import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AutoOverlayScrollbars } from '@/components/auto-overlay-scrollbars'
import { GuestOnly, RequireAuth } from '@/components/auth/require-auth'
import { SiteHeader } from '@/components/layout'
import { SiteScrollbar } from '@/components/site-scrollbar'
import { AuthProvider } from '@/lib/auth'
import { AccountPage } from '@/pages/account-page'
import { BrowsePage } from '@/pages/browse-page'
import { ComicPage, ComicRankPage, ComicUpdatesPage } from '@/pages/comic'
import { CoinsPage } from '@/pages/coins-page'
import { CoinsPayPage } from '@/pages/coins-pay-page'
import { HelpPage } from '@/pages/help-page'
import { HomePage } from '@/pages/home-page'
import { LoginPage } from '@/pages/login-page'
import { MyListPage } from '@/pages/my-list-page'
import { SignupPage } from '@/pages/signup-page'
import { VerifyOtpPage } from '@/pages/verify-otp-page'
import { WriterEpisodePage } from '@/pages/writer/writer-episode-page'
import { WriterSeriesPage } from '@/pages/writer/writer-series-page'
import { WriterStudioPage } from '@/pages/writer/writer-studio-page'
import { WriterUploadPage } from '@/pages/writer/writer-upload-page'

const AUTH_PATHS = new Set(['/login', '/signup', '/verify-otp'])

function AppShell() {
  const location = useLocation()
  const hideNav = AUTH_PATHS.has(location.pathname)

  return (
    <div className="min-h-screen bg-[#111]">
      <SiteScrollbar />
      <AutoOverlayScrollbars />
      {hideNav ? null : <SiteHeader />}
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/comic" element={<ComicPage />} />
          <Route path="/comic/rank" element={<ComicRankPage />} />
          <Route path="/scroll" element={<Navigate to="/comic" replace />} />
          <Route path="/titles" element={<BrowsePage title="Title list" description="All series" />} />
          <Route
            path="/fair"
            element={
              <BrowsePage title="Fair titles" categoryId="trending" description="Campaign & fair works" />
            }
          />
          <Route
            path="/oneshots"
            element={
              <BrowsePage title="One-shots" categoryId="scroll" description="Complete in one sitting" />
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
          <Route path="/coins" element={<CoinsPage />} />
          <Route path="/coins/pay" element={<CoinsPayPage />} />
          <Route path="/new" element={<ComicUpdatesPage />} />
          <Route path="/search" element={<BrowsePage title="Search" description="Find a title" />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/writer" element={<WriterStudioPage />} />
          <Route path="/writer/series/:seriesId" element={<WriterSeriesPage />} />
          <Route
            path="/writer/series/:seriesId/upload"
            element={<WriterUploadPage />}
          />
          <Route
            path="/writer/series/:seriesId/episodes/:episodeId"
            element={<WriterEpisodePage />}
          />
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
