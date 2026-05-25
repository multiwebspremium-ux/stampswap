'use client'
import { useRef, useState, useTransition } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { createClient } from '@/lib/supabase/client'
import { updateAvatarAction } from './actions'

export function AvatarUpload({
  userId,
  avatarUrl,
  name,
}: {
  userId: string
  avatarUrl: string | null
  name: string
}) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(avatarUrl)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { alert('La imagen no puede superar 3 MB'); return }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (error) { alert('Error al subir: ' + error.message); setUploading(false); return }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const url = data.publicUrl + '?t=' + Date.now()
    setPreview(url)
    setUploading(false)

    startTransition(() => { updateAvatarAction(data.publicUrl) })
  }

  return (
    <div className="relative shrink-0 cursor-pointer group" onClick={() => fileRef.current?.click()}>
      <Avatar src={preview} name={name} size={64} />
      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        {uploading || isPending
          ? <span className="text-white text-xs">...</span>
          : <span className="text-white text-lg">📷</span>
        }
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}
