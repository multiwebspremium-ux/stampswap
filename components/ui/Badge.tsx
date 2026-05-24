import { cn } from '@/lib/utils'

type BadgeVariant = 'have' | 'want' | 'match' | 'verified' | 'rarity'

const badgeStyles: Record<BadgeVariant, string> = {
  have: 'bg-primary/15 text-primary border border-primary/25',
  want: 'bg-amber/15 text-amber border border-amber/25',
  match: 'bg-primary/20 text-primary border border-primary/40 font-bold',
  verified: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  rarity: 'bg-card text-muted border border-border',
}

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        badgeStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
