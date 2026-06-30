import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types'
import { Trophy, Star, CheckCircle, Flag } from 'lucide-react'

export default function LeaderboardPage() {
  const { user } = useAuthStore()
  const [leaders, setLeaders] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(20))
    const unsub = onSnapshot(q, (snap) => {
      setLeaders(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as User)))
      setLoading(false)
    })
    return unsub
  }, [])

  const podiumConfig = [
    { bg: 'from-yellow-400 to-amber-500', medal: '🥇', size: 'text-4xl' },
    { bg: 'from-gray-300 to-gray-400', medal: '🥈', size: 'text-3xl' },
    { bg: 'from-orange-300 to-amber-400', medal: '🥉', size: 'text-3xl' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-yellow-100 text-sm">Top civic heroes in your community</p>
          </div>
        </div>
      </div>

      {/* How points work */}
      <div className="card bg-green-50 border-green-200">
        <h2 className="font-semibold text-green-700 mb-3">How to earn points</h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-green-600">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2"><Flag className="w-4 h-4" /> +10 pts per report</div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2"><CheckCircle className="w-4 h-4" /> +5 pts per verify</div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2"><Star className="w-4 h-4" /> Badges for milestones</div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2"><Trophy className="w-4 h-4" /> Top 3 get featured</div>
        </div>
      </div>

      {/* Top 3 podium */}
      {!loading && leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[leaders[1], leaders[0], leaders[2]].map((leader, podiumIndex) => {
            const rankIndex = podiumIndex === 0 ? 1 : podiumIndex === 1 ? 0 : 2
            const config = podiumConfig[rankIndex]
            return (
              <div
                key={leader.uid}
                className={`bg-gradient-to-b ${config.bg} rounded-2xl p-4 text-center shadow-md transition-transform ${rankIndex === 0 ? 'scale-105' : ''}`}
              >
                <span className={config.size}>{config.medal}</span>
                {leader.photoURL ? (
                  <img src={leader.photoURL} className="w-12 h-12 rounded-full mx-auto mt-2 ring-2 ring-white shadow" alt="" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-xl font-bold text-white mx-auto mt-2">
                    {leader.displayName?.[0]}
                  </div>
                )}
                <p className="text-white font-semibold text-xs mt-2 truncate">{leader.displayName}</p>
                <p className="text-white/80 text-xs font-bold">{leader.points} pts</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="card animate-pulse h-16" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.map((leader, i) => (
            <div
              key={leader.uid}
              className={`card flex items-center gap-4 py-3.5 transition-all ${leader.uid === user?.uid ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'}`}
            >
              <span className="text-xl w-8 text-center font-bold text-gray-400">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>

              {leader.photoURL ? (
                <img src={leader.photoURL} className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" alt="" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-sm">
                  {leader.displayName?.[0]}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {leader.displayName}
                  {leader.uid === user?.uid && <span className="text-green-600 ml-1 text-xs">(You)</span>}
                </p>
                <p className="text-xs text-gray-400">{leader.issuesReported} reported · {leader.issuesVerified} verified</p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-bold text-green-600 text-lg">{leader.points}</p>
                <p className="text-xs text-gray-400">pts</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
