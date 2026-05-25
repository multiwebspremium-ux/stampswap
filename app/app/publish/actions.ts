'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function publishStampAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Rate limit: max 10 publicaciones por día
  const since = new Date()
  since.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('stamps')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .gte('created_at', since.toISOString())

  if ((count ?? 0) >= 10) {
    return { error: 'Límite diario alcanzado (máx. 10 publicaciones por día)' }
  }

  const number = parseInt(formData.get('number') as string)
  if (isNaN(number) || number < 1 || number > 700) {
    return { error: 'Número inválido (1-700)' }
  }

  const image_url = formData.get('image_url') as string | null

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('stamps') as any).insert({
    owner_id: user.id,
    number,
    player_name: (formData.get('player_name') as string).trim(),
    country: formData.get('country') as string,
    rarity: formData.get('rarity') as string,
    quantity: parseInt((formData.get('quantity') as string) ?? '1'),
    type: formData.get('type') as string,
    ...(image_url ? { image_url } : {}),
  })

  if (error) return { error: error.message }
  redirect('/app/profile')
}
