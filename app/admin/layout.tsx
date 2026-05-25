import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNav } from './AdminNav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || user.email !== adminEmail) redirect('/')

  return (
    <div className="min-h-screen bg-base flex">
      <aside className="w-52 shrink-0 bg-card border-r border-border flex flex-col py-6 px-3 fixed top-0 bottom-0 left-0">
        <div className="text-primary font-extrabold text-lg px-3 mb-6">⚽ Admin</div>
        <AdminNav />
      </aside>
      <main className="ml-52 flex-1 p-8 max-w-5xl">
        {children}
      </main>
    </div>
  )
}
