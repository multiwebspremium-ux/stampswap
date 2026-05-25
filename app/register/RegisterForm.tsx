'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { MEXICO_STATES } from '@/lib/data/mexico-locations'

export function RegisterForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [estado, setEstado] = useState('')
  const [form, setForm] = useState({
    full_name: '', username: '', email: '', city: '', password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.username.length < 3) { setError('El usuario debe tener al menos 3 caracteres'); return }
    if (!/^[a-z0-9_]+$/.test(form.username)) { setError('Solo letras minúsculas, números y _'); return }

    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { username: form.username.toLowerCase(), full_name: form.full_name, city: form.city },
        emailRedirectTo: `${window.location.origin}/app`,
      },
    })
    setLoading(false)

    if (signUpError) { setError(signUpError.message); return }
    if (data.session) {
      router.push('/app')
    } else {
      router.push('/verify-email')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      <input name="full_name" placeholder="Nombre completo" required value={form.full_name}
        onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />
      <input name="username" placeholder="Usuario (ej: carlos_mx)" required value={form.username}
        onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors lowercase" />
      <input name="email" type="email" placeholder="Email" required value={form.email}
        onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />
      <select
        value={estado}
        onChange={e => { setEstado(e.target.value); setForm(f => ({ ...f, city: '' })) }}
        required
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary transition-colors">
        <option value="">Selecciona tu estado</option>
        {MEXICO_STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
      </select>

      {estado && (
        <select
          name="city"
          required
          value={form.city}
          onChange={handleChange}
          className="bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary transition-colors">
          <option value="">Selecciona tu ciudad</option>
          {MEXICO_STATES.find(s => s.name === estado)?.cities.map(c => (
            <option key={c} value={`${c}, ${estado}`}>{c}</option>
          ))}
        </select>
      )}
      <input name="password" type="password" placeholder="Contraseña (mín. 8 caracteres)" required minLength={8}
        value={form.password} onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />
      <Button type="submit" disabled={loading} size="lg" className="w-full mt-2">
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
