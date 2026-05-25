import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { SideNav } from '@/components/layout/SideNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      {/* Desktop: sidebar + content. Mobile: full width + bottom nav */}
      <div className="pt-14 flex justify-center min-h-screen">
        {/* Sidebar — only on desktop */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] border-r border-border pt-6 px-3">
          <SideNav />
        </aside>
        {/* Main content */}
        <main className="w-full max-w-lg md:max-w-2xl pb-16 md:pb-6 md:px-6 min-h-screen">
          {children}
        </main>
        {/* Right spacer on large screens for centering */}
        <div className="hidden lg:block w-56 shrink-0" />
      </div>
      {/* Bottom nav — only on mobile */}
      <BottomNav />
    </div>
  )
}
