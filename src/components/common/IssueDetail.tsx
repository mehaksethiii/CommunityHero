import { X, MapPin, ThumbsUp, CheckCircle, Calendar, Sparkles, Phone, Clock, Copy, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import type { Issue, IssueCategory } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { useIssueStore } from '@/store/issueStore'
import { CategoryBadge, StatusBadge } from './CategoryBadge'
import toast from 'react-hot-toast'

interface Props {
  issue: Issue
  onClose: () => void
}

interface ResolutionPlan {
  department: string
  contactNumber: string
  estimatedDays: string
  steps: string[]
  complaintLetter: string
}

// Static fallback plans per category — always works without API
const staticPlans: Record<IssueCategory, ResolutionPlan> = {
  pothole: {
    department: 'Municipal Corporation / PWD (Public Works Department)',
    contactNumber: '1800-180-1234',
    estimatedDays: '7-14 days',
    steps: [
      'Report on the municipal corporation website or app',
      'Call the PWD helpline and register a complaint',
      'Share this report link with your ward councillor',
      'Follow up after 7 days if not resolved',
    ],
    complaintLetter: `To,\nThe Municipal Commissioner,\n\nSub: Complaint regarding pothole at ${''}\n\nRespected Sir/Madam,\n\nI wish to bring to your attention a dangerous pothole causing vehicle damage and accidents. Immediate repair is requested.\n\nKindly take urgent action.\n\nYours sincerely,\n[Your Name & Contact]`,
  },
  water_leakage: {
    department: 'Jal Board / Municipal Water Supply Department',
    contactNumber: '1800-180-5678',
    estimatedDays: '3-7 days',
    steps: [
      'Call Jal Board helpline immediately',
      'File complaint on the Jal Board portal',
      'Inform your local ward councillor',
      'Escalate to District Magistrate if no action in 5 days',
    ],
    complaintLetter: `To,\nThe Chief Engineer, Jal Board,\n\nSub: Urgent complaint regarding water pipe burst/leakage\n\nRespected Sir/Madam,\n\nA major water leakage has been reported causing water wastage and road damage. Immediate repair is needed.\n\nKindly take urgent action.\n\nYours sincerely,\n[Your Name & Contact]`,
  },
  streetlight: {
    department: 'Municipal Corporation - Electrical Department',
    contactNumber: '1912',
    estimatedDays: '3-5 days',
    steps: [
      'Call the electricity board helpline 1912',
      'Register complaint on the municipal portal',
      'Inform your local ward councillor',
      'Follow up after 3 days',
    ],
    complaintLetter: `To,\nThe Executive Engineer, Electrical Dept,\n\nSub: Non-functional streetlight complaint\n\nRespected Sir/Madam,\n\nStreetlights in our area have been non-functional for several days, creating safety hazards at night. Immediate repair requested.\n\nYours sincerely,\n[Your Name & Contact]`,
  },
  waste: {
    department: 'Municipal Corporation - Sanitation Department',
    contactNumber: '1533',
    estimatedDays: '1-3 days',
    steps: [
      'Call Swachh Bharat helpline 1533',
      'File complaint on Swachhata app',
      'Contact local sanitation supervisor',
      'Tag your municipality on social media if no action',
    ],
    complaintLetter: `To,\nThe Sanitation Officer, Municipal Corporation,\n\nSub: Garbage collection complaint\n\nRespected Sir/Madam,\n\nUncollected garbage is causing health hazards in our area. Regular waste collection is urgently required.\n\nYours sincerely,\n[Your Name & Contact]`,
  },
  road_damage: {
    department: 'PWD (Public Works Department)',
    contactNumber: '1800-180-1234',
    estimatedDays: '14-21 days',
    steps: [
      'File complaint on the PWD portal',
      'Contact your local MLA/ward councillor',
      'Report to District Magistrate office',
      'Document with photos and share on social media',
    ],
    complaintLetter: `To,\nThe Executive Engineer, PWD,\n\nSub: Road damage complaint\n\nRespected Sir/Madam,\n\nSerious road damage has been causing accidents and vehicle damage. Immediate repair is requested on priority.\n\nYours sincerely,\n[Your Name & Contact]`,
  },
  tree_hazard: {
    department: 'Municipal Corporation - Horticulture Department',
    contactNumber: '1800-180-9999',
    estimatedDays: '3-7 days',
    steps: [
      'Call the municipal helpline immediately',
      'File complaint on municipal portal',
      'Alert local fire station if tree has fallen on road',
      'Inform ward councillor for urgent action',
    ],
    complaintLetter: `To,\nThe Horticulture Officer, Municipal Corporation,\n\nSub: Tree hazard complaint\n\nRespected Sir/Madam,\n\nA dangerous tree poses an immediate safety risk in our area. Urgent removal/trimming is requested.\n\nYours sincerely,\n[Your Name & Contact]`,
  },
  other: {
    department: 'Municipal Corporation',
    contactNumber: '1800-180-1234',
    estimatedDays: '7-14 days',
    steps: [
      'File complaint on the municipal portal',
      'Contact your local ward councillor',
      'Visit the municipal office in person',
      'Escalate to District Magistrate if unresolved',
    ],
    complaintLetter: `To,\nThe Municipal Commissioner,\n\nSub: Civic issue complaint\n\nRespected Sir/Madam,\n\nI wish to report a civic issue in my area that requires immediate attention. Kindly take appropriate action.\n\nYours sincerely,\n[Your Name & Contact]`,
  },
}

export default function IssueDetail({ issue, onClose }: Props) {
  const { user } = useAuthStore()
  const { upvoteIssue, verifyIssue, updateStatus } = useIssueStore()
  const [plan, setPlan] = useState<ResolutionPlan | null>(null)
  const [showLetter, setShowLetter] = useState(false)

  const hasUpvoted = user ? issue.upvotes.includes(user.uid) : false
  const hasVerified = user ? issue.verifications.includes(user.uid) : false

  const handleGetPlan = () => {
    // Use static plan — always works
    const staticPlan = staticPlans[issue.category]
    // Personalize the letter with actual address
    const personalizedLetter = staticPlan.complaintLetter.replace("at ''", `at ${issue.address}`)
    setPlan({ ...staticPlan, complaintLetter: personalizedLetter })
  }

  const copyLetter = () => {
    if (plan) {
      navigator.clipboard.writeText(plan.complaintLetter)
      toast.success('Letter copied!')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-gray-900">{issue.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <CategoryBadge category={issue.category} />
            <StatusBadge status={issue.status} />
            <span className="badge bg-gray-100 text-gray-600 capitalize">{issue.priority} priority</span>
          </div>

          {issue.mediaUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {issue.mediaUrls.map((url, i) => (
                <img key={i} src={url} className="rounded-lg w-full h-32 object-cover" />
              ))}
            </div>
          )}

          <p className="text-sm text-gray-700">{issue.description}</p>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            {issue.address}
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            Reported {format(issue.createdAt, 'PPP')}
          </div>

          {issue.aiAnalysis && (
            <div className="bg-purple-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-purple-700 mb-1">AI Analysis</p>
              <p className="text-gray-600">{issue.aiAnalysis.description}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                {issue.aiAnalysis.tags.map((t) => (
                  <span key={t} className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">#{t}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => user && upvoteIssue(issue.id, user.uid)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-colors ${hasUpvoted ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-gray-200 text-gray-600 hover:border-brand-400'}`}
            >
              <ThumbsUp className="w-4 h-4" />
              Upvote ({issue.upvotes.length})
            </button>

            <button
              onClick={() => user && !hasVerified && verifyIssue(issue.id, user.uid)}
              disabled={hasVerified}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border transition-colors ${hasVerified ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-600 hover:border-blue-400'}`}
            >
              <CheckCircle className="w-4 h-4" />
              {hasVerified ? 'Verified' : `Verify (${issue.verifications.length})`}
            </button>
          </div>

          {user && issue.reportedBy === user.uid && issue.status !== 'resolved' && (
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-400 mb-2">Update Status</p>
              <div className="flex gap-2">
                {(['in_progress', 'resolved'] as const).map((s) => (
                  <button key={s} onClick={() => updateStatus(issue.id, s)} className="btn-secondary text-xs py-1.5 capitalize">
                    Mark {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Resolution Plan */}
          <div className="pt-2 border-t">
            {!plan ? (
              <button
                onClick={handleGetPlan}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Get AI Resolution Plan
              </button>
            ) : (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
                <p className="font-semibold text-purple-700 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4" /> Resolution Plan
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-lg p-2.5 border border-purple-100">
                    <p className="text-xs text-gray-400 mb-0.5">Department</p>
                    <p className="font-medium text-gray-800 text-xs">{plan.department}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2.5 border border-purple-100">
                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />Est. Time</p>
                    <p className="font-medium text-gray-800 text-xs">{plan.estimatedDays}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-2.5 border border-purple-100">
                  <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3" />Helpline</p>
                  <p className="font-medium text-purple-700 text-sm">{plan.contactNumber}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1.5">Steps to Resolve:</p>
                  <ol className="space-y-1">
                    {plan.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600">
                        <span className="w-4 h-4 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center font-bold shrink-0 text-[10px]">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <button onClick={() => setShowLetter(!showLetter)} className="flex items-center gap-1 text-xs text-purple-600 font-medium">
                    {showLetter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showLetter ? 'Hide' : 'Show'} Complaint Letter
                  </button>
                  {showLetter && (
                    <div className="mt-2 bg-white border border-purple-100 rounded-lg p-3">
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{plan.complaintLetter}</pre>
                      <button onClick={copyLetter} className="mt-2 flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800">
                        <Copy className="w-3 h-3" /> Copy Letter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
