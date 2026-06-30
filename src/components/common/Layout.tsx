import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ChatBot from './ChatBot'

// Each page gets its own background gradient
const pageBgs: Record<string, string> = {
  '/':           'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 40%, #bbf7d0 100%)',          // light green — Feed
  '/map':        'linear-gradient(145deg, #eff6ff 0%, #dbeafe 40%, #bfdbfe 100%)',          // light blue — Map
  '/report':     'linear-gradient(145deg, #faf5ff 0%, #ede9fe 40%, #ddd6fe 100%)',          // light purple — Report
  '/dashboard':  'linear-gradient(145deg, #f0fdf4 0%, #166534 100%)',                       // dark green — Dashboard
  '/leaderboard':'linear-gradient(145deg, #f0fdfa 0%, #ccfbf1 40%, #99f6e4 100%)',          // light teal — Leaderboard
  '/profile':    'linear-gradient(145deg, #eef2ff 0%, #e0e7ff 40%, #c7d2fe 100%)',          // light indigo — Profile
}

// Blob colors per page
const blobColors: Record<string, { b1: string; b2: string }> = {
  '/':           { b1: 'rgba(134,239,172,0.2)',  b2: 'rgba(52,211,153,0.15)' },
  '/map':        { b1: 'rgba(147,197,253,0.2)',  b2: 'rgba(96,165,250,0.15)' },
  '/report':     { b1: 'rgba(196,181,253,0.2)',  b2: 'rgba(167,139,250,0.15)' },
  '/dashboard':  { b1: 'rgba(74,222,128,0.15)',  b2: 'rgba(22,101,52,0.2)' },
  '/leaderboard':{ b1: 'rgba(94,234,212,0.2)',   b2: 'rgba(45,212,191,0.15)' },
  '/profile':    { b1: 'rgba(165,180,252,0.2)',  b2: 'rgba(129,140,248,0.15)' },
}

export default function Layout() {
  const location = useLocation()
  const bg = pageBgs[location.pathname] ?? pageBgs['/']
  const blobs = blobColors[location.pathname] ?? blobColors['/']

  // Dashboard gets white text on dark green
  const isDarkBg = location.pathname === '/dashboard'

  return (
    <div
      className="flex h-screen overflow-hidden relative transition-all duration-500"
      style={{ background: bg }}
    >
      {/* Background blobs */}
      <div style={{
        position: 'fixed', top: '-10%', left: '-10%',
        width: '40vw', height: '40vw',
        background: `radial-gradient(circle, ${blobs.b1} 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
        transition: 'all 0.5s ease',
      }} />
      <div style={{
        position: 'fixed', bottom: '-10%', right: '-5%',
        width: '35vw', height: '35vw',
        background: `radial-gradient(circle, ${blobs.b2} 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0,
        transition: 'all 0.5s ease',
      }} />

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className={`flex-1 flex flex-col overflow-hidden relative z-10 ${isDarkBg ? 'text-white' : ''}`}>
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <ChatBot />
    </div>
  )
}
