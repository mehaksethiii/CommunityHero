import { ThumbsUp, CheckCircle, MapPin, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Issue } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useIssueStore } from '@/store/issueStore'
import { CategoryBadge, StatusBadge } from './CategoryBadge'

interface Props {
  issue: Issue
  onClick?: () => void
}

const priorityBorder: Record<string, string> = {
  low: 'border-l-gray-300',
  medium: 'border-l-yellow-400',
  high: 'border-l-orange-500',
  critical: 'border-l-red-600',
}

const priorityDot: Record<string, string> = {
  low: 'bg-gray-400',
  medium: 'bg-yellow-400',
  high: 'bg-orange-500',
  critical: 'bg-red-600',
}

export default function IssueCard({ issue, onClick }: Props) {
  const { user } = useAuthStore()
  const { upvoteIssue, verifyIssue } = useIssueStore()

  const hasUpvoted = user ? issue.upvotes.includes(user.uid) : false
  const hasVerified = user ? issue.verifications.includes(user.uid) : false

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${priorityBorder[issue.priority]} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden`}
      onClick={onClick}
    >
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(issue.createdAt, { addSuffix: true })}
          </span>
        </div>

        {/* Priority indicator */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-block w-2 h-2 rounded-full ${priorityDot[issue.priority]}`} />
          <span className="text-xs text-gray-400 capitalize">{issue.priority} priority</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 text-base">{issue.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{issue.description}</p>

        {/* Media preview */}
        {issue.mediaUrls.length > 0 && (
          <img
            src={issue.mediaUrls[0]}
            alt="Issue"
            className="w-full h-44 object-cover rounded-xl mb-3"
          />
        )}

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 bg-gray-50 rounded-lg px-3 py-2">
          <MapPin className="w-3 h-3 shrink-0 text-green-500" />
          <span className="truncate">{issue.address}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            {issue.reporterAvatar ? (
              <img src={issue.reporterAvatar} className="w-6 h-6 rounded-full ring-2 ring-white shadow-sm" alt="" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-xs text-white font-bold shadow-sm">
                {issue.reporterName[0]}
              </div>
            )}
            <span className="text-xs text-gray-500 font-medium">{issue.reporterName}</span>
          </div>

          <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => user && upvoteIssue(issue.id, user.uid)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${hasUpvoted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-600'}`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              {issue.upvotes.length}
            </button>

            <button
              onClick={() => user && !hasVerified && verifyIssue(issue.id, user.uid)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${hasVerified ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600'}`}
              disabled={hasVerified}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {issue.verifications.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
