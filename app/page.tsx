// app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getRecentStamps, getMostWantedStamps } from '@/lib/queries/stamps'
import { getTopUsers, type TopUser } from '@/lib/queries/profiles'
import { Avatar } from '@/components/ui/Avatar'

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

const FIFA_NEWS = [
  {
    emoji: '🏟️',
    tag: 'Sedes',
    title: 'México, EE.UU. y Canadá listos para el Mundial 2026',
    desc: 'El torneo se disputará en 16 ciudades anfitrionas con 104 partidos en total, el más grande en la historia de la Copa del Mundo.',
    date: 'FIFA 2026',
  },
  {
    emoji: '⚽',
    tag: 'Álbum Panini',
    title: 'El álbum oficial Panini FIFA 2026 ya está disponible',
    desc: '670 estampas para coleccionar, incluyendo versiones especiales ultra raras y estampas brillantes de las estrellas del torneo.',
    date: 'Panini Group',
  },
  {
    emoji: '🇲🇽',
    tag: 'El Tri',
    title: 'México debuta en el Estadio Azteca el 11 de junio',
    desc: 'El Estadio Azteca será una de las sedes históricas del torneo. México jugará su grupo en casa ante la afición.',
    date: 'FEMEXFUT',
  },
  {
    emoji: '🌟',
    tag: 'Estrellas',
    title: 'Las estampas más raras del álbum FIFA 2026',
    desc: 'Mbappé, Vinicius Jr., Pedri y Lamine Yamal encabezan la lista de estampas "Ultra" más difíciles de conseguir.',
    date: 'StampSwap',
  },
]

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const recent = await getRecentStamps(12)
  const mostWanted = await getMostWantedStamps(10)
  const topUsers = await getTopUsers(8)

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

      {/* Carousel de estampas recientes */}
      <section id="estampas" className="py-12">
        <div className="px-5 max-w-2xl mx-auto mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Estampas recientes</h2>
          <span className="text-muted text-sm">{user ? '' : 'Regístrate para ver quién las tiene'}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 snap-x snap-mandatory"
          style={{scrollbarWidth:'none'}}>
          {recent.map((s, i) => (
            <div key={s.id} className="snap-start flex-shrink-0 w-44 bg-card border border-border rounded-xl p-3">
              <div className="w-full h-28 bg-base rounded-lg mb-3 flex items-center justify-center text-4xl">
                ⚽
              </div>
              <div className="text-xs font-bold text-foreground truncate">#{s.number} {s.player_name}</div>
              <div className="text-xs text-muted mt-0.5">{s.country}</div>
              <div className={`mt-2 text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${
                s.type === 'have' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'
              }`}>
                {s.type === 'have' ? 'Disponible' : 'Buscada'}
              </div>
              {!user && i >= 3 && (
                <div className="mt-2 text-xs text-muted">🔒 Regístrate</div>
              )}
              {user && (s as { profiles?: { username: string; city: string } | null }).profiles && (
                <div className="mt-2 text-xs text-muted truncate">@{(s as { profiles?: { username: string; city: string } | null }).profiles!.username}</div>
              )}
            </div>
          ))}
          {!user && (
            <div className="snap-start flex-shrink-0 w-44 bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col items-center justify-center gap-2">
              <div className="text-2xl">🔓</div>
              <p className="text-xs text-center text-foreground font-semibold">Ver todas las estampas</p>
              <Link href="/register" className="bg-gradient-to-r from-primary-dark to-primary text-xs font-bold px-3 py-1.5 rounded-full" style={{color:'#0f1923'}}>
                Crear cuenta
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Estampas más buscadas */}
      <section className="px-5 py-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">🔥 Estampas más buscadas</h2>
        <p className="text-muted text-sm mb-6">Las que más usuarios necesitan completar</p>
        {mostWanted.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted text-sm">
            Aún no hay datos. ¡Sé el primero en publicar tu wishlist!
          </div>
        ) : (
          <div className="space-y-2">
            {mostWanted.map((stamp, i) => (
              <div key={stamp.number} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-muted/30 text-foreground' : i === 2 ? 'bg-amber-200 text-foreground' : 'bg-base text-muted'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-semibold text-sm truncate">#{stamp.number} {stamp.player_name}</div>
                  <div className="text-muted text-xs">{stamp.country} · {stamp.rarity}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-primary font-bold text-sm">{stamp.count}</div>
                  <div className="text-muted text-xs">buscan</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Noticias FIFA 2026 */}
      <section className="px-5 py-12 bg-card/50 border-y border-border">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">📰 Noticias FIFA 2026</h2>
          <p className="text-muted text-sm mb-6">Lo último del Mundial</p>
          <div className="grid grid-cols-1 gap-4">
            {FIFA_NEWS.map((news, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {news.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{news.tag}</span>
                    <span className="text-xs text-muted">{news.date}</span>
                  </div>
                  <div className="text-foreground font-bold text-sm leading-snug mb-1">{news.title}</div>
                  <div className="text-muted text-xs leading-relaxed">{news.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seguridad */}
      <section className="px-5 py-12 bg-card/50 border-b border-border">
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

      {/* Ranking de usuarios */}
      <section className="px-5 py-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">🏆 Top coleccionistas</h2>
        <p className="text-muted text-sm mb-6">Los usuarios con más intercambios completados</p>
        {topUsers.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted text-sm">
            ¡Sé el primero en completar un intercambio y aparecer aquí!
          </div>
        ) : (
          <div className="space-y-2">
            {(topUsers as TopUser[]).map((u, i) => (
              <div key={u.id} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-muted/30 text-foreground' : i === 2 ? 'bg-amber-200 text-foreground' : 'bg-base text-muted'
                }`}>
                  {i + 1}
                </div>
                <Avatar src={u.avatar_url} name={u.username ?? ''} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-foreground font-semibold text-sm">@{u.username}</div>
                  <div className="text-muted text-xs">⭐ {Number(u.reputation_score || 0).toFixed(1)}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="text-primary font-bold text-sm">{u.trades_count ?? 0}</div>
                  <div className="text-muted text-xs">trades</div>
                </div>
              </div>
            ))}
          </div>
        )}
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
