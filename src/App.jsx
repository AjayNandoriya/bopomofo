import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Translation from './pages/Translation'
import Stories from './pages/Stories'

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md transition-colors font-medium ${isActive
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
    <div className="h-screen w-screen bg-neutral-50 flex flex-col overflow-hidden">
      {/* Main Navigation */}
      <nav className="flex-none bg-white border-b border-neutral-200 px-6 py-3 flex items-center gap-6 z-20 shadow-sm">
        <div className="font-bold text-xl text-neutral-800 tracking-tight mr-4">
          Bopomofo App
        </div>
        <div className="flex gap-2">
          <NavLink to="/">Translation</NavLink>
          <NavLink to="/stories">Stories</NavLink>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Translation />} />
          <Route path="/stories" element={<Stories />} />
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

