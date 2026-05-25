'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAvatarAction(avatarUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('profiles') as any).update({ avatar_url: avatarUrl }).eq('id', user.id)
  revalidatePath('/app/profile')
}

export async function updateProfileAction(data: { full_name: string; phone: string; city: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  if (!data.full_name.trim()) return { error: 'El nombre es requerido' }
  if (!data.city) return { error: 'La ciudad es requerida' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('profiles') as any)
    .update({ full_name: data.full_name.trim(), phone: data.phone || null, city: data.city })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/app/profile')
}
