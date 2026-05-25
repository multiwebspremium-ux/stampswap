import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMyMatches } from '@/lib/queries/matches'
import { getRecentStamps } from '@/lib/queries/stamps'
import { MatchCard } from '@/components/ui/MatchCard'
import { StampCard } from '@/components/ui/StampCard'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [matches, recent] = await Promise.all([
    getMyMatches(user.id),
    getRecentStamps(6),
  ])

  const topMatches = matches.slice(0, 3)

  return (
    <div className="p-4 space-y-6">
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-bold text-base">🔥 Matches hoy</h2>
          {matches.length > 3 && (
            <Link href="/app/matches" className="text-primary text-xs font-medium">Ver todos →</Link>
          )}
        </div>
        {topMatches.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-muted text-sm">Aún no hay matches.</p>
            <p className="text-muted text-xs mt-1">Publica tus estampas repetidas para encontrar coincidencias.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topMatches.map((s: any) => (
              <MatchCard key={s.id} stamp={s} user={s.profiles} onChat={() => {}} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-foreground font-bold text-base mb-3">🆕 Recién publicadas</h2>
        <div className="space-y-2">
          {(recent as any[]).map((s: any) => (
            <StampCard key={s.id} stamp={s} showOwner />
          ))}
        </div>
      </section>
    </div>
  )
}
