// app/app/chats/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMyChats } from '@/lib/queries/chats'
import { Avatar } from '@/components/ui/Avatar'
import Link from 'next/link'

export default async function ChatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const chats = await getMyChats(user.id)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-foreground mb-4">Chats</h1>
      {chats.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">💬</div>
          <p className="text-foreground font-semibold">No tienes chats aún</p>
          <p className="text-muted text-sm mt-1">Cuando encuentres un match, podrás chatear desde ahí.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {chats.map((chat: any) => {
            const other = chat.user_a.id === user.id ? chat.user_b : chat.user_a
            return (
              <Link key={chat.id} href={`/app/chats/${chat.id}`}
                className="bg-card border border-border rounded-xl p-4 flex gap-3 items-center hover:border-primary/40 transition-colors">
                <Avatar src={other.avatar_url} name={other.username} size={44} />
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-semibold text-sm">{other.username}</div>
                  <div className="text-muted text-xs mt-0.5">
                    {chat.matches?.status === 'completed' ? '✅ Intercambio completado' : '🔄 En proceso'}
                  </div>
                </div>
                <span className="text-muted text-xs">→</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
