import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/queries/profiles'
import { getMyStamps } from '@/lib/queries/stamps'
import { AvatarUpload } from './AvatarUpload'
import { Badge } from '@/components/ui/Badge'
import { StampCard } from '@/components/ui/StampCard'
import Link from 'next/link'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, stamps] = await Promise.all([
    getProfile(user.id),
    getMyStamps(user.id),
  ])

  if (!profile) redirect('/login')

  const have = stamps.filter(s => s.type === 'have')
  const want = stamps.filter(s => s.type === 'want')

  return (
    <div className="p-4 space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-center">
        <AvatarUpload userId={user.id} avatarUrl={profile.avatar_url} name={profile.full_name} />
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
            <div>
              <div className="text-foreground font-bold text-sm">{stamps.length}</div>
              <div className="text-muted text-xs">Estampas</div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-foreground font-semibold text-sm mb-2">📦 Tengo para intercambiar ({have.length})</h2>
        {have.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-muted text-xs">Aún no publicaste repetidas.</p>
            <Link href="/app/publish" className="text-primary text-xs font-medium mt-1 inline-block">+ Publicar ahora</Link>
          </div>
        ) : (
          <div className="space-y-2">{have.map(s => <StampCard key={s.id} stamp={s} />)}</div>
        )}
      </section>

      <section>
        <h2 className="text-foreground font-semibold text-sm mb-2">❤️ Me faltan ({want.length})</h2>
        {want.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-muted text-xs">Agrega las que te faltan para encontrar matches.</p>
            <Link href="/app/publish" className="text-primary text-xs font-medium mt-1 inline-block">+ Agregar wishlist</Link>
          </div>
        ) : (
          <div className="space-y-2">{want.map(s => <StampCard key={s.id} stamp={s} />)}</div>
        )}
      </section>
    </div>
  )
}
