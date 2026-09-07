import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
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
    <div className="h-[100dvh] w-full bg-neutral-50 flex flex-col overflow-hidden">
      {/* Main Navigation */}
      <nav className="flex-none bg-white border-b border-neutral-200 px-3 md:px-6 py-2 md:py-3 flex items-center justify-between md:justify-start gap-2 md:gap-6 z-20 shadow-xs overflow-x-auto">
        <div className="font-bold text-lg md:text-xl text-neutral-800 tracking-tight shrink-0 mr-1 md:mr-4">
          Bopomofo App
        </div>
        <div className="flex gap-1.5 md:gap-2 shrink-0">
          <NavLink to="/">Translation</NavLink>
          <NavLink to="/stories">Stories</NavLink>
          <NavLink to="/songs">Songs</NavLink>
          <NavLink to="/typing">Zhuyin Typing</NavLink>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
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
      <Layout />
    </BrowserRouter>
  )
}

export default App

