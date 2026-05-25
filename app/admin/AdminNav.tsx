'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin',         label: '📊 Dashboard',  color: 'bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 active:bg-blue-600 active:text-white' },
  { href: '/admin/users',   label: '👥 Usuarios',   color: 'bg-violet-500/15 text-violet-600 hover:bg-violet-500/25 active:bg-violet-600 active:text-white' },
  { href: '/admin/stamps',  label: '🏷️ Estampas',  color: 'bg-primary/15 text-primary hover:bg-primary/25 active:bg-primary-dark active:text-white' },
  { href: '/admin/reports', label: '🚨 Reportes',   color: 'bg-danger/15 text-danger hover:bg-danger/25 active:bg-danger active:text-white' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <>
      <nav className="flex flex-col gap-2">
        {NAV.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                item.color,
                active && 'ring-2 ring-current ring-offset-1 ring-offset-card brightness-90'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto">
        <Link
          href="/app"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold bg-foreground/10 text-foreground hover:bg-foreground/20 active:bg-foreground/30 transition-all"
        >
          ← Volver a la app
        </Link>
      </div>
    </>
  )
}
