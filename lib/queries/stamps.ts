import { createClient } from '@/lib/supabase/server'
import type { Stamp, StampType } from '@/types/database'

export async function getMyStamps(userId: string): Promise<Stamp[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stamps')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getRecentStamps(limit = 12): Promise<(Stamp & { profiles?: { username: string; city: string } | null })[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('stamps')
    .select('*, profiles(username, city)')
    .eq('type', 'have')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as (Stamp & { profiles?: { username: string; city: string } | null })[]
}

export async function searchStamps(params: {
  query?: string
  country?: string
  rarity?: string
  type?: StampType
  limit?: number
}) {
  const supabase = await createClient()
  let q = supabase
    .from('stamps')
    .select('*, profiles(username, city, avatar_url, reputation_score)')
    .order('created_at', { ascending: false })
    .limit(params.limit ?? 30)

  if (params.query) q = q.or(`player_name.ilike.%${params.query}%,country.ilike.%${params.query}%`)
  if (params.country) q = q.eq('country', params.country)
  if (params.rarity) q = q.eq('rarity', params.rarity)
  if (params.type) q = q.eq('type', params.type)

  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function createStamp(stamp: Omit<Stamp, 'id' | 'created_at'>) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('stamps') as any).insert(stamp).select().single()
  if (error) throw error
  return data as Stamp
}

type WantedStampRow = { number: number; player_name: string; country: string; rarity: string }

export async function getMostWantedStamps(limit = 10) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from('stamps')
    .select('number, player_name, country, rarity')
    .eq('type', 'want') as { data: WantedStampRow[] | null }

  if (!data) return []

  // Group by number and count
  const counts: Record<number, { number: number; player_name: string; country: string; rarity: string; count: number }> = {}
  for (const s of data) {
    if (!counts[s.number]) {
      counts[s.number] = { number: s.number, player_name: s.player_name, country: s.country, rarity: s.rarity, count: 0 }
    }
    counts[s.number].count++
  }

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}
