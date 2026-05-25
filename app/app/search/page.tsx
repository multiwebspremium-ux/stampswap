import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { searchStamps } from '@/lib/queries/stamps'
import { SearchClient } from './SearchClient'

export default async function SearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const initial = await searchStamps({ type: 'have', limit: 20 })

  async function doSearch(params: { query: string; rarity: string; onlyHave: boolean }) {
    'use server'
    return searchStamps({
      query: params.query || undefined,
      rarity: params.rarity || undefined,
      type: params.onlyHave ? 'have' : undefined,
      limit: 30,
    })
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-foreground mb-1">Buscar estampas</h1>
      <p className="text-muted text-sm mb-4">Encuentra las que necesitas</p>
      <SearchClient initialResults={initial as any[]} onSearch={doSearch} />
    </div>
  )
}
