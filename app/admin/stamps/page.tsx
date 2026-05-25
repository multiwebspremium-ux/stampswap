import { createClient } from '@/lib/supabase/server'

const RARITY_LABEL: Record<string, string> = {
  common: '⚪ Común',
  rare: '🔵 Rara',
  star: '⭐ Estrella',
  ultra: '💎 Ultra',
}

export default async function AdminStampsPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stamps } = await (supabase as any)
    .from('stamps')
    .select('id, number, player_name, country, rarity, type, quantity, created_at, profiles(username)')
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Estampas ({stamps?.length ?? 0})</h1>
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted text-xs">
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Jugador</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Selección</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Rareza</th>
              <th className="text-left px-4 py-3">Tipo</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Usuario</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {stamps?.map((s: {
              id: string; number: number; player_name: string; country: string;
              rarity: string; type: string; quantity: number; created_at: string;
              profiles: { username: string } | null;
            }) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-base transition-colors">
                <td className="px-4 py-3 text-muted font-mono">{s.number}</td>
                <td className="px-4 py-3 text-foreground font-medium">{s.player_name}</td>
                <td className="px-4 py-3 text-muted hidden md:table-cell">{s.country}</td>
                <td className="px-4 py-3 hidden md:table-cell">{RARITY_LABEL[s.rarity] ?? s.rarity}</td>
                <td className="px-4 py-3">
                  {s.type === 'have'
                    ? <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Tengo ×{s.quantity}</span>
                    : <span className="text-xs bg-amber/10 text-amber px-2 py-0.5 rounded-full">Me falta</span>}
                </td>
                <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">@{s.profiles?.username}</td>
                <td className="px-4 py-3 text-muted text-xs hidden md:table-cell">
                  {new Date(s.created_at).toLocaleDateString('es-MX')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
