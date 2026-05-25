import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { href: '/admin',          label: '📊 Dashboard' },
  { href: '/admin/users',    label: '👥 Usuarios' },
  { href: '/admin/stamps',   label: '🏷️ Estampas' },
  { href: '/admin/reports',  label: '🚨 Reportes' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || user.email !== adminEmail) redirect('/')

  return (
    <div className="min-h-screen bg-base flex">
      <aside className="w-52 shrink-0 bg-card border-r border-border flex flex-col py-6 px-3 fixed top-0 bottom-0 left-0">
        <div className="text-primary font-extrabold text-lg px-3 mb-6">⚽ Admin</div>
        <nav className="flex flex-col gap-1">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 rounded-xl text-sm text-muted hover:bg-base hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-3">
          <Link href="/app" className="text-xs text-muted hover:text-foreground transition-colors">
            ← Volver a la app
          </Link>
        </div>
      </aside>
      <main className="ml-52 flex-1 p-8 max-w-5xl">
        {children}
      </main>
    </div>
  )
}
