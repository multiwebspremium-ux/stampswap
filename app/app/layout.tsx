import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { SideNav } from '@/components/layout/SideNav'
import Link from 'next/link'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = !!user && user.email === process.env.ADMIN_EMAIL

  return (
    <div className="min-h-screen bg-base">
      <Header />
      <div className="pt-14 flex justify-center min-h-screen">
        <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] border-r border-border pt-6 px-3">
          <SideNav />
          {isAdmin && (
            <Link
              href="/admin"
              className="mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary text-[#0f1923] hover:brightness-110 transition-all"
            >
              <span>⚙️</span> Admin Panel
            </Link>
          )}
        </aside>
        <main className="w-full max-w-lg md:max-w-2xl pb-16 md:pb-6 md:px-6 min-h-screen">
          {children}
        </main>
        <div className="hidden lg:block w-56 shrink-0" />
      </div>
      <BottomNav />
    </div>
  )
}
