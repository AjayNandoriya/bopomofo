import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { FontSizeProvider, FontSizeControl } from './context/FontSizeContext'
import { AuthProvider } from './context/AuthContext'
import AuthButton from './components/AuthButton'
import ScoreHistoryModal from './components/ScoreHistoryModal'
import Translation from './pages/Translation'
import Stories from './pages/Stories'
import Songs from './pages/Songs'
import ZhuyinTyping from './pages/ZhuyinTyping'
import WordQuiz from './pages/WordQuiz'

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-colors text-xs md:text-sm font-medium whitespace-nowrap ${isActive
        ? 'bg-neutral-900 text-white'
        : 'text-neutral-600 hover:bg-neutral-100'
        }`}
    >
      {children}
    </Link>
  )
}

function Layout() {
  const [isScoreHistoryOpen, setIsScoreHistoryOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] md:h-[100dvh] w-full max-w-full bg-neutral-50 flex flex-col overflow-x-hidden md:overflow-hidden">
      {/* Main Navigation */}
      <nav className="flex-none bg-white border-b border-neutral-200 px-3 md:px-6 py-2 md:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4 z-20 shadow-xs max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group hover:opacity-90 transition-opacity">
            <img
              src="/mascot.jpg"
              alt="Bopomofo Mascot"
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg shadow-xs object-cover border border-amber-200/70"
            />
            <div className="font-bold text-lg md:text-xl text-neutral-800 tracking-tight">
              Bopomofo App
            </div>
          </Link>
          {/* Mobile controls */}
          <div className="sm:hidden flex items-center gap-1.5 shrink-0">
            <FontSizeControl compact />
            <AuthButton onOpenScoreHistory={() => setIsScoreHistoryOpen(true)} />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto min-w-0">
          <div className="flex gap-1 md:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            <NavLink to="/">Translation</NavLink>
            <NavLink to="/stories">Stories</NavLink>
            <NavLink to="/songs">Songs</NavLink>
            <NavLink to="/typing">Zhuyin Typing</NavLink>
            <NavLink to="/quiz">Word Quiz</NavLink>
          </div>

          {/* Desktop controls */}
          <div className="hidden sm:flex items-center gap-2 shrink-0 ml-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-500 font-medium">字體:</span>
              <FontSizeControl />
            </div>
            <div className="h-4 w-px bg-neutral-200" />
            <AuthButton onOpenScoreHistory={() => setIsScoreHistoryOpen(true)} />
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-1 w-full max-w-full relative flex flex-col overflow-y-auto md:overflow-hidden overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Translation />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/typing" element={<ZhuyinTyping />} />
          <Route path="/quiz" element={<WordQuiz onOpenScoreHistory={() => setIsScoreHistoryOpen(true)} />} />
        </Routes>
      </div>

      {/* Quiz Score History & Leaderboard Modal */}
      <ScoreHistoryModal
        isOpen={isScoreHistoryOpen}
        onClose={() => setIsScoreHistoryOpen(false)}
      />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FontSizeProvider>
          <Layout />
        </FontSizeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

