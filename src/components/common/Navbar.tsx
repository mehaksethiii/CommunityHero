import { useAuthStore } from '@/store/authStore'
import { LogOut, Bell } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="md:hidden text-lg font-bold">
        <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Community</span>
        <span className="text-gray-800"> Hero</span>
      </div>
      <div className="hidden md:block" />

      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2.5">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full ring-2 ring-green-200 shadow-sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user?.displayName?.[0]}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">{user?.displayName}</p>
            <p className="text-xs font-medium bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{user?.points ?? 0} pts</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
