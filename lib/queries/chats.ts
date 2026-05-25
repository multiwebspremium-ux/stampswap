import { createClient } from '@/lib/supabase/server'
import type { Message } from '@/types/database'

export async function getMyChats(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      matches(status, stamp_a_id, stamp_b_id),
      user_a:profiles!chats_user_a_id_fkey(id, username, avatar_url),
      user_b:profiles!chats_user_b_id_fkey(id, username, avatar_url)
    `)
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function sendMessage(msg: {
  chat_id: string
  sender_id: string
  content?: string
  image_url?: string
}) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('messages') as any)
    .insert({
      chat_id: msg.chat_id,
      sender_id: msg.sender_id,
      content: msg.content ?? null,
      image_url: msg.image_url ?? null,
    })
    .select()
    .single()
  if (error) throw error
  return data as import('@/types/database').Message
}
