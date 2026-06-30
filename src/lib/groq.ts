import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

const MODEL = 'llama-3.3-70b-versatile'

// ── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

export interface ResolutionPlan {
  department: string
  contactNumber: string
  estimatedDays: string
  steps: string[]
  complaintLetter: string
}

// ── System prompt for CivicBot ───────────────────────────────────────────────

const CIVIC_SYSTEM_PROMPT = `You are CivicBot, a helpful AI assistant for Community Hero — a platform where Indian citizens report and resolve local civic issues like potholes, water leakage, broken streetlights, waste management, and road damage.

You help users:
- Understand how to report issues on the platform
- Know which government department is responsible for which issue
- Get real Indian government helpline numbers
- Draft formal complaint letters to authorities
- Know their rights as citizens under the Right to Public Service Act
- Understand the platform workflow: report → community verify → authority resolves

Keep responses concise (2-4 sentences max unless asked for more), friendly, and practical. Always use simple English.`

// ── CivicBot chat ────────────────────────────────────────────────────────────

export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: CIVIC_SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.text,
    })),
    { role: 'user', content: userMessage },
  ]

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 512,
  })

  return completion.choices[0]?.message?.content ?? 'Sorry, I could not respond. Please try again.'
}

// ── AI Resolution Plan ───────────────────────────────────────────────────────

export async function generateResolutionPlan(issue: {
  title: string
  category: string
  description: string
  address: string
  priority: string
}): Promise<ResolutionPlan> {
  const prompt = `You are a civic assistant helping Indian citizens resolve local infrastructure issues.

Issue Details:
- Title: ${issue.title}
- Category: ${issue.category}
- Description: ${issue.description}
- Location: ${issue.address}
- Priority: ${issue.priority}

Respond ONLY with a valid JSON object (no markdown, no code fences):
{
  "department": "responsible Indian government department name",
  "contactNumber": "real Indian helpline number",
  "estimatedDays": "resolution timeframe like 3-7 days",
  "steps": ["step 1", "step 2", "step 3", "step 4"],
  "complaintLetter": "short formal complaint letter as a single string with \\n for line breaks"
}`

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are a civic assistant. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 800,
  })

  const raw = completion.choices[0]?.message?.content ?? ''
  const clean = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()

  try {
    return JSON.parse(clean) as ResolutionPlan
  } catch {
    return {
      department: 'Municipal Corporation',
      contactNumber: '1800-180-1234',
      estimatedDays: '7-14 days',
      steps: [
        'File complaint on the municipal portal',
        'Contact your ward councillor',
        'Follow up after 3 days',
        'Escalate to District Magistrate if unresolved',
      ],
      complaintLetter: `To,\nThe Municipal Commissioner,\n\nSub: ${issue.title}\n\nRespected Sir/Madam,\n\nI wish to report "${issue.description}" at ${issue.address}. Immediate action is requested.\n\nYours sincerely,\n[Your Name]`,
    }
  }
}

// ── AI Title & Description Generator ─────────────────────────────────────────

export async function generateIssueTitleAndDescription(aiAnalysis: {
  detectedCategory: string
  description: string
  tags: string[]
  suggestedPriority: string
}, address: string): Promise<{ title: string; description: string }> {
  const prompt = `You are helping a citizen report a civic infrastructure issue in India.

Based on this AI analysis of their uploaded photo:
- Category: ${aiAnalysis.detectedCategory.replace('_', ' ')}
- AI Description: ${aiAnalysis.description}
- Tags: ${aiAnalysis.tags.join(', ')}
- Priority: ${aiAnalysis.suggestedPriority}
- Location: ${address || 'unknown location'}

Generate a concise, clear issue report. Respond with ONLY a JSON object (no markdown):
{
  "title": "Short specific title under 60 chars, e.g. 'Large pothole on Rajpur Road near clock tower'",
  "description": "2-3 sentence description explaining the issue, its impact on citizens, and urgency. Be specific and factual."
}`

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are a civic report writer. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 300,
  })

  const raw = completion.choices[0]?.message?.content ?? ''
  const clean = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()

  try {
    return JSON.parse(clean) as { title: string; description: string }
  } catch {
    return {
      title: `${aiAnalysis.detectedCategory.replace('_', ' ')} reported`,
      description: aiAnalysis.description,
    }
  }
}

export async function generateInsightGroq(issues: { category: string; count: number }[]): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: `Based on this civic issue data from an Indian community, write 2-3 sentences of predictive insight about recurring problems and what the municipality should prioritize: ${JSON.stringify(issues)}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 200,
  })
  return completion.choices[0]?.message?.content ?? ''
}
