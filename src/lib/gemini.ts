import type { AiAnalysis, IssueCategory, IssuePriority } from '@/types'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

async function callGemini(parts: object[]): Promise<string> {
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ contents: [{ parts }] }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

async function callGeminiChat(history: { role: string; parts: { text: string }[] }[], userMessage: string): Promise<string> {
  const contents = [
    ...history,
    { role: 'user', parts: [{ text: userMessage }] },
  ]
  const res = await fetch(`${BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ contents }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

export async function analyzeIssueImage(
  base64Image: string,
  mimeType: string
): Promise<AiAnalysis> {
  const prompt = `You are an AI assistant for a civic issue reporting platform.
Analyze this image and identify the civic/infrastructure problem shown.
Respond ONLY with a valid JSON object (no markdown, no code blocks):
{
  "detectedCategory": one of ["pothole","water_leakage","streetlight","waste","road_damage","tree_hazard","other"],
  "confidence": a number between 0 and 1,
  "description": "brief 1-2 sentence description",
  "suggestedPriority": one of ["low","medium","high","critical"],
  "tags": ["tag1","tag2"]
}`

  try {
    const text = await callGemini([
      { text: prompt },
      { inlineData: { data: base64Image, mimeType } },
    ])
    const clean = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
    return JSON.parse(clean) as AiAnalysis
  } catch {
    return {
      detectedCategory: 'other' as IssueCategory,
      confidence: 0.5,
      description: 'Civic issue detected. Manual review recommended.',
      suggestedPriority: 'medium' as IssuePriority,
      tags: ['civic', 'infrastructure'],
    }
  }
}

export async function generateIssueSummary(issues: { category: string; count: number }[]): Promise<string> {
  const prompt = `Based on this civic issue data from a community, provide a 2-3 sentence predictive insight about recurring problems and what the municipality should prioritize. Data: ${JSON.stringify(issues)}`
  return callGemini([{ text: prompt }])
}

export interface ResolutionPlan {
  department: string
  contactNumber: string
  estimatedDays: string
  steps: string[]
  complaintLetter: string
}

export async function generateResolutionPlan(issue: {
  title: string
  category: string
  description: string
  address: string
  priority: string
}): Promise<ResolutionPlan> {
  const prompt = `You are a civic assistant helping Indian citizens resolve local infrastructure issues.
Issue: ${issue.title} | Category: ${issue.category} | Location: ${issue.address} | Priority: ${issue.priority}
Description: ${issue.description}

Respond ONLY with a valid JSON object (no markdown):
{
  "department": "responsible Indian government department",
  "contactNumber": "real Indian helpline number",
  "estimatedDays": "resolution timeframe",
  "steps": ["step1","step2","step3","step4"],
  "complaintLetter": "short formal complaint letter text"
}`

  try {
    const raw = await callGemini([{ text: prompt }])
    const clean = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
    return JSON.parse(clean) as ResolutionPlan
  } catch (e) {
    console.error('Resolution plan error:', e)
    return {
      department: 'Municipal Corporation',
      contactNumber: '1800-180-1234',
      estimatedDays: '7-14 days',
      steps: [
        'File a complaint on the official municipal portal',
        'Share this report with your local ward councillor',
        'Follow up after 3 days if no action taken',
        'Escalate to District Magistrate if unresolved in 2 weeks',
      ],
      complaintLetter: `To,\nThe Municipal Commissioner,\n\nSub: Complaint regarding ${issue.title}\n\nRespected Sir/Madam,\n\nI wish to bring to your attention the issue of "${issue.description}" at ${issue.address}. This requires immediate attention.\n\nKindly take urgent action.\n\nYours sincerely,\n[Your Name]`,
    }
  }
}

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

const SYSTEM_CONTEXT = `You are CivicBot, a helpful AI assistant for Community Hero — a platform where Indian citizens report and resolve local civic issues like potholes, water leakage, broken streetlights, waste management, and road damage.
You help users understand how to report issues, find the right government department, get helpline numbers, draft complaint letters, and know their rights. Keep responses concise and friendly.`

export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const geminiHistory = [
    { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
    { role: 'model', parts: [{ text: 'Understood! I am CivicBot, ready to help.' }] },
    ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
  ]
  return callGeminiChat(geminiHistory, userMessage)
}
