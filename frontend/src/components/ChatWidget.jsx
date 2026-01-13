import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { isAuthenticated } from '../api/auth'
import { getMyChatMessages, sendMyChatMessage } from '../api/chat'
import './ChatWidget.css'

export default function ChatWidget() {
  const authed = isAuthenticated()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const listRef = useRef(null)

  const fetchMessages = async () => {
    if (!authed) return
    try {
      const res = await getMyChatMessages(120)
      setMessages(res.messages || [])
      setError(null)
    } catch (e) {
      setError(e.response?.data?.message || 'Chat unavailable')
    }
  }

  useEffect(() => {
    if (!open) return
    let id
    const run = async () => {
      setLoading(true)
      await fetchMessages()
      setLoading(false)
      id = window.setInterval(fetchMessages, 3000) // near real-time polling
    }
    run()
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, open])

  const send = async () => {
    if (!text.trim()) return
    try {
      setLoading(true)
      await sendMyChatMessage(text.trim())
      setText('')
      await fetchMessages()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  if (!authed) return null

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(true)} aria-label="Open chat">
        <MessageCircle size={22} />
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-modal="false">
          <div className="chat-head">
            <div>
              <div className="chat-title">Chat with Batino&apos;s</div>
              <div className="chat-subtitle">We&apos;ll get back to you soon.</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          <div className="chat-body" ref={listRef}>
            {error && <div className="chat-error">{error}</div>}
            {messages.map((m) => (
              <div
                key={m._id}
                className={`chat-msg ${
                  m.senderType === 'user' ? 'chat-msg--me' : m.senderType === 'admin' ? 'chat-msg--admin' : 'chat-msg--sys'
                }`}
              >
                <div className="chat-bubble">{m.text}</div>
                <div className="chat-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send()
              }}
            />
            <button className="btn btn-primary btn-sm" onClick={send} disabled={loading}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

