'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Rarity, StampType } from '@/types/database'
import { publishStampAction } from './actions'

const RARITIES: { value: Rarity; label: string }[] = [
  { value: 'common', label: '⚪ Común' },
  { value: 'rare',   label: '🔵 Rara' },
  { value: 'star',   label: '⭐ Estrella' },
  { value: 'ultra',  label: '💎 Ultra Rara' },
]

const FIFA_COUNTRIES = ['Argentina','Brasil','Francia','Inglaterra','España','Alemania','Portugal','México','Uruguay','Colombia','Ecuador','Perú','Chile','Paraguay','Bolivia','Venezuela','Costa Rica','Panamá','Honduras','Guatemala','El Salvador','Jamaica','Canadá','Estados Unidos','Marruecos','Senegal','Nigeria','Camerún','Ghana','Costa de Marfil','Egipto','Sudáfrica','Arabia Saudita','Japón','Corea del Sur','Irán','Australia','Qatar','Serbia','Croacia','Países Bajos','Bélgica','Dinamarca','Polonia','Suiza','Austria','Ucrania','Turquía','Escocia','Albania']

export function PublishForm({ userId }: { userId: string }) {
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [type, setType] = useState<StampType>('have')
  const [preview, setPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    number: '', player_name: '', country: '', rarity: 'common' as Rarity, quantity: '1'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('La imagen no puede superar 5 MB'); return }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null
    const ext = imageFile.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('stamps')
      .upload(path, imageFile, { upsert: false })
    if (uploadError) { setError('Error al subir imagen: ' + uploadError.message); return null }
    const { data } = supabase.storage.from('stamps').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const image_url = await uploadImage()
    if (imageFile && !image_url) { setLoading(false); return }

    const fd = new FormData()
    fd.append('type', type)
    fd.append('number', form.number)
    fd.append('player_name', form.player_name)
    fd.append('country', form.country)
    fd.append('rarity', form.rarity)
    fd.append('quantity', form.quantity)
    if (image_url) fd.append('image_url', image_url)

    const result = await publishStampAction(fd)
    setLoading(false)
    if (result?.error) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {(['have', 'want'] as StampType[]).map(t => (
          <button key={t} type="button" onClick={() => setType(t)}
            className={`py-3 rounded-xl font-bold text-sm transition-all border ${
              type === t
                ? t === 'have'
                  ? 'bg-primary/15 border-primary text-primary'
                  : 'bg-amber/15 border-amber text-amber'
                : 'bg-card border-border text-muted'
            }`}>
            {t === 'have' ? '📦 Tengo (repetida)' : '❤️ Me falta'}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* Image upload */}
      <div
        onClick={() => fileRef.current?.click()}
        className="relative cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors overflow-hidden bg-card flex items-center justify-center"
        style={{ minHeight: '140px' }}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">Cambiar imagen</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-muted">
            <span className="text-3xl">📷</span>
            <span className="text-sm">Foto de la estampa (opcional)</span>
            <span className="text-xs opacity-60">JPG, PNG — máx. 5 MB</span>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>

      <input name="number" type="number" min={1} max={700} placeholder="Número de la estampa (ej: 10)"
        required value={form.number} onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />

      <input name="player_name" placeholder="Nombre del jugador (ej: Messi)" required
        value={form.player_name} onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />

      <select name="country" required value={form.country} onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary transition-colors">
        <option value="">Selecciona selección</option>
        {FIFA_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select name="rarity" required value={form.rarity} onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary transition-colors">
        {RARITIES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
      </select>

      {type === 'have' && (
        <input name="quantity" type="number" min={1} max={20} placeholder="Cantidad de repetidas"
          value={form.quantity} onChange={handleChange}
          className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />
      )}

      <Button type="submit" disabled={loading} size="lg" className="w-full mt-2">
        {loading ? 'Publicando...' : type === 'have' ? '📦 Publicar repetida' : '❤️ Agregar a wishlist'}
      </Button>
    </form>
  )
}
