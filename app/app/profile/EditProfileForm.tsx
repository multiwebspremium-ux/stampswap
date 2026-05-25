'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { MEXICO_STATES } from '@/lib/data/mexico-locations'
import { updateProfileAction } from './actions'

type Props = {
  profile: { full_name: string; phone: string | null; city: string }
}

export function EditProfileForm({ profile }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [estado, setEstado] = useState(() => {
    const parts = profile.city.split(', ')
    return parts.length > 1 ? parts[parts.length - 1] : ''
  })
  const [form, setForm] = useState({
    full_name: profile.full_name,
    phone: profile.phone ?? '',
    city: profile.city,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await updateProfileAction(form)
    setLoading(false)
    if (result?.error) { setError(result.error); return }
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-primary border border-primary/30 px-3 py-1 rounded-full hover:bg-primary/10 transition-colors"
      >
        ✏️ Editar perfil
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground font-bold text-lg">Editar perfil</h2>
          <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground text-xl">✕</button>
        </div>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="full_name" placeholder="Nombre completo" required
            value={form.full_name} onChange={handleChange}
            className="w-full bg-base border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
          />
          <input
            name="phone" placeholder="Teléfono (ej: 5512345678)" type="tel"
            value={form.phone} onChange={handleChange}
            className="w-full bg-base border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"
          />
          <select
            value={estado}
            onChange={e => { setEstado(e.target.value); setForm(f => ({ ...f, city: '' })) }}
            className="w-full bg-base border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary transition-colors"
          >
            <option value="">Selecciona tu estado</option>
            {MEXICO_STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
          </select>
          {estado && (
            <select
              name="city" required value={form.city} onChange={handleChange}
              className="w-full bg-base border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary transition-colors"
            >
              <option value="">Selecciona tu ciudad</option>
              {MEXICO_STATES.find(s => s.name === estado)?.cities.map(c => (
                <option key={c} value={`${c}, ${estado}`}>{c}</option>
              ))}
            </select>
          )}
          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      </div>
    </div>
  )
}
