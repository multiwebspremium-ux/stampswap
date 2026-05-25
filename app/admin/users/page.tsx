import { createClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/ui/Avatar'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: users } = await (supabase as any)
    .from('profiles')
    .select('id, username, full_name, city, avatar_url, trades_count, reputation_score, verified, created_at')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Usuarios ({users?.length ?? 0})</h1>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted text-xs">
              <th className="text-left px-4 py-3">Usuario</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Ciudad</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Intercambios</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Reputación</th>
              <th className="text-left px-4 py-3">Verificado</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Registro</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: {
              id: string; username: string; full_name: string; city: string;
              avatar_url: string | null; trades_count: number; reputation_score: number;
              verified: boolean; created_at: string;
            }) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-base transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar src={u.avatar_url} name={u.full_name} size={32} />
                    <div>
                      <div className="text-foreground font-medium">{u.full_name}</div>
                      <div className="text-muted text-xs">@{u.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted hidden md:table-cell">{u.city}</td>
                <td className="px-4 py-3 text-foreground hidden md:table-cell">{u.trades_count}</td>
                <td className="px-4 py-3 text-foreground hidden md:table-cell">
                  {u.reputation_score > 0 ? `⭐ ${u.reputation_score}` : '—'}
                </td>
                <td className="px-4 py-3">
                  {u.verified
                    ? <span className="text-primary text-xs font-medium">✓ Sí</span>
                    : <span className="text-muted text-xs">No</span>}
                </td>
                <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">
                  {new Date(u.created_at).toLocaleDateString('es-MX')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
