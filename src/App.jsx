import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { FontSizeProvider, FontSizeControl } from './context/FontSizeContext'
import Translation from './pages/Translation'
import Stories from './pages/Stories'
import Songs from './pages/Songs'
import ZhuyinTyping from './pages/ZhuyinTyping'

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
  return (
    <div className="min-h-[100dvh] md:h-[100dvh] w-full max-w-full bg-neutral-50 flex flex-col overflow-x-hidden md:overflow-hidden">
      {/* Main Navigation */}
      <nav className="flex-none bg-white border-b border-neutral-200 px-3 md:px-6 py-2 md:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4 z-20 shadow-xs max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          <div className="font-bold text-lg md:text-xl text-neutral-800 tracking-tight shrink-0">
            Bopomofo App
          </div>
          {/* Mobile font size control */}
          <div className="sm:hidden flex items-center shrink-0">
            <FontSizeControl compact />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto min-w-0">
          <div className="flex gap-1 md:gap-2 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            <NavLink to="/">Translation</NavLink>
            <NavLink to="/stories">Stories</NavLink>
            <NavLink to="/songs">Songs</NavLink>
            <NavLink to="/typing">Zhuyin Typing</NavLink>
          </div>

          {/* Desktop font size control */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 ml-2">
            <span className="text-xs text-neutral-500 font-medium">字體:</span>
            <FontSizeControl />
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
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <FontSizeProvider>
        <Layout />
      </FontSizeProvider>
    </BrowserRouter>
  )
}

export default App

