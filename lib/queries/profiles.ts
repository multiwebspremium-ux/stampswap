import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('username', username).single()
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any).update(updates).eq('id', userId)
  if (error) throw error
}

export type TopUser = { id: string; username: string | null; avatar_url: string | null; reputation_score: number | null; trades_count: number | null }

export async function getTopUsers(limit = 8): Promise<TopUser[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('profiles')
    .select('id, username, avatar_url, reputation_score, trades_count')
    .order('trades_count', { ascending: false })
    .order('reputation_score', { ascending: false })
    .limit(limit) as { data: TopUser[] | null }
  return data ?? []
}
