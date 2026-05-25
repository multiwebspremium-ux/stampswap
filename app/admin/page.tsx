import { createClient } from '@/lib/supabase/server'

async function getStats() {
  const supabase = await createClient()
  const [users, stamps, matches, reports] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('stamps').select('id', { count: 'exact', head: true }),
    supabase.from('matches').select('id', { count: 'exact', head: true }),
    supabase.from('reports').select('id', { count: 'exact', head: true }),
  ])
  return {
    users: users.count ?? 0,
    stamps: stamps.count ?? 0,
    matches: matches.count ?? 0,
    reports: reports.count ?? 0,
  }
}

export default async function AdminPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Usuarios', value: stats.users, icon: '👥', color: 'text-blue-500' },
    { label: 'Estampas', value: stats.stamps, icon: '🏷️', color: 'text-primary' },
    { label: 'Matches', value: stats.matches, icon: '🔥', color: 'text-amber' },
    { label: 'Reportes', value: stats.reports, icon: '🚨', color: 'text-danger' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-muted text-sm mt-1">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
