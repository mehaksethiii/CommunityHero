import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useIssueStore } from '@/store/issueStore'
import IssueCard from '@/components/common/IssueCard'
import { Flag, CheckCircle, Star, Award } from 'lucide-react'
import { ALL_BADGES } from '@/lib/badges'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { issues, subscribeToIssues } = useIssueStore()

  useEffect(() => {
    const unsub = subscribeToIssues()
    return unsub
  }, [subscribeToIssues])

  const myIssues = issues.filter((i) => i.reportedBy === user?.uid)

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="card flex items-center gap-5 bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
        {user.photoURL ? (
          <img src={user.photoURL} className="w-16 h-16 rounded-full ring-4 ring-white shadow-md" alt="" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {user.displayName[0]}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.displayName}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="font-bold mt-1 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
            {user.points} points
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Reported', value: user.issuesReported, icon: Flag, color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Verified', value: user.issuesVerified, icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Points', value: user.points, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card text-center py-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-500" />
          Badges ({user.badges?.length ?? 0}/{ALL_BADGES.length})
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_BADGES.map((badge) => {
            const isEarned = badge.condition({
              points: user.points,
              issuesReported: user.issuesReported,
              issuesVerified: user.issuesVerified,
            })
            return (
              <div
                key={badge.id}
                className={`rounded-xl p-3 text-center border transition-all duration-200 ${
                  isEarned
                    ? 'bg-gradient-to-b from-yellow-50 to-amber-50 border-yellow-200 shadow-md shadow-yellow-100 hover:shadow-yellow-200 hover:scale-105'
                    : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
                }`}
              >
                <span className="text-3xl">{badge.icon}</span>
                <p className="text-xs font-semibold text-gray-800 mt-1">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{badge.description}</p>
                {isEarned && (
                  <span className="inline-block mt-1.5 text-xs bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                    Unlocked ✓
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* My reports */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">My Reports ({myIssues.length})</h2>
        {myIssues.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-sm">You haven't reported any issues yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
