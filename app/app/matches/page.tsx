import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMyMatches } from '@/lib/queries/matches'
import { MatchCard } from '@/components/ui/MatchCard'

export default async function MatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const matches = await getMyMatches(user.id)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-foreground mb-1">Mis Matches</h1>
      <p className="text-muted text-sm mb-4">
        {matches.length} coincidencia{matches.length !== 1 ? 's' : ''} encontrada{matches.length !== 1 ? 's' : ''}
      </p>
      {matches.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center mt-8">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-foreground font-semibold">No hay matches todavía</p>
          <p className="text-muted text-sm mt-1">
            Publica lo que te falta y lo que tienes de más para encontrar personas con quien intercambiar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(matches as any[]).map((s: any) => (
            <MatchCard key={s.id} stamp={s} user={s.profiles} onChat={() => {}} />
          ))}
        </div>
      )}
    </div>
  )
}
