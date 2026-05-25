// app/app/chats/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getChatMessages } from '@/lib/queries/chats'
import { ChatRoom } from './ChatRoom'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: chat } = await supabase
    .from('chats')
    .select('*, matches(id, status), user_a:profiles!chats_user_a_id_fkey(id,username,avatar_url), user_b:profiles!chats_user_b_id_fkey(id,username,avatar_url)')
    .eq('id', id)
    .single()

  if (!chat) notFound()
  if ((chat as any).user_a_id !== user.id && (chat as any).user_b_id !== user.id) redirect('/app/chats')

  const messages = await getChatMessages(id)
  const userA = (chat as any).user_a
  const userB = (chat as any).user_b
  const other = userA.id === user.id ? userB : userA

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <div className="font-bold text-foreground text-sm">@{other.username}</div>
        <div className="text-muted text-xs">Intercambio de estampas</div>
      </div>
      <ChatRoom
        chatId={id}
        matchId={(chat as any).matches.id}
        userId={user.id}
        otherUserId={other.id}
        initialMessages={messages}
        otherUsername={other.username}
        matchStatus={(chat as any).matches.status}
      />
    </div>
  )
}
