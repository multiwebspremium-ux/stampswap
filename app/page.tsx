// app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRecentStamps } from '@/lib/queries/stamps'
import { StampCard } from '@/components/ui/StampCard'

const STEPS = [
  { icon: '📝', title: 'Regístrate gratis', desc: 'Crea tu cuenta en menos de 2 minutos' },
  { icon: '📦', title: 'Sube tus repetidas', desc: 'Publica las estampas que te sobran' },
  { icon: '❤️', title: 'Agrega las que te faltan', desc: 'Crea tu wishlist personal' },
  { icon: '🔥', title: 'Encuentra coincidencias', desc: 'El sistema te conecta automáticamente' },
  { icon: '🤝', title: 'Intercambia seguro', desc: 'Chatea y coordina en un lugar público' },
]

const SAFETY = [
  'Usuarios con email verificado',
  'Chat privado dentro de la plataforma',
  'Recomendamos reunirse en plazas o centros comerciales',
  'Sistema de reputación y calificaciones',
  'Reporta actividad sospechosa fácilmente',
  'Nunca compartas datos bancarios',
]

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const recent = await getRecentStamps(8)

  return (
    <div className="min-h-screen bg-base text-foreground">
      {/* Header mínimo */}
      <header className="px-5 py-4 flex items-center justify-between max-w-2xl mx-auto">
        <span className="text-primary font-extrabold text-xl">⚽ StampSwap</span>
        <div className="flex gap-2">
          <Link href="/login" className="border border-border text-foreground text-sm px-4 py-1.5 rounded-full hover:border-primary/40 transition-colors">Entrar</Link>
          <Link href="/register"
            className="bg-gradient-to-r from-primary-dark to-primary font-bold text-sm px-4 py-1.5 rounded-full hover:brightness-110 transition-all"
            style={{color:'#0f1923'}}>
            Registro
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pt-10 pb-14 text-center max-w-lg mx-auto">
        <div className="inline-block bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-5">
          ⚡ FIFA WORLD CUP 2026
        </div>
        <h1 className="text-3xl font-extrabold leading-tight mb-4">
          Completa tu álbum intercambiando con fans de todo México
        </h1>
        <p className="text-muted text-base leading-relaxed mb-8">
          Publica tus repetidas, registra las que te faltan y encuentra coincidencias automáticamente.
        </p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link href="/register"
            className="bg-gradient-to-r from-primary-dark to-primary font-bold py-4 rounded-full text-center text-lg shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:brightness-110 transition-all"
            style={{color:'#0f1923'}}>
            Crear cuenta gratis
          </Link>
          <Link href="#estampas"
            className="border border-border text-foreground font-semibold py-3.5 rounded-full text-center text-sm hover:border-primary/40 transition-colors">
            Ver estampas disponibles
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="px-5 py-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">¿Cómo funciona?</h2>
        <div className="space-y-4">
          {STEPS.map((step, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center">
              <span className="text-3xl">{step.icon}</span>
              <div>
                <div className="text-foreground font-bold text-sm">{step.title}</div>
                <div className="text-muted text-xs mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Últimas estampas — con blur si no loggeado */}
      <section id="estampas" className="px-5 py-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">Últimas estampas publicadas</h2>
        <p className="text-muted text-sm text-center mb-6">
          {user ? 'Haz clic en cualquiera para ver más detalles' : 'Regístrate para ver quién las tiene'}
        </p>
        <div className="space-y-2">
          {recent.map((s, i) => (
            <StampCard key={s.id} stamp={s}
              showOwner={!!user}
              hideOwner={!user && i >= 3}
            />
          ))}
        </div>
        {!user && (
          <div className="mt-6 text-center">
            <Link href="/register"
              className="inline-block bg-gradient-to-r from-primary-dark to-primary font-bold px-6 py-3 rounded-full text-sm shadow-lg hover:brightness-110 transition-all"
              style={{color:'#0f1923'}}>
              Ver todas → Crear cuenta
            </Link>
          </div>
        )}
      </section>

      {/* Seguridad */}
      <section className="px-5 py-12 bg-card/50 border-y border-border">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">Tu seguridad es prioridad</h2>
          <div className="grid grid-cols-1 gap-2">
            {SAFETY.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <span className="text-primary text-lg">✅</span>
                <span className="text-foreground text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 py-12 max-w-2xl mx-auto text-center">
        <div className="grid grid-cols-3 gap-4">
          {[
            { n: '3,200+', label: 'Estampas intercambiadas' },
            { n: '840+',   label: 'Usuarios registrados' },
            { n: '1,200+', label: 'Matches exitosos' },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="text-primary font-extrabold text-xl">{stat.n}</div>
              <div className="text-muted text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="px-5 py-14 text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-4">¿Listo para completar tu álbum?</h2>
        <Link href="/register"
          className="inline-block bg-gradient-to-r from-primary-dark to-primary font-extrabold px-8 py-4 rounded-full text-lg shadow-[0_0_24px_rgba(52,211,153,0.3)] hover:brightness-110 transition-all"
          style={{color:'#0f1923'}}>
          Empieza gratis ahora
        </Link>
      </section>

      <footer className="px-5 py-6 border-t border-border text-center text-muted text-xs">
        StampSwap · FIFA 2026 · Intercambia seguro ⚽
      </footer>
    </div>
  )
}
