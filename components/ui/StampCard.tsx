import Image from 'next/image'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'
import type { Stamp } from '@/types/database'

const rarityLabel: Record<string, string> = {
  common: '⚪ Común', rare: '🔵 Rara', star: '⭐ Estrella', ultra: '💎 Ultra'
}

interface StampCardProps {
  stamp: Stamp & { profiles?: { username: string; city: string } | null }
  showOwner?: boolean
  hideOwner?: boolean
  className?: string
  onClick?: () => void
}

export function StampCard({ stamp, showOwner, hideOwner, className, onClick }: StampCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-xl p-3 flex gap-3 items-center',
        onClick && 'cursor-pointer hover:border-primary/40 transition-colors active:bg-border/30',
        className
      )}
    >
      {stamp.image_url ? (
        <Image src={stamp.image_url} alt={stamp.player_name} width={44} height={56}
          className="rounded-lg object-cover flex-shrink-0" style={{width:44,height:56}} />
      ) : (
        <div className="w-11 h-14 rounded-lg bg-gradient-to-b from-primary-dark/60 to-primary/40 flex items-center justify-center text-xl flex-shrink-0">
          ⚽
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-foreground text-sm font-bold truncate">{stamp.player_name}</div>
        <div className="text-muted text-xs mt-0.5">{stamp.country} · #{stamp.number}</div>
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          <Badge variant={stamp.type === 'have' ? 'have' : 'want'}>
            {stamp.type === 'have' ? `TENGO ×${stamp.quantity}` : 'ME FALTA'}
          </Badge>
          <Badge variant="rarity">{rarityLabel[stamp.rarity]}</Badge>
        </div>
        {showOwner && !hideOwner && stamp.profiles && (
          <div className="text-muted text-xs mt-1.5 truncate">
            👤 {stamp.profiles.username} · {stamp.profiles.city}
          </div>
        )}
        {hideOwner && (
          <div className="text-muted text-xs mt-1.5 italic">
            🔒 Inicia sesión para ver quién la tiene
          </div>
        )}
      </div>
    </div>
  )
}
