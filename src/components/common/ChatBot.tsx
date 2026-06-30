import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, Minus, Maximize2, Minimize2 } from 'lucide-react'
import { sendChatMessage, type ChatMessage } from '@/lib/groq'

const SUGGESTIONS = [
  'How do I report a pothole?',
  'Which dept handles water leakage?',
  'How to write a complaint letter?',
  'What is community verification?',
]

type WindowState = 'closed' | 'minimized' | 'normal' | 'maximized'

export default function ChatBot() {
  const [windowState, setWindowState] = useState<WindowState>('closed')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: "Hi! I'm CivicBot 👋 I help Indian citizens report and resolve local infrastructure issues. Ask me anything — potholes, water leaks, streetlights, or how to file a complaint!",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (windowState === 'normal' || windowState === 'maximized') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, windowState])

  const send = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const history = messages.slice(1)
      const reply = await sendChatMessage(history, text.trim())
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I had trouble responding. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const isOpen = windowState === 'normal' || windowState === 'maximized'

  // Window dimensions
  const windowClass =
    windowState === 'maximized'
      ? 'fixed bottom-6 right-6 z-50 w-[520px] h-[700px]'
      : 'fixed bottom-24 right-6 z-50 w-96 h-[560px]'

  return (
    <>
      {/* Floating trigger button — always visible unless maximized */}
      {windowState !== 'maximized' && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1.5">
          <button
            onClick={() => setWindowState(windowState === 'closed' || windowState === 'minimized' ? 'normal' : 'minimized')}
            className="w-20 h-20 rounded-full shadow-2xl hover:shadow-green-300/50 flex items-center justify-center transition-all duration-200 hover:scale-105 overflow-hidden bg-gradient-to-br from-green-400 to-emerald-600 ring-4 ring-white ring-offset-2"
            title="CivicBot"
          >
            <img
              src="/chatbot_image.png"
              alt="CivicBot"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
            {/* Online indicator */}
            <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm" />
          </button>
          <span className="text-xs font-bold text-green-700 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md border border-green-100">
            CivicBot
          </span>
        </div>
      )}

      {/* Minimized bar */}
      {windowState === 'minimized' && (
        <div className="fixed bottom-24 right-6 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:shadow-2xl transition-all"
          onClick={() => setWindowState('normal')}
        >
          <div className="w-8 h-8 rounded-full bg-green-500 overflow-hidden flex items-center justify-center">
            <img src="/chatbot_image.png" alt="CivicBot" className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">CivicBot</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
              Click to expand
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setWindowState('closed') }}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main chat window */}
      {isOpen && (
        <div className={`${windowClass} bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden transition-all duration-200`}>

          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 flex items-center gap-3 shrink-0">
            {/* Avatar with image */}
            <div className="w-11 h-11 rounded-full overflow-hidden bg-green-400 ring-2 ring-white/40 shadow-md shrink-0">
              <img
                src="/chatbot_image.png"
                alt="CivicBot"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">CivicBot</p>
              <p className="text-green-100 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full inline-block animate-pulse" />
                AI Civic Assistant · Powered by Groq
              </p>
            </div>

            {/* Window controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setWindowState('minimized')}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                title="Minimize"
              >
                <Minus className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                onClick={() => setWindowState(windowState === 'maximized' ? 'normal' : 'maximized')}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                title={windowState === 'maximized' ? 'Restore' : 'Maximize'}
              >
                {windowState === 'maximized'
                  ? <Minimize2 className="w-3.5 h-3.5 text-white" />
                  : <Maximize2 className="w-3.5 h-3.5 text-white" />
                }
              </button>
              <button
                onClick={() => setWindowState('closed')}
                className="w-7 h-7 rounded-lg bg-white/20 hover:bg-red-500/70 flex items-center justify-center transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-green-500 mr-2 shrink-0 mt-1 shadow-sm ring-1 ring-white">
                    <img src="/chatbot_image.png" alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-green-500 mr-2 shrink-0 shadow-sm">
                  <img src="/chatbot_image.png" alt="" className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 border border-gray-100 shadow-sm">
                  <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick suggestions — only at start */}
            {messages.length === 1 && !loading && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-gray-400 px-1">Quick questions:</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="w-full text-left text-xs px-3.5 py-2.5 rounded-xl bg-white border border-green-100 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm font-medium"
                  >
                    💬 {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
            <input
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 placeholder-gray-400"
              placeholder="Ask about civic issues..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send(input)}
              disabled={loading}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl flex items-center justify-center disabled:opacity-40 transition-all shadow-sm hover:shadow-md"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
