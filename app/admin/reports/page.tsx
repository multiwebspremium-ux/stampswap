import { createClient } from '@/lib/supabase/server'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reports } = await (supabase as any)
    .from('reports')
    .select(`
      id, reason, created_at,
      reporter:profiles!reports_reporter_id_fkey(username),
      reported:profiles!reports_reported_id_fkey(username)
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Reportes ({reports?.length ?? 0})</h1>
      {reports?.length === 0 && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted">
          No hay reportes pendientes. ✅
        </div>
      )}
      <div className="space-y-3">
        {reports?.map((r: {
          id: string; reason: string; created_at: string;
          reporter: { username: string } | null;
          reported: { username: string } | null;
        }) => (
          <div key={r.id} className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted">@{r.reporter?.username}</span>
                <span className="text-muted">→ reportó a →</span>
                <span className="text-danger font-medium">@{r.reported?.username}</span>
              </div>
              <span className="text-muted text-xs shrink-0">
                {new Date(r.created_at).toLocaleDateString('es-MX')}
              </span>
            </div>
            <p className="text-sm text-foreground bg-base rounded-xl px-3 py-2">{r.reason}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
