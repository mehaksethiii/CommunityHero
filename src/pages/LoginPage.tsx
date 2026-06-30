import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const { user, loginWithGoogle } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-200 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full opacity-20 translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-teal-200 rounded-full opacity-10" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 space-y-8 border border-white">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-2">
              <span className="text-3xl">🏙️</span>
            </div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Community</span>
              <span className="text-gray-800"> Hero</span>
            </h1>
            <p className="text-gray-500 text-sm">Report. Verify. Resolve. Together.</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📸', text: 'Photo reporting' },
              { icon: '🗺️', text: 'Live map tracking' },
              { icon: '✅', text: 'Community verify' },
              { icon: '🏆', text: 'Earn badges' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-xs font-medium text-gray-700">{f.text}</span>
              </div>
            ))}
          </div>

          {/* Login button */}
          <button
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300 rounded-2xl py-3.5 px-4 transition-all duration-200 font-semibold text-gray-700 shadow-sm hover:shadow-md group"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-gray-400">
            Free to use · No credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
