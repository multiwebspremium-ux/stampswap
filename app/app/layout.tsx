import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <main className="pt-14 pb-16 max-w-lg mx-auto min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
