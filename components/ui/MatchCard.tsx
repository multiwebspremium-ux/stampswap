import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Button } from './Button'
import type { Stamp, Profile } from '@/types/database'

interface MatchCardProps {
  stamp: Stamp
  user: Pick<Profile, 'id' | 'username' | 'city' | 'avatar_url' | 'reputation_score'>
  onChat: () => void
}

export function MatchCard({ stamp, user, onChat }: MatchCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex gap-3 items-start">
        <Avatar src={user.avatar_url} name={user.username} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-bold text-sm">{user.username}</span>
            {user.reputation_score > 4 && (
              <Badge variant="verified">⭐ {user.reputation_score}</Badge>
            )}
          </div>
          <div className="text-muted text-xs">{user.city}</div>
          <div className="mt-2">
            <div className="text-xs text-muted mb-1">Tiene:</div>
            <div className="text-foreground text-sm font-semibold">
              {stamp.player_name} <span className="text-muted">#{stamp.number}</span>
            </div>
            <div className="text-muted text-xs">{stamp.country}</div>
          </div>
        </div>
      </div>
      <div className="mt-3 bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
        <span className="text-primary text-xs font-bold">🔥 MATCH — tiene lo que necesitas</span>
      </div>
      <Button onClick={onChat} size="sm" className="w-full mt-3">
        💬 Iniciar intercambio
      </Button>
    </div>
  )
}
