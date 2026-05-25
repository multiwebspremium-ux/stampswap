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

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 w-full">
      {tabs.map(tab => {
        const active = pathname === tab.href || (tab.href !== '/app' && pathname.startsWith(tab.href))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted hover:bg-card hover:text-foreground'
            )}
          >
            <span className={cn('text-lg leading-none', active && 'drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]')}>
              {tab.icon}
            </span>
            {label(tab.label, active)}
          </Link>
        )
      })}
      <Link
        href="/app/publish"
        className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-br from-primary-dark to-primary text-[#0f1923] shadow-[0_0_10px_rgba(52,211,153,0.25)] hover:brightness-110 transition-all"
      >
        <span className="text-lg leading-none font-black">＋</span>
        Publicar estampa
      </Link>
    </nav>
  )
}

function label(text: string, active: boolean) {
  return <span className={active ? 'text-primary' : ''}>{text}</span>
}
