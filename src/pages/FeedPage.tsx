import { useEffect, useState } from 'react'
import { useIssueStore } from '@/store/issueStore'
import IssueCard from '@/components/common/IssueCard'
import IssueDetail from '@/components/common/IssueDetail'
import type { IssueCategory, IssueStatus } from '@/types'
import { Search, Database } from 'lucide-react'
import { seedSampleIssues } from '@/lib/seedData'

const categories: { value: IssueCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pothole', label: 'Pothole' },
  { value: 'water_leakage', label: 'Water' },
  { value: 'streetlight', label: 'Streetlight' },
  { value: 'waste', label: 'Waste' },
  { value: 'road_damage', label: 'Road' },
  { value: 'tree_hazard', label: 'Tree' },
  { value: 'other', label: 'Other' },
]

const statuses: { value: IssueStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open' },
  { value: 'verified', label: 'Verified' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
]

export default function FeedPage() {
  const { issues, loading, filters, setFilters, subscribeToIssues, setSelectedIssue, selectedIssue } = useIssueStore()
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    const unsub = subscribeToIssues()
    return unsub
  }, [subscribeToIssues])

  const handleSeed = async () => {
    setSeeding(true)
    await seedSampleIssues()
    setSeeding(false)
  }

  const filtered = issues.filter((i) => {
    if (filters.category !== 'all' && i.category !== filters.category) return false
    if (filters.status !== 'all' && i.status !== filters.status) return false
    if (filters.search && !i.title.toLowerCase().includes(filters.search.toLowerCase()) && !i.address.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Community Issues</h1>
        {issues.length === 0 && (
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 btn-secondary text-xs py-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            {seeding ? 'Loading...' : 'Load Sample Data'}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className="input pl-9"
          placeholder="Search by title or location..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilters({ category: c.value })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.category === c.value
                ? 'bg-brand-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-400'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilters({ status: s.value })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filters.status === s.value
                ? 'bg-gray-700 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-48" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No issues found</p>
          <p className="text-sm">Be the first to report one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => setSelectedIssue(issue)}
            />
          ))}
        </div>
      )}

      {selectedIssue && (
        <IssueDetail issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}
    </div>
  )
}
