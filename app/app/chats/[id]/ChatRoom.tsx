'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { Message } from '@/types/database'

interface ChatRoomProps {
  chatId: string
  matchId: string
  userId: string
  otherUserId: string
  initialMessages: Message[]
  otherUsername: string
  matchStatus: string
}

export function ChatRoom({ chatId, matchId, userId, otherUserId, initialMessages, otherUsername, matchStatus }: ChatRoomProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [chatId, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    await supabase.from('messages').insert({ chat_id: chatId, sender_id: userId, content: text.trim() } as any)
    setText('')
    setSending(false)
  }

  async function handleComplete(score: number, comment: string) {
    await (supabase.from('matches') as any).update({ status: 'completed' }).eq('id', matchId)
    await supabase.from('ratings').insert({
      match_id: matchId,
      rater_id: userId,
      rated_id: otherUserId,
      score,
      comment: comment || null,
    } as any)
    setShowCompleteModal(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Aviso de seguridad */}
      <div className="bg-amber/10 border-b border-amber/20 px-4 py-2">
        <p className="text-amber text-xs">⚠️ Intercambia en lugares públicos · Nunca envíes dinero</p>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map(msg => {
          const isMine = msg.sender_id === userId
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                isMine
                  ? 'bg-gradient-to-br from-primary-dark to-primary rounded-br-sm'
                  : 'bg-card border border-border text-foreground rounded-bl-sm'
              }`} style={isMine ? { color: '#0f1923' } : {}}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Acciones */}
      {matchStatus !== 'completed' && (
        <div className="px-4 pb-1 pt-1">
          <button onClick={() => setShowCompleteModal(true)}
            className="w-full text-xs text-primary border border-primary/30 rounded-xl py-2 hover:bg-primary/10 transition-colors">
            ✅ Marcar intercambio como realizado
          </button>
        </div>
      )}

      {/* Botón reportar */}
      <button onClick={() => setShowReport(true)}
        className="text-xs text-muted hover:text-danger transition-colors px-4 pb-1 text-left">
        ⚑ Reportar usuario
      </button>

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 pb-2 pt-1 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Escribe un mensaje..."
          className="flex-1 bg-card border border-border rounded-full px-4 py-2.5 text-foreground placeholder:text-muted text-sm outline-none focus:border-primary transition-colors" />
        <Button type="submit" disabled={!text.trim() || sending} size="sm" className="px-4">↑</Button>
      </form>

      {/* Modal calificación */}
      {showCompleteModal && (
        <RatingModal onClose={() => setShowCompleteModal(false)} onSubmit={handleComplete} otherUsername={otherUsername} />
      )}

      {/* Modal reporte */}
      {showReport && (
        <ReportBlock
          reporterId={userId}
          reportedId={otherUserId}
          reportedUsername={otherUsername}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  )
}

function RatingModal({ onClose, onSubmit, otherUsername }: {
  onClose: () => void
  onSubmit: (score: number, comment: string) => void
  otherUsername: string
}) {
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-foreground font-bold text-lg mb-1">¿Cómo fue el intercambio?</h3>
        <p className="text-muted text-sm mb-4">Califica a @{otherUsername}</p>
        <div className="flex gap-2 justify-center mb-4">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setScore(n)}
              className={`text-2xl transition-transform ${n <= score ? 'scale-110' : 'opacity-30'}`}>⭐</button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Comentario opcional (ej: Muy puntual, todo bien)"
          className="w-full bg-base border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted text-sm outline-none focus:border-primary resize-none h-20 mb-4" />
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={() => onSubmit(score, comment)} className="flex-1">Enviar ✓</Button>
        </div>
      </div>
    </div>
  )
}

const REASONS = [
  'Comportamiento sospechoso',
  'No se presentó al intercambio',
  'Contenido inapropiado',
  'Spam o estafa',
  'Otro',
]

function ReportBlock({ reporterId, reportedId, reportedUsername, onClose }: {
  reporterId: string
  reportedId: string
  reportedUsername: string
  onClose: () => void
}) {
  const supabase = createClient()
  const [reason, setReason] = useState('')
  const [done, setDone] = useState(false)

  async function handleReport() {
    if (!reason) return
    await supabase.from('reports').insert({ reporter_id: reporterId, reported_id: reportedId, reason } as any)
    setDone(true)
  }

  async function handleBlock() {
    await supabase.from('blocks').insert({ blocker_id: reporterId, blocked_id: reportedId } as any)
    setDone(true)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm">
        {done ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">✅</div>
            <p className="text-foreground font-semibold">Acción registrada</p>
            <p className="text-muted text-sm mt-1">Gracias por ayudar a mantener la comunidad segura.</p>
            <Button onClick={onClose} className="w-full mt-4" variant="ghost">Cerrar</Button>
          </div>
        ) : (
          <>
            <h3 className="text-foreground font-bold text-lg mb-1">Reportar a @{reportedUsername}</h3>
            <p className="text-muted text-sm mb-4">¿Qué ocurrió?</p>
            <div className="space-y-2 mb-4">
              {REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-colors ${
                    reason === r ? 'bg-danger/15 border-danger text-danger' : 'bg-base border-border text-muted hover:border-danger/40'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="danger" onClick={handleReport} disabled={!reason} className="w-full">
                Reportar usuario
              </Button>
              <Button variant="ghost" onClick={handleBlock} className="w-full">
                Bloquear y no volver a ver
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full">Cancelar</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
