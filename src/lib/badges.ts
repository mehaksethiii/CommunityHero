import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import toast from 'react-hot-toast'

export interface BadgeDef {
  id: string
  name: string
  icon: string
  description: string
  condition: (stats: { points: number; issuesReported: number; issuesVerified: number }) => boolean
}

export const ALL_BADGES: BadgeDef[] = [
  {
    id: 'first_report',
    name: 'First Report',
    icon: '🚩',
    description: 'Report your first civic issue',
    condition: (s) => s.issuesReported >= 1,
  },
  {
    id: 'reporter_5',
    name: 'Active Reporter',
    icon: '📸',
    description: 'Report 5 issues',
    condition: (s) => s.issuesReported >= 5,
  },
  {
    id: 'reporter_20',
    name: 'Community Champion',
    icon: '🏆',
    description: 'Report 20 issues',
    condition: (s) => s.issuesReported >= 20,
  },
  {
    id: 'verifier_1',
    name: 'Truth Seeker',
    icon: '🔍',
    description: 'Verify your first issue',
    condition: (s) => s.issuesVerified >= 1,
  },
  {
    id: 'verifier_10',
    name: 'Fact Checker',
    icon: '✅',
    description: 'Verify 10 issues',
    condition: (s) => s.issuesVerified >= 10,
  },
  {
    id: 'points_50',
    name: 'Rising Star',
    icon: '⭐',
    description: 'Earn 50 points',
    condition: (s) => s.points >= 50,
  },
  {
    id: 'points_100',
    name: 'Century Club',
    icon: '💯',
    description: 'Earn 100 points',
    condition: (s) => s.points >= 100,
  },
  {
    id: 'points_500',
    name: 'Civic Legend',
    icon: '👑',
    description: 'Earn 500 points',
    condition: (s) => s.points >= 500,
  },
]

export async function checkAndAwardBadges(uid: string) {
  const userRef = doc(db, 'users', uid)
  const snap = await getDoc(userRef)
  if (!snap.exists()) return

  const data = snap.data()
  const stats = {
    points: data['points'] ?? 0,
    issuesReported: data['issuesReported'] ?? 0,
    issuesVerified: data['issuesVerified'] ?? 0,
  }
  const existingBadgeIds: string[] = (data['badges'] ?? []).map((b: { id: string }) => b.id)

  const newBadges = ALL_BADGES.filter(
    (b) => !existingBadgeIds.includes(b.id) && b.condition(stats)
  )

  for (const badge of newBadges) {
    await updateDoc(userRef, {
      badges: arrayUnion({
        id: badge.id,
        name: badge.name,
        icon: badge.icon,
        description: badge.description,
        earnedAt: new Date().toISOString(),
      }),
    })

    toast.success(`${badge.icon} Badge Unlocked: ${badge.name}!`, {
      duration: 4000,
      style: {
        background: '#f0fdf4',
        border: '1px solid #86efac',
        color: '#15803d',
        fontWeight: '600',
      },
    })
  }
}
