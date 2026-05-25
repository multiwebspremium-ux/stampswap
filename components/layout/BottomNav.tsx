'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/app',         icon: '🏠', label: 'Inicio' },
  { href: '/app/search',  icon: '🔍', label: 'Buscar' },
  { href: '/app/matches', icon: '🔥', label: 'Matches' },
  { href: '/app/chats',   icon: '💬', label: 'Chats' },
  { href: '/app/profile', icon: '👤', label: 'Perfil' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a1218] border-t border-border h-16 flex items-stretch max-w-lg mx-auto w-full">
      {tabs.map(tab => {
        const active = pathname === tab.href || (tab.href !== '/app' && pathname.startsWith(tab.href))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
              active ? 'text-primary' : 'text-muted hover:text-foreground'
            )}
          >
            <span className={cn('text-xl leading-none', active && 'drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]')}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
