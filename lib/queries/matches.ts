import { createClient } from '@/lib/supabase/server'
import type { Match, Chat } from '@/types/database'

export async function getMyMatches(userId: string) {
  const supabase = await createClient()
  const { data: wantStamps } = await supabase
    .from('stamps')
    .select('number')
    .eq('owner_id', userId)
    .eq('type', 'want')

  const wantedNumbers = (wantStamps ?? []).map((s: { number: number }) => s.number)
  if (!wantedNumbers.length) return []

  const { data, error } = await supabase
    .from('stamps')
    .select('*, profiles(id, username, city, avatar_url, reputation_score)')
    .eq('type', 'have')
    .in('number', wantedNumbers)
    .neq('owner_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createMatchAndChat(params: {
  userAId: string
  userBId: string
  stampAId: string
  stampBId: string
}) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchResult = await (supabase.from('matches') as any)
    .insert({
      user_a_id: params.userAId,
      user_b_id: params.userBId,
      stamp_a_id: params.stampAId,
      stamp_b_id: params.stampBId,
    })
    .select()
    .single()
  if (matchResult.error) throw matchResult.error
  const match = matchResult.data as Match

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatResult = await (supabase.from('chats') as any)
    .insert({
      match_id: match.id,
      user_a_id: params.userAId,
      user_b_id: params.userBId,
    })
    .select()
    .single()
  if (chatResult.error) throw chatResult.error
  const chat = chatResult.data as Chat
  return { match, chat }
}

export async function completeMatch(matchId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('matches') as any)
    .update({ status: 'completed' })
    .eq('id', matchId)
  if (error) throw error
}
