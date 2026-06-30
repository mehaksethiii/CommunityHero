import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, PlusCircle, List, Trophy, User } from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { to: '/', icon: List, label: 'Feed', color: 'text-blue-500' },
  { to: '/map', icon: Map, label: 'Map', color: 'text-green-500' },
  { to: '/report', icon: PlusCircle, label: 'Report', color: 'text-orange-500' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-purple-500' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', color: 'text-yellow-500' },
  { to: '/profile', icon: User, label: 'Profile', color: 'text-pink-500' },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white/70 backdrop-blur-md border-r border-green-100/60 py-6 px-3 shadow-sm relative z-10">
      <div className="mb-8 px-3 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-lg">🏙️</span>
        </div>
        <div>
          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Community</span>
          <span className="text-lg font-bold text-gray-800"> Hero</span>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {nav.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 shadow-sm border border-green-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-4 h-4', isActive ? 'text-green-600' : color)} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Community Hero v1.0</p>
      </div>
    </aside>
  )
}
