import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts'
import { useIssueStore } from '@/store/issueStore'
import { generateIssueSummary } from '@/lib/gemini'
import { Loader2, Sparkles } from 'lucide-react'

const PIE_COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#22c55e', '#6b7280', '#10b981', '#8b5cf6']

export default function DashboardPage() {
  const { issues, subscribeToIssues } = useIssueStore()
  const [insight, setInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(false)

  useEffect(() => {
    const unsub = subscribeToIssues()
    return unsub
  }, [subscribeToIssues])

  const total = issues.length
  const open = issues.filter((i) => i.status === 'open').length
  const inProgress = issues.filter((i) => i.status === 'in_progress').length
  const resolved = issues.filter((i) => i.status === 'resolved').length
  const verified = issues.filter((i) => i.status === 'verified').length

  // Category breakdown for pie chart
  const catMap: Record<string, number> = {}
  issues.forEach((i) => { catMap[i.category] = (catMap[i.category] || 0) + 1 })
  const categoryData = Object.entries(catMap).map(([name, value]) => ({ name: name.replace('_', ' '), value }))

  // Monthly trend (last 6 months)
  const monthlyMap: Record<string, { reported: number; resolved: number }> = {}
  issues.forEach((i) => {
    const key = i.createdAt.toLocaleString('default', { month: 'short' })
    if (!monthlyMap[key]) monthlyMap[key] = { reported: 0, resolved: 0 }
    monthlyMap[key].reported++
    if (i.status === 'resolved') monthlyMap[key].resolved++
  })
  const trendData = Object.entries(monthlyMap).slice(-6).map(([month, v]) => ({ month, ...v }))

  // Top wards
  const wardMap: Record<string, number> = {}
  issues.forEach((i) => { if (i.ward) wardMap[i.ward] = (wardMap[i.ward] || 0) + 1 })
  const wardData = Object.entries(wardMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ward, count]) => ({ ward, count }))

  const fetchInsight = async () => {
    setLoadingInsight(true)
    try {
      const data = categoryData.map((c) => ({ category: c.name, count: c.value }))
      const text = await generateIssueSummary(data)
      setInsight(text)
    } finally {
      setLoadingInsight(false)
    }
  }

  const statCards = [
    { label: 'Total Issues', value: total, color: 'text-gray-700' },
    { label: 'Open', value: open, color: 'text-red-600' },
    { label: 'In Progress', value: inProgress, color: 'text-yellow-600' },
    { label: 'Verified', value: verified, color: 'text-blue-600' },
    { label: 'Resolved', value: resolved, color: 'text-green-600' },
  ]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">Impact Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="card text-center py-4">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* AI Insight */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Predictive Insights (Gemini AI)
          </h2>
          <button onClick={fetchInsight} className="btn-secondary text-xs py-1.5" disabled={loadingInsight}>
            {loadingInsight ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate Insight'}
          </button>
        </div>
        {insight ? (
          <p className="text-sm text-gray-700 leading-relaxed">{insight}</p>
        ) : (
          <p className="text-sm text-gray-400">Click "Generate Insight" for AI-powered analysis of community issues.</p>
        )}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">Issues by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly trend */}
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reported" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top wards */}
        {wardData.length > 0 && (
          <div className="card lg:col-span-2">
            <h2 className="font-semibold text-gray-800 mb-4">Top Problem Areas (by Ward)</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={wardData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ward" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
