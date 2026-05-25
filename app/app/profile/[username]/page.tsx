import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getProfileByUsername } from '@/lib/queries/profiles'
import { getMyStamps } from '@/lib/queries/stamps'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { StampCard } from '@/components/ui/StampCard'

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getProfileByUsername(username)
  if (!profile) notFound()
  if (profile.id === user.id) redirect('/app/profile')

  const stamps = await getMyStamps(profile.id)
  const have = stamps.filter(s => s.type === 'have')

  return (
    <div className="p-4 space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-center">
        <Avatar src={profile.avatar_url} name={profile.full_name} size={64} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-foreground font-bold text-lg">{profile.full_name}</span>
            {profile.verified && <Badge variant="verified">✓ Verificado</Badge>}
          </div>
          <div className="text-muted text-sm">@{profile.username}</div>
          <div className="text-muted text-xs mt-0.5">📍 {profile.city}</div>
          <div className="flex gap-4 mt-2">
            <div>
              <div className="text-foreground font-bold text-sm">{profile.trades_count}</div>
              <div className="text-muted text-xs">Intercambios</div>
            </div>
            <div>
              <div className="text-foreground font-bold text-sm">
                {profile.reputation_score > 0 ? `⭐ ${profile.reputation_score}` : '—'}
              </div>
              <div className="text-muted text-xs">Reputación</div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-foreground font-semibold text-sm mb-2">📦 Tiene para intercambiar ({have.length})</h2>
        {have.length === 0 ? (
          <p className="text-muted text-xs">Este usuario no tiene estampas publicadas.</p>
        ) : (
          <div className="space-y-2">{have.map(s => <StampCard key={s.id} stamp={s} />)}</div>
        )}
      </section>
    </div>
  )
}
