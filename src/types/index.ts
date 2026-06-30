export type IssueCategory =
  | 'pothole'
  | 'water_leakage'
  | 'streetlight'
  | 'waste'
  | 'road_damage'
  | 'tree_hazard'
  | 'other'

export type IssueStatus = 'open' | 'verified' | 'in_progress' | 'resolved'

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'

export interface GeoPoint {
  lat: number
  lng: number
}

export interface Issue {
  id: string
  title: string
  description: string
  category: IssueCategory
  status: IssueStatus
  priority: IssuePriority
  location: GeoPoint
  address: string
  mediaUrls: string[]
  reportedBy: string
  reporterName: string
  reporterAvatar?: string
  upvotes: string[] // array of user IDs
  verifications: string[] // array of user IDs who verified
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  aiAnalysis?: AiAnalysis
  ward?: string
}

export interface AiAnalysis {
  detectedCategory: IssueCategory
  confidence: number
  description: string
  suggestedPriority: IssuePriority
  tags: string[]
}

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  points: number
  badges: Badge[]
  issuesReported: number
  issuesVerified: number
  createdAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
}

export interface LeaderboardEntry {
  uid: string
  displayName: string
  photoURL?: string
  points: number
  issuesReported: number
  issuesVerified: number
  rank: number
}

export interface DashboardStats {
  totalIssues: number
  openIssues: number
  resolvedIssues: number
  inProgressIssues: number
  categoryBreakdown: Record<IssueCategory, number>
  monthlyTrend: { month: string; reported: number; resolved: number }[]
  avgResolutionDays: number
  topWards: { ward: string; count: number }[]
}
