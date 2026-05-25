'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1218] border-b border-border h-14 flex items-center justify-between px-4 max-w-lg mx-auto w-full">
      <Link href="/app" className="text-primary font-extrabold text-lg tracking-tight">
        ⚽ StampSwap
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/app/publish"
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.35)] hover:brightness-110 transition-all"
          title="Publicar estampa"
        >
          <span className="text-base font-black leading-none text-[#0f1923]">＋</span>
        </Link>
        <button
          className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center relative hover:border-primary/40 transition-colors"
          title="Notificaciones"
        >
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border border-[#0a1218]" />
        </button>
      </div>
    </header>
  )
}
