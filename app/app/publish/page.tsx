import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PublishForm } from './PublishForm'

export default async function PublishPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-foreground mb-1">Publicar estampa</h1>
      <p className="text-muted text-sm mb-6">Agrega una repetida o una que te falta</p>
      <div className="bg-card border border-border rounded-2xl p-5">
        <PublishForm userId={user.id} />
      </div>
    </div>
  )
}
