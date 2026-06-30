import { Sparkles } from 'lucide-react'
import type { AiAnalysis } from '@/types'
import { CategoryBadge } from '@/components/common/CategoryBadge'

interface Props {
  analysis: AiAnalysis
  onAccept: () => void
}

export default function AiSuggestion({ analysis, onAccept }: Props) {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 text-purple-700 font-medium text-sm">
        <Sparkles className="w-4 h-4" />
        AI Analysis Result
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <CategoryBadge category={analysis.detectedCategory} />
        <span className="text-xs text-gray-500">
          {Math.round(analysis.confidence * 100)}% confidence
        </span>
        <span className="badge bg-purple-100 text-purple-700 capitalize">
          {analysis.suggestedPriority} priority
        </span>
      </div>

      <p className="text-sm text-gray-700">{analysis.description}</p>

      {analysis.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {analysis.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <button type="button" onClick={onAccept} className="btn-primary text-xs py-1.5">
        Apply AI Suggestions
      </button>
    </div>
  )
}
