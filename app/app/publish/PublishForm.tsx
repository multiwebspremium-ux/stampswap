'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { Rarity, StampType } from '@/types/database'

const RARITIES: { value: Rarity; label: string }[] = [
  { value: 'common', label: '⚪ Común' },
  { value: 'rare',   label: '🔵 Rara' },
  { value: 'star',   label: '⭐ Estrella' },
  { value: 'ultra',  label: '💎 Ultra Rara' },
]

const FIFA_COUNTRIES = ['Argentina','Brasil','Francia','Inglaterra','España','Alemania','Portugal','México','Uruguay','Colombia','Ecuador','Perú','Chile','Paraguay','Bolivia','Venezuela','Costa Rica','Panamá','Honduras','Guatemala','El Salvador','Jamaica','Canadá','Estados Unidos','Marruecos','Senegal','Nigeria','Camerún','Ghana','Costa de Marfil','Egipto','Sudáfrica','Arabia Saudita','Japón','Corea del Sur','Irán','Australia','Qatar','Serbia','Croacia','Países Bajos','Bélgica','Dinamarca','Polonia','Suiza','Austria','Ucrania','Turquía','Escocia','Albania']

export function PublishForm({ userId }: { userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [type, setType] = useState<StampType>('have')
  const [form, setForm] = useState({
    number: '', player_name: '', country: '', rarity: 'common' as Rarity, quantity: '1'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const num = parseInt(form.number)
    if (isNaN(num) || num < 1 || num > 700) { setError('Número inválido (1-700)'); return }

    setLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase.from('stamps') as any).insert({
      owner_id: userId,
      number: num,
      player_name: form.player_name.trim(),
      country: form.country,
      rarity: form.rarity,
      quantity: type === 'have' ? parseInt(form.quantity) : 1,
      type,
    })
    setLoading(false)
    if (insertError) { setError(insertError.message); return }
    router.push('/app/profile')
    router.refresh()
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
