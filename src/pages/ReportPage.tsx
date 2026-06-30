import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/authStore'
import { useIssueStore } from '@/store/issueStore'
import MediaUploader from '@/components/report/MediaUploader'
import LocationPicker from '@/components/report/LocationPicker'
import AiSuggestion from '@/components/report/AiSuggestion'
import type { AiAnalysis, GeoPoint, IssueCategory, IssuePriority } from '@/types'
import { generateIssueTitleAndDescription } from '@/lib/groq'
import { Sparkles, Loader2 } from 'lucide-react'

interface FormValues {
  title: string
  description: string
  category: IssueCategory
  priority: IssuePriority
  ward: string
}

const categories: IssueCategory[] = [
  'pothole', 'water_leakage', 'streetlight', 'waste', 'road_damage', 'tree_hazard', 'other',
]

export default function ReportPage() {
  const { user } = useAuthStore()
  const { reportIssue } = useIssueStore()
  const navigate = useNavigate()

  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [location, setLocation] = useState<GeoPoint | null>(null)
  const [address, setAddress] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [generatingText, setGeneratingText] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: { priority: 'medium', category: 'other' },
  })

  const applyAiSuggestions = () => {
    if (!aiAnalysis) return
    setValue('category', aiAnalysis.detectedCategory)
    setValue('priority', aiAnalysis.suggestedPriority)
    if (!document.querySelector<HTMLInputElement>('[name=description]')?.value) {
      setValue('description', aiAnalysis.description)
    }
  }

  const generateTitleDescription = async () => {
    if (!aiAnalysis && mediaFiles.length === 0) return
    setGeneratingText(true)
    try {
      if (aiAnalysis && aiAnalysis.confidence > 0.6) {
        // Good AI analysis available — use it
        const result = await generateIssueTitleAndDescription(aiAnalysis, address)
        setValue('title', result.title)
        setValue('description', result.description)
      } else {
        // Fallback — use current form values (category) to generate
        const currentCategory = (document.querySelector('select[name="category"]') as HTMLSelectElement)?.value ?? 'other'
        const fakeAnalysis = {
          detectedCategory: currentCategory,
          description: `A ${currentCategory.replace('_', ' ')} issue has been identified`,
          tags: [currentCategory, 'civic', 'infrastructure'],
          suggestedPriority: 'medium',
        }
        const result = await generateIssueTitleAndDescription(fakeAnalysis, address)
        setValue('title', result.title)
        setValue('description', result.description)
      }
    } catch {
      // silently fail
    } finally {
      setGeneratingText(false)
    }
  }

  const onSubmit = async (data: FormValues) => {
    if (!user) return
    if (!location) { alert('Please select a location'); return }

    setSubmitting(true)
    try {
      await reportIssue(
        {
          ...data,
          location,
          address,
          mediaUrls: [],
          reportedBy: user.uid,
          reporterName: user.displayName,
          reporterAvatar: user.photoURL ?? undefined,
          status: 'open',
          aiAnalysis: aiAnalysis ?? undefined,
          ward: data.ward || undefined,
        },
        mediaFiles
      )
      navigate('/')
    } catch (err) {
      console.error('Submit error:', err)
      alert('Error: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Report an Issue</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Media */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Photos / Videos</h2>
          <MediaUploader
            onFilesChange={setMediaFiles}
            onAiAnalysis={(analysis) => setAiAnalysis(analysis)}
          />
          {aiAnalysis && <AiSuggestion analysis={aiAnalysis} onAccept={applyAiSuggestions} />}
        </div>

        {/* Details */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Issue Details</h2>

          {/* AI Generate button — shows when photo is uploaded */}
          {mediaFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <span className="text-amber-500 text-sm mt-0.5">💡</span>
                <p className="text-xs text-amber-700 font-medium">
                  Please select the correct <strong>Category</strong> below before clicking Generate — AI uses it to write a more accurate description.
                </p>
              </div>
              <button
                type="button"
                onClick={generateTitleDescription}
                disabled={generatingText}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-medium transition-all shadow-sm disabled:opacity-60"
              >
                {generatingText
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating title & description...</>
                  : <><Sparkles className="w-4 h-4" /> Generate Title & Description with AI</>
                }
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              className="input"
              placeholder="e.g. Large pothole on Main Street"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="input h-24 resize-none"
              placeholder="Describe the issue in detail..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select className="input capitalize" {...register('category', { required: true })}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select className="input" {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ward / Area (optional)</label>
            <input className="input" placeholder="e.g. Ward 12, Sector 4" {...register('ward')} />
          </div>
        </div>

        {/* Location */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-800">Location *</h2>
          <LocationPicker
            value={location}
            onChange={(pt, addr) => { setLocation(pt); setAddress(addr) }}
          />
          {address && <p className="text-sm text-gray-500">{address}</p>}
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3 text-base"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  )
}
