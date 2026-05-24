# StampSwap MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir StampSwap, PWA mobile-first de intercambio de estampas del Mundial FIFA 2026, con auth, inventario, matches automáticos y chat en tiempo real.

**Architecture:** Next.js 14 App Router + TailwindCSS + TypeScript en Vercel. Supabase como backend completo (PostgreSQL + RLS + Auth + Realtime + Storage). Sin servidor propio.

**Tech Stack:** Next.js 14, TypeScript, TailwindCSS, @supabase/ssr, @supabase/supabase-js

---

## Estructura de archivos

```
intercambiaestampas/
├── app/
│   ├── layout.tsx                    # Root layout + fonts
│   ├── page.tsx                      # Landing pública
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── verify-email/page.tsx
│   └── app/
│       ├── layout.tsx                # AppShell (header + bottom nav)
│       ├── page.tsx                  # Home
│       ├── search/page.tsx
│       ├── matches/page.tsx
│       ├── publish/page.tsx
│       ├── chats/page.tsx
│       ├── chats/[id]/page.tsx
│       ├── profile/page.tsx
│       └── profile/[username]/page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Toggle.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── StampCard.tsx
│   │   └── MatchCard.tsx
│   └── layout/
│       ├── Header.tsx
│       └── BottomNav.tsx
├── lib/
│   ├── supabase/client.ts            # Browser Supabase client
│   ├── supabase/server.ts            # Server Supabase client
│   ├── queries/stamps.ts
│   ├── queries/matches.ts
│   ├── queries/chats.ts
│   └── queries/profiles.ts
├── middleware.ts                      # Auth guard /app/*
├── types/database.ts                  # Tipos DB
├── supabase/migrations/001_schema.sql
└── public/manifest.json
```

---

## Task 1: Scaffold del proyecto

**Files:**
- Create: `package.json`, `tailwind.config.ts`, `tsconfig.json` (auto-generados)

- [ ] **Inicializar Next.js**

```bash
cd "C:/Users/Lgtz2/Documents/intercambiaestampas"
npx create-next-app@latest . --typescript --tailwind --app --src-dir=no --import-alias="@/*" --no-eslint
```

Cuando pregunte "Would you like to use Turbopack?" → **No** (compatibilidad).

- [ ] **Instalar dependencias**

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @supabase/auth-helpers-nextjs
```

- [ ] **Verificar que arranca**

```bash
npm run dev
```

Esperado: `http://localhost:3000` carga la página default de Next.js.

- [ ] **Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js + Supabase deps"
```

---

## Task 2: Variables de entorno + Supabase project

**Files:**
- Create: `.env.local`
- Create: `.env.local.example`

- [ ] **Crear proyecto en Supabase**

Ve a https://supabase.com → New project → nombre: `stampswap` → región: `us-east-1` → anota `Project URL` y `anon key`.

- [ ] **Crear `.env.local`**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://TUPROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

- [ ] **Crear `.env.local.example`** (para git)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://TUPROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

- [ ] **Agregar `.env.local` al .gitignore**

Verificar que `.gitignore` ya contiene `.env.local` (create-next-app lo agrega automáticamente).

- [ ] **Commit**

```bash
git add .env.local.example .gitignore
git commit -m "chore: env setup + supabase project"
```

---

## Task 3: Design tokens en Tailwind

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Configurar paleta en tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0f1923',
        card: '#1a2535',
        border: '#263547',
        primary: '#34d399',
        'primary-dark': '#059669',
        muted: '#64748b',
        foreground: '#e2e8f0',
        amber: '#fbbf24',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Configurar globals.css**

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-base text-foreground font-sans;
  }
  * {
    @apply border-border;
  }
}
```

- [ ] **Verificar colores en dev**

```bash
npm run dev
```

Esperado: fondo oscuro `#0f1923` en la página.

- [ ] **Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "chore: design tokens tailwind"
```

---

## Task 4: Componentes UI base

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Toggle.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Avatar.tsx`

- [ ] **Button.tsx — pill con variantes y estados**

```tsx
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'amber'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  pill?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-primary-dark to-primary text-base font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)] hover:brightness-110 active:brightness-90 active:scale-[0.98]',
  outline:
    'bg-transparent border border-primary text-primary hover:bg-primary/10 active:bg-primary/20',
  ghost:
    'bg-card border border-border text-muted hover:text-foreground hover:border-primary/40 active:bg-border',
  danger:
    'bg-danger/10 border border-danger text-danger hover:bg-danger/20 active:bg-danger/30',
  amber:
    'bg-amber/10 border border-amber text-amber hover:bg-amber/20 active:bg-amber/30',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', pill = true, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        pill ? 'rounded-full' : 'rounded-[10px]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
Button.displayName = 'Button'
```

- [ ] **Toggle.tsx**

```tsx
// components/ui/Toggle.tsx
'use client'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label?: string
  className?: string
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <label className={cn('flex items-center gap-2 cursor-pointer select-none', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-11 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-border'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      {label && <span className="text-sm text-foreground">{label}</span>}
    </label>
  )
}
```

- [ ] **Badge.tsx**

```tsx
// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

type BadgeVariant = 'have' | 'want' | 'match' | 'verified' | 'rarity'

const badgeStyles: Record<BadgeVariant, string> = {
  have: 'bg-primary/15 text-primary border border-primary/25',
  want: 'bg-amber/15 text-amber border border-amber/25',
  match: 'bg-primary/20 text-primary border border-primary/40 font-bold',
  verified: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  rarity: 'bg-card text-muted border border-border',
}

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', badgeStyles[variant], className)}>
      {children}
    </span>
  )
}
```

- [ ] **Avatar.tsx**

```tsx
// components/ui/Avatar.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string | null
  name: string
  size?: number
  className?: string
}) {
  const initials = name.slice(0, 2).toUpperCase()
  return src ? (
    <Image
      src={src}
      alt={name}
      width={size}
      height={size}
      className={cn('rounded-full object-cover', className)}
      style={{ width: size, height: size }}
    />
  ) : (
    <div
      className={cn(
        'rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm',
        className
      )}
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  )
}
```

- [ ] **Crear lib/utils.ts**

```ts
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```bash
npm install clsx tailwind-merge
```

- [ ] **Commit**

```bash
git add components/ lib/utils.ts
git commit -m "feat: UI base components (Button, Toggle, Badge, Avatar)"
```

---

## Task 5: Migración de base de datos

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Crear el archivo de migración**

```sql
-- supabase/migrations/001_schema.sql

-- PROFILES (extiende auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  city text NOT NULL,
  avatar_url text,
  verified boolean DEFAULT false,
  reputation_score numeric(3,2) DEFAULT 0,
  trades_count integer DEFAULT 0,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- STAMPS
CREATE TABLE stamps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  number integer NOT NULL,
  player_name text NOT NULL,
  country text NOT NULL,
  rarity text NOT NULL CHECK (rarity IN ('common','rare','star','ultra')),
  quantity integer DEFAULT 1,
  type text NOT NULL CHECK (type IN ('have','want')),
  image_url text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX stamps_owner_idx ON stamps(owner_id);
CREATE INDEX stamps_number_idx ON stamps(number);

-- MATCHES
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stamp_a_id uuid NOT NULL REFERENCES stamps(id) ON DELETE CASCADE,
  stamp_b_id uuid NOT NULL REFERENCES stamps(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','completed','cancelled')),
  created_at timestamptz DEFAULT now()
);

-- CHATS
CREATE TABLE chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_a_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- MESSAGES
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  CHECK (content IS NOT NULL OR image_url IS NOT NULL)
);
CREATE INDEX messages_chat_idx ON messages(chat_id, created_at);

-- RATINGS
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  rater_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rated_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(match_id, rater_id)
);

-- REPORTS
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- BLOCKS
CREATE TABLE blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- AUTO-CREAR PROFILE AL REGISTRARSE
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name, city)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'city'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ACTUALIZAR reputation_score TRAS RATING
CREATE OR REPLACE FUNCTION update_reputation()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET reputation_score = (
    SELECT ROUND(AVG(score)::numeric, 2)
    FROM ratings
    WHERE rated_id = NEW.rated_id
  )
  WHERE id = NEW.rated_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_rating_created
  AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_reputation();
```

- [ ] **Ejecutar en Supabase SQL Editor**

Ve a Supabase Dashboard → SQL Editor → pega el contenido del archivo → Run.

Esperado: todas las tablas creadas sin errores.

- [ ] **Commit**

```bash
git add supabase/
git commit -m "feat: database schema inicial"
```

---

## Task 6: RLS Policies

**Files:**
- Create: `supabase/migrations/002_rls.sql`

- [ ] **Crear políticas RLS**

```sql
-- supabase/migrations/002_rls.sql

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles públicos para lectura" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuario edita su propio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- STAMPS
CREATE POLICY "Stamps públicos para lectura" ON stamps FOR SELECT USING (true);
CREATE POLICY "Usuario crea sus stamps" ON stamps FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Usuario edita sus stamps" ON stamps FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Usuario borra sus stamps" ON stamps FOR DELETE USING (auth.uid() = owner_id);

-- MATCHES
CREATE POLICY "Usuario ve sus matches" ON matches FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "Sistema crea matches (insert libre autenticado)" ON matches FOR INSERT
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "Participantes actualizan status" ON matches FOR UPDATE
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- CHATS
CREATE POLICY "Participantes ven su chat" ON chats FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "Sistema crea chats" ON chats FOR INSERT
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- MESSAGES
CREATE POLICY "Participantes ven mensajes" ON messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_a_id FROM chats WHERE id = chat_id
      UNION
      SELECT user_b_id FROM chats WHERE id = chat_id
    )
  );
CREATE POLICY "Participantes envían mensajes" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- RATINGS
CREATE POLICY "Ratings públicos" ON ratings FOR SELECT USING (true);
CREATE POLICY "Usuario califica una vez por match" ON ratings FOR INSERT
  WITH CHECK (auth.uid() = rater_id);

-- REPORTS
CREATE POLICY "Usuario reporta" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- BLOCKS
CREATE POLICY "Usuario ve sus bloqueos" ON blocks FOR SELECT
  USING (auth.uid() = blocker_id);
CREATE POLICY "Usuario bloquea" ON blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Usuario desbloquea" ON blocks FOR DELETE USING (auth.uid() = blocker_id);
```

- [ ] **Ejecutar en Supabase SQL Editor**

Pega y ejecuta `002_rls.sql`. Esperado: sin errores.

- [ ] **Commit**

```bash
git add supabase/migrations/002_rls.sql
git commit -m "feat: RLS policies todas las tablas"
```

---

## Task 7: Supabase client + tipos

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `types/database.ts`
- Create: `middleware.ts`

- [ ] **lib/supabase/client.ts** (uso en Client Components)

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **lib/supabase/server.ts** (uso en Server Components y Server Actions)

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **middleware.ts** (auth guard)

```ts
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/app/:path*', '/login', '/register'],
}
```

- [ ] **types/database.ts** — tipos manuales (sin CLI Supabase)

```ts
// types/database.ts
export type Rarity = 'common' | 'rare' | 'star' | 'ultra'
export type StampType = 'have' | 'want'
export type MatchStatus = 'pending' | 'accepted' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  username: string
  full_name: string
  city: string
  avatar_url: string | null
  verified: boolean
  reputation_score: number
  trades_count: number
  last_seen: string
  created_at: string
}

export interface Stamp {
  id: string
  owner_id: string
  number: number
  player_name: string
  country: string
  rarity: Rarity
  quantity: number
  type: StampType
  image_url: string | null
  created_at: string
}

export interface Match {
  id: string
  user_a_id: string
  user_b_id: string
  stamp_a_id: string
  stamp_b_id: string
  status: MatchStatus
  created_at: string
}

export interface Chat {
  id: string
  match_id: string
  user_a_id: string
  user_b_id: string
  created_at: string
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string | null
  image_url: string | null
  created_at: string
}

export interface Rating {
  id: string
  match_id: string
  rater_id: string
  rated_id: string
  score: number
  comment: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile,'created_at'|'reputation_score'|'trades_count'|'verified'>; Update: Partial<Profile> }
      stamps: { Row: Stamp; Insert: Omit<Stamp,'id'|'created_at'>; Update: Partial<Stamp> }
      matches: { Row: Match; Insert: Omit<Match,'id'|'created_at'|'status'>; Update: Partial<Match> }
      chats: { Row: Chat; Insert: Omit<Chat,'id'|'created_at'>; Update: Partial<Chat> }
      messages: { Row: Message; Insert: Omit<Message,'id'|'created_at'>; Update: Partial<Message> }
      ratings: { Row: Rating; Insert: Omit<Rating,'id'|'created_at'>; Update: Partial<Rating> }
    }
  }
}
```

- [ ] **Verificar que TypeScript compila**

```bash
npx tsc --noEmit
```

Esperado: sin errores.

- [ ] **Commit**

```bash
git add lib/ middleware.ts types/
git commit -m "feat: supabase clients + middleware auth guard + types"
```

---

## Task 8: Register page

**Files:**
- Create: `app/register/page.tsx`
- Create: `app/register/RegisterForm.tsx`

- [ ] **app/register/RegisterForm.tsx**

```tsx
// app/register/RegisterForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

const CITIES = ['Ciudad de México','Guadalajara','Monterrey','Puebla','Tijuana','Mérida','León','Querétaro','San Luis Potosí','Otra']

export function RegisterForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { username: form.username.toLowerCase(), full_name: form.full_name, city: form.city },
        emailRedirectTo: `${window.location.origin}/app`,
      },
    })
    setLoading(false)

    if (signUpError) { setError(signUpError.message); return }
    router.push('/verify-email')
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
      <select name="city" required value={form.city} onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground outline-none focus:border-primary transition-colors">
        <option value="">Selecciona tu ciudad</option>
        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <input name="password" type="password" placeholder="Contraseña (mín. 8 caracteres)" required minLength={8}
        value={form.password} onChange={handleChange}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />
      <Button type="submit" disabled={loading} size="lg" className="w-full mt-2">
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </Button>
    </form>
  )
}
```

- [ ] **app/register/page.tsx**

```tsx
// app/register/page.tsx
import Link from 'next/link'
import { RegisterForm } from './RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col justify-center px-5 py-12">
      <div className="max-w-sm w-full mx-auto">
        <div className="text-center mb-8">
          <span className="text-4xl">⚽</span>
          <h1 className="text-2xl font-bold text-foreground mt-2">Únete a StampSwap</h1>
          <p className="text-muted text-sm mt-1">Completa tu álbum FIFA 2026</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <RegisterForm />
        </div>
        <p className="text-center text-muted text-sm mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Verificar en browser: `http://localhost:3000/register`**

Esperado: formulario oscuro con inputs y botón verde pill.

- [ ] **Commit**

```bash
git add app/register/
git commit -m "feat: register page con Supabase auth"
```

---

## Task 9: Verify email + Login pages

**Files:**
- Create: `app/verify-email/page.tsx`
- Create: `app/login/page.tsx`
- Create: `app/login/LoginForm.tsx`

- [ ] **app/verify-email/page.tsx**

```tsx
// app/verify-email/page.tsx
import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center px-5 text-center">
      <div className="max-w-sm w-full">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Revisa tu email</h1>
        <p className="text-muted text-sm leading-relaxed mb-6">
          Te enviamos un link de confirmación. Haz clic en él para activar tu cuenta y empezar a intercambiar.
        </p>
        <div className="bg-card border border-border rounded-2xl p-4 mb-6 text-left">
          <p className="text-xs text-muted">
            ¿No llegó el email? Revisa tu carpeta de spam. El link expira en 24 horas.
          </p>
        </div>
        <Link href="/login" className="text-primary hover:underline text-sm">
          Ya confirmé → Iniciar sesión
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **app/login/LoginForm.tsx**

```tsx
// app/login/LoginForm.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (loginError) { setError('Email o contraseña incorrectos'); return }
    router.push('/app')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}
      <input type="email" placeholder="Email" required value={email}
        onChange={e => setEmail(e.target.value)}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />
      <input type="password" placeholder="Contraseña" required value={password}
        onChange={e => setPassword(e.target.value)}
        className="bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors" />
      <Button type="submit" disabled={loading} size="lg" className="w-full mt-2">
        {loading ? 'Entrando...' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
```

- [ ] **app/login/page.tsx**

```tsx
// app/login/page.tsx
import Link from 'next/link'
import { LoginForm } from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-base flex flex-col justify-center px-5 py-12">
      <div className="max-w-sm w-full mx-auto">
        <div className="text-center mb-8">
          <span className="text-4xl">⚽</span>
          <h1 className="text-2xl font-bold text-foreground mt-2">Bienvenido de vuelta</h1>
          <p className="text-muted text-sm mt-1">StampSwap FIFA 2026</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <LoginForm />
        </div>
        <p className="text-center text-muted text-sm mt-6">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-primary hover:underline font-medium">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Probar flujo completo en browser**

1. Ve a `http://localhost:3000/register` → crea una cuenta
2. Verifica que redirige a `/verify-email`
3. Confirma el email desde tu bandeja
4. Ve a `/login` → inicia sesión
5. Verifica que redirige a `/app` (dará 404 por ahora, es normal)

- [ ] **Commit**

```bash
git add app/verify-email/ app/login/
git commit -m "feat: login + verify-email pages"
```

---

## Task 10: App layout (Header + BottomNav)

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/BottomNav.tsx`
- Create: `app/app/layout.tsx`

- [ ] **components/layout/Header.tsx**

```tsx
// components/layout/Header.tsx
'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function Header() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1218] border-b border-border h-14 flex items-center justify-between px-4 max-w-lg mx-auto">
      <Link href="/app" className="text-primary font-extrabold text-lg tracking-tight">
        ⚽ StampSwap
      </Link>
      <div className="flex items-center gap-2">
        <Link
          href="/app/publish"
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-dark to-primary flex items-center justify-center text-base shadow-[0_0_10px_rgba(52,211,153,0.35)] hover:brightness-110 transition-all"
          title="Publicar estampa"
        >
          <span className="text-base font-black text-base-content leading-none" style={{color:'#0f1923'}}>＋</span>
        </Link>
        <button
          className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center relative hover:border-primary/40 transition-colors"
          title="Notificaciones"
        >
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full border border-[#0a1218]" />
        </button>
      </div>
    </header>
  )
}
```

- [ ] **components/layout/BottomNav.tsx**

```tsx
// components/layout/BottomNav.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/app',         icon: '🏠', label: 'Inicio' },
  { href: '/app/search',  icon: '🔍', label: 'Buscar' },
  { href: '/app/matches', icon: '🔥', label: 'Matches' },
  { href: '/app/chats',   icon: '💬', label: 'Chats' },
  { href: '/app/profile', icon: '👤', label: 'Perfil' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a1218] border-t border-border h-16 flex items-stretch max-w-lg mx-auto">
      {tabs.map(tab => {
        const active = pathname === tab.href || (tab.href !== '/app' && pathname.startsWith(tab.href))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
              active ? 'text-primary' : 'text-muted hover:text-foreground'
            )}
          >
            <span className={cn('text-xl leading-none', active && 'drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]')}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **app/app/layout.tsx**

```tsx
// app/app/layout.tsx
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
```

- [ ] **app/app/page.tsx** (placeholder temporal)

```tsx
// app/app/page.tsx
export default function HomePage() {
  return (
    <div className="p-4 text-foreground">
      <h1 className="text-xl font-bold">Inicio</h1>
      <p className="text-muted text-sm mt-1">Próximamente: matches y estampas recientes</p>
    </div>
  )
}
```

- [ ] **Verificar layout en browser**

Inicia sesión → navega a `/app`. Deberías ver el header verde + bottom nav con 5 tabs. Toca cada tab para verificar el estado activo.

- [ ] **Commit**

```bash
git add components/layout/ app/app/
git commit -m "feat: app layout con Header y BottomNav"
```

---

## Task 11: Queries de base de datos

**Files:**
- Create: `lib/queries/stamps.ts`
- Create: `lib/queries/matches.ts`
- Create: `lib/queries/profiles.ts`
- Create: `lib/queries/chats.ts`

- [ ] **lib/queries/stamps.ts**

```ts
// lib/queries/stamps.ts
import { createClient } from '@/lib/supabase/server'
import type { Stamp, StampType } from '@/types/database'

export async function getMyStamps(userId: string): Promise<Stamp[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stamps')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getRecentStamps(limit = 12): Promise<(Stamp & { profiles: { username: string; city: string } | null })[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('stamps')
    .select('*, profiles(username, city)')
    .eq('type', 'have')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as any
}

export async function searchStamps(params: {
  query?: string
  country?: string
  rarity?: string
  type?: StampType
  city?: string
  limit?: number
}): Promise<(Stamp & { profiles: { username: string; city: string; avatar_url: string | null; reputation_score: number } | null })[]> {
  const supabase = await createClient()
  let q = supabase
    .from('stamps')
    .select('*, profiles(username, city, avatar_url, reputation_score)')
    .order('created_at', { ascending: false })
    .limit(params.limit ?? 30)

  if (params.query) q = q.or(`player_name.ilike.%${params.query}%,country.ilike.%${params.query}%`)
  if (params.country) q = q.eq('country', params.country)
  if (params.rarity) q = q.eq('rarity', params.rarity)
  if (params.type) q = q.eq('type', params.type)

  const { data, error } = await q
  if (error) throw error
  return (data ?? []) as any
}

export async function createStamp(stamp: Omit<Stamp, 'id' | 'created_at'>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('stamps').insert(stamp).select().single()
  if (error) throw error
  return data
}

export async function deleteStamp(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('stamps').delete().eq('id', id)
  if (error) throw error
}
```

- [ ] **lib/queries/matches.ts**

```ts
// lib/queries/matches.ts
import { createClient } from '@/lib/supabase/server'

export async function getMyMatches(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_matches_for_user', { p_user_id: userId })
  if (error) {
    // Fallback: query directa si RPC no existe
    const { data: stamps } = await supabase
      .from('stamps')
      .select('number')
      .eq('owner_id', userId)
      .eq('type', 'want')

    const wantedNumbers = (stamps ?? []).map(s => s.number)
    if (!wantedNumbers.length) return []

    const { data: matchStamps, error: e2 } = await supabase
      .from('stamps')
      .select('*, profiles(id, username, city, avatar_url, reputation_score)')
      .eq('type', 'have')
      .in('number', wantedNumbers)
      .neq('owner_id', userId)
      .order('created_at', { ascending: false })

    if (e2) throw e2
    return (matchStamps ?? []) as any[]
  }
  return data ?? []
}

export async function createMatchAndChat(params: {
  userAId: string
  userBId: string
  stampAId: string
  stampBId: string
}) {
  const supabase = await createClient()
  const { data: match, error: me } = await supabase
    .from('matches')
    .insert({ user_a_id: params.userAId, user_b_id: params.userBId, stamp_a_id: params.stampAId, stamp_b_id: params.stampBId })
    .select()
    .single()
  if (me) throw me

  const { data: chat, error: ce } = await supabase
    .from('chats')
    .insert({ match_id: match.id, user_a_id: params.userAId, user_b_id: params.userBId })
    .select()
    .single()
  if (ce) throw ce
  return { match, chat }
}

export async function completeMatch(matchId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('matches')
    .update({ status: 'completed' })
    .eq('id', matchId)
  if (error) throw error
}
```

- [ ] **lib/queries/profiles.ts**

```ts
// lib/queries/profiles.ts
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('username', username).single()
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
  if (error) throw error
}
```

- [ ] **lib/queries/chats.ts**

```ts
// lib/queries/chats.ts
import { createClient } from '@/lib/supabase/server'
import type { Message } from '@/types/database'

export async function getMyChats(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('chats')
    .select(`
      *,
      matches(status, stamp_a_id, stamp_b_id),
      user_a: profiles!chats_user_a_id_fkey(id, username, avatar_url),
      user_b: profiles!chats_user_b_id_fkey(id, username, avatar_url)
    `)
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as any[]
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function sendMessage(msg: { chat_id: string; sender_id: string; content?: string; image_url?: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('messages').insert(msg).select().single()
  if (error) throw error
  return data
}
```

- [ ] **Commit**

```bash
git add lib/queries/
git commit -m "feat: queries stamps, matches, profiles, chats"
```

---

## Task 12: Publicar estampa

**Files:**
- Create: `app/app/publish/page.tsx`
- Create: `app/app/publish/PublishForm.tsx`

- [ ] **app/app/publish/PublishForm.tsx**

```tsx
// app/app/publish/PublishForm.tsx
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
    const { error: insertError } = await supabase.from('stamps').insert({
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
      {/* Tipo */}
      <div className="grid grid-cols-2 gap-2">
        {(['have','want'] as StampType[]).map(t => (
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
```

- [ ] **app/app/publish/page.tsx**

```tsx
// app/app/publish/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PublishForm } from './PublishForm'

export default async function PublishPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-foreground mb-1">Publicar estampa</h1>
      <p className="text-muted text-sm mb-6">Agrega una repetida o una que te falta</p>
      <div className="bg-card border border-border rounded-2xl p-5">
        <PublishForm userId={user.id} />
      </div>
    </div>
  )
}
```

- [ ] **Probar publicar estampa en browser**

1. Inicia sesión → toca el botón ➕ del header
2. Completa el formulario → "Tengo" → número + jugador + país + rareza
3. Verifica que redirige a `/app/profile`

- [ ] **Commit**

```bash
git add app/app/publish/
git commit -m "feat: publicar estampa (have/want)"
```

---

## Task 13: StampCard + MatchCard components

**Files:**
- Create: `components/ui/StampCard.tsx`
- Create: `components/ui/MatchCard.tsx`

- [ ] **components/ui/StampCard.tsx**

```tsx
// components/ui/StampCard.tsx
import Image from 'next/image'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'
import type { Stamp } from '@/types/database'

const rarityLabel: Record<string, string> = {
  common: '⚪ Común', rare: '🔵 Rara', star: '⭐ Estrella', ultra: '💎 Ultra'
}

interface StampCardProps {
  stamp: Stamp & { profiles?: { username: string; city: string } | null }
  showOwner?: boolean
  hideOwner?: boolean
  className?: string
  onClick?: () => void
}

export function StampCard({ stamp, showOwner, hideOwner, className, onClick }: StampCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-xl p-3 flex gap-3 items-center',
        onClick && 'cursor-pointer hover:border-primary/40 transition-colors active:bg-border/30',
        className
      )}
    >
      {stamp.image_url ? (
        <Image src={stamp.image_url} alt={stamp.player_name} width={44} height={56}
          className="rounded-lg object-cover w-11 h-14 flex-shrink-0" />
      ) : (
        <div className="w-11 h-14 rounded-lg bg-gradient-to-b from-primary-dark/60 to-primary/40 flex items-center justify-center text-xl flex-shrink-0">
          ⚽
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-foreground text-sm font-bold truncate">{stamp.player_name}</div>
        <div className="text-muted text-xs mt-0.5">{stamp.country} · #{stamp.number}</div>
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          <Badge variant={stamp.type === 'have' ? 'have' : 'want'}>
            {stamp.type === 'have' ? `TENGO ×${stamp.quantity}` : 'ME FALTA'}
          </Badge>
          <Badge variant="rarity">{rarityLabel[stamp.rarity]}</Badge>
        </div>
        {showOwner && !hideOwner && stamp.profiles && (
          <div className="text-muted text-xs mt-1.5 truncate">
            👤 {stamp.profiles.username} · {stamp.profiles.city}
          </div>
        )}
        {hideOwner && (
          <div className="text-muted text-xs mt-1.5 italic">
            🔒 Inicia sesión para ver quién la tiene
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **components/ui/MatchCard.tsx**

```tsx
// components/ui/MatchCard.tsx
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Button } from './Button'
import type { Stamp, Profile } from '@/types/database'

interface MatchCardProps {
  stamp: Stamp
  user: Pick<Profile, 'id' | 'username' | 'city' | 'avatar_url' | 'reputation_score'>
  onChat: () => void
}

export function MatchCard({ stamp, user, onChat }: MatchCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex gap-3 items-start">
        <Avatar src={user.avatar_url} name={user.username} size={44} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-bold text-sm">{user.username}</span>
            {user.reputation_score > 4 && <Badge variant="verified">⭐ {user.reputation_score}</Badge>}
          </div>
          <div className="text-muted text-xs">{user.city}</div>
          <div className="mt-2">
            <div className="text-xs text-muted mb-1">Tiene:</div>
            <div className="text-foreground text-sm font-semibold">
              {stamp.player_name} <span className="text-muted">#{stamp.number}</span>
            </div>
            <div className="text-muted text-xs">{stamp.country}</div>
          </div>
        </div>
      </div>
      <div className="mt-3 bg-primary/8 border border-primary/20 rounded-lg px-3 py-2">
        <span className="text-primary text-xs font-bold">🔥 MATCH — tiene lo que necesitas</span>
      </div>
      <Button onClick={onChat} size="sm" className="w-full mt-3">
        💬 Iniciar intercambio
      </Button>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add components/ui/StampCard.tsx components/ui/MatchCard.tsx
git commit -m "feat: StampCard y MatchCard components"
```

---

## Task 14: Home, Matches y Search pages

**Files:**
- Modify: `app/app/page.tsx`
- Create: `app/app/matches/page.tsx`
- Create: `app/app/search/page.tsx`
- Create: `app/app/search/SearchClient.tsx`

- [ ] **app/app/page.tsx** (Home)

```tsx
// app/app/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMyMatches } from '@/lib/queries/matches'
import { getRecentStamps } from '@/lib/queries/stamps'
import { MatchCard } from '@/components/ui/MatchCard'
import { StampCard } from '@/components/ui/StampCard'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [matches, recent] = await Promise.all([
    getMyMatches(user.id),
    getRecentStamps(6),
  ])

  const topMatches = matches.slice(0, 3)

  return (
    <div className="p-4 space-y-6">
      {/* Matches destacados */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-foreground font-bold text-base">🔥 Matches hoy</h2>
          {matches.length > 3 && (
            <a href="/app/matches" className="text-primary text-xs font-medium">Ver todos →</a>
          )}
        </div>
        {topMatches.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-muted text-sm">Aún no hay matches.</p>
            <p className="text-muted text-xs mt-1">Publica tus estampas repetidas para encontrar coincidencias.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topMatches.map((s: any) => (
              <MatchCard key={s.id} stamp={s} user={s.profiles}
                onChat={() => {}} />
            ))}
          </div>
        )}
      </section>

      {/* Recién publicadas */}
      <section>
        <h2 className="text-foreground font-bold text-base mb-3">🆕 Recién publicadas</h2>
        <div className="space-y-2">
          {recent.map((s: any) => (
            <StampCard key={s.id} stamp={s} showOwner />
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **app/app/matches/page.tsx**

```tsx
// app/app/matches/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getMyMatches } from '@/lib/queries/matches'
import { MatchCard } from '@/components/ui/MatchCard'

export default async function MatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const matches = await getMyMatches(user.id)

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-foreground mb-1">Mis Matches</h1>
      <p className="text-muted text-sm mb-4">
        {matches.length} coincidencia{matches.length !== 1 ? 's' : ''} encontrada{matches.length !== 1 ? 's' : ''}
      </p>
      {matches.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center mt-8">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-foreground font-semibold">No hay matches todavía</p>
          <p className="text-muted text-sm mt-1">
            Publica lo que te falta y lo que tienes de más para encontrar personas con quien intercambiar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((s: any) => (
            <MatchCard key={s.id} stamp={s} user={s.profiles} onChat={() => {}} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **app/app/search/SearchClient.tsx**

```tsx
// app/app/search/SearchClient.tsx
'use client'
import { useState, useTransition } from 'react'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from '@/components/ui/Button'
import { StampCard } from '@/components/ui/StampCard'
import type { Stamp } from '@/types/database'

const RARITIES = [
  { value: '', label: 'Todas' },
  { value: 'common', label: '⚪ Común' },
  { value: 'rare', label: '🔵 Rara' },
  { value: 'star', label: '⭐ Estrella' },
  { value: 'ultra', label: '💎 Ultra' },
]

interface SearchClientProps {
  initialResults: (Stamp & { profiles: any })[]
  onSearch: (params: { query: string; rarity: string; onlyHave: boolean }) => Promise<(Stamp & { profiles: any })[]>
}

export function SearchClient({ initialResults, onSearch }: SearchClientProps) {
  const [results, setResults] = useState(initialResults)
  const [query, setQuery] = useState('')
  const [rarity, setRarity] = useState('')
  const [onlyHave, setOnlyHave] = useState(true)
  const [, startTransition] = useTransition()

  function handleSearch() {
    startTransition(async () => {
      const data = await onSearch({ query, rarity, onlyHave })
      setResults(data)
    })
  }

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Buscar jugador o selección..."
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors text-sm"
        />
        <Button onClick={handleSearch} size="md" className="px-4">🔍</Button>
      </div>

      {/* Filtros */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {RARITIES.map(r => (
            <button key={r.value} onClick={() => setRarity(r.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                rarity === r.value ? 'bg-primary/15 border-primary text-primary' : 'bg-base border-border text-muted'
              }`}>
              {r.label}
            </button>
          ))}
        </div>
        <Toggle checked={onlyHave} onChange={setOnlyHave} label="Solo disponibles para intercambio" />
      </div>

      {/* Resultados */}
      <div className="space-y-2">
        {results.length === 0 ? (
          <div className="text-center py-10 text-muted text-sm">No se encontraron estampas</div>
        ) : (
          results.map(s => <StampCard key={s.id} stamp={s} showOwner />)
        )}
      </div>
    </div>
  )
}
```

- [ ] **app/app/search/page.tsx**

```tsx
// app/app/search/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { searchStamps } from '@/lib/queries/stamps'
import { SearchClient } from './SearchClient'

export default async function SearchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const initial = await searchStamps({ type: 'have', limit: 20 })

  async function doSearch(params: { query: string; rarity: string; onlyHave: boolean }) {
    'use server'
    return searchStamps({
      query: params.query || undefined,
      rarity: params.rarity || undefined,
      type: params.onlyHave ? 'have' : undefined,
      limit: 30,
    })
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-foreground mb-1">Buscar estampas</h1>
      <p className="text-muted text-sm mb-4">Encuentra las que necesitas</p>
      <SearchClient initialResults={initial as any} onSearch={doSearch} />
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/app/page.tsx app/app/matches/ app/app/search/
git commit -m "feat: home, matches y search pages"
```

---

## Task 15: Perfil del usuario

**Files:**
- Create: `app/app/profile/page.tsx`
- Create: `app/app/profile/[username]/page.tsx`

- [ ] **app/app/profile/page.tsx**

```tsx
// app/app/profile/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/queries/profiles'
import { getMyStamps } from '@/lib/queries/stamps'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { StampCard } from '@/components/ui/StampCard'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, stamps] = await Promise.all([
    getProfile(user.id),
    getMyStamps(user.id),
  ])

  if (!profile) redirect('/login')

  const have = stamps.filter(s => s.type === 'have')
  const want = stamps.filter(s => s.type === 'want')

  return (
    <div className="p-4 space-y-5">
      {/* Cabecera perfil */}
      <div className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-center">
        <Avatar src={profile.avatar_url} name={profile.full_name} size={64} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-bold text-lg">{profile.full_name}</span>
            {profile.verified && <Badge variant="verified">✓</Badge>}
          </div>
          <div className="text-muted text-sm">@{profile.username}</div>
          <div className="text-muted text-xs mt-0.5">📍 {profile.city}</div>
          <div className="flex gap-3 mt-2">
            <div className="text-center">
              <div className="text-foreground font-bold text-sm">{profile.trades_count}</div>
              <div className="text-muted text-xs">Intercambios</div>
            </div>
            <div className="text-center">
              <div className="text-foreground font-bold text-sm">{profile.reputation_score > 0 ? `⭐ ${profile.reputation_score}` : '—'}</div>
              <div className="text-muted text-xs">Reputación</div>
            </div>
            <div className="text-center">
              <div className="text-foreground font-bold text-sm">{stamps.length}</div>
              <div className="text-muted text-xs">Estampas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mis estampas: Tengo */}
      <section>
        <h2 className="text-foreground font-semibold text-sm mb-2">📦 Tengo para intercambiar ({have.length})</h2>
        {have.length === 0 ? (
          <p className="text-muted text-xs">Aún no publicaste repetidas.</p>
        ) : (
          <div className="space-y-2">{have.map(s => <StampCard key={s.id} stamp={s} />)}</div>
        )}
      </section>

      {/* Mis estampas: Me faltan */}
      <section>
        <h2 className="text-foreground font-semibold text-sm mb-2">❤️ Me faltan ({want.length})</h2>
        {want.length === 0 ? (
          <p className="text-muted text-xs">Agrega las que te faltan para encontrar matches.</p>
        ) : (
          <div className="space-y-2">{want.map(s => <StampCard key={s.id} stamp={s} />)}</div>
        )}
      </section>
    </div>
  )
}
```

- [ ] **app/app/profile/[username]/page.tsx**

```tsx
// app/app/profile/[username]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getProfileByUsername } from '@/lib/queries/profiles'
import { getMyStamps } from '@/lib/queries/stamps'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { StampCard } from '@/components/ui/StampCard'

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getProfileByUsername(params.username)
  if (!profile) notFound()

  if (profile.id === user.id) redirect('/app/profile')

  const stamps = await getMyStamps(profile.id)
  const have = stamps.filter(s => s.type === 'have')

  return (
    <div className="p-4 space-y-5">
      <div className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-center">
        <Avatar src={profile.avatar_url} name={profile.full_name} size={64} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-foreground font-bold text-lg">{profile.full_name}</span>
            {profile.verified && <Badge variant="verified">✓</Badge>}
          </div>
          <div className="text-muted text-sm">@{profile.username}</div>
          <div className="text-muted text-xs mt-0.5">📍 {profile.city}</div>
          <div className="flex gap-3 mt-2">
            <div className="text-center">
              <div className="text-foreground font-bold text-sm">{profile.trades_count}</div>
              <div className="text-muted text-xs">Intercambios</div>
            </div>
            <div className="text-center">
              <div className="text-foreground font-bold text-sm">
                {profile.reputation_score > 0 ? `⭐ ${profile.reputation_score}` : '—'}
              </div>
              <div className="text-muted text-xs">Reputación</div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-foreground font-semibold text-sm mb-2">📦 Tiene para intercambiar ({have.length})</h2>
        <div className="space-y-2">{have.map(s => <StampCard key={s.id} stamp={s} />)}</div>
      </section>
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add app/app/profile/
git commit -m "feat: profile pages (propio y público)"
```

---

## Task 16: Chat en tiempo real

**Files:**
- Create: `app/app/chats/page.tsx`
- Create: `app/app/chats/[id]/page.tsx`
- Create: `app/app/chats/[id]/ChatRoom.tsx`

- [ ] **app/app/chats/page.tsx**

```tsx
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
```

- [ ] **app/app/chats/[id]/ChatRoom.tsx** (Client Component para realtime)

```tsx
// app/app/chats/[id]/ChatRoom.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { Message } from '@/types/database'

interface ChatRoomProps {
  chatId: string
  matchId: string
  userId: string
  initialMessages: Message[]
  otherUsername: string
  matchStatus: string
}

export function ChatRoom({ chatId, matchId, userId, initialMessages, otherUsername, matchStatus }: ChatRoomProps) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, payload => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [chatId, supabase])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    await supabase.from('messages').insert({ chat_id: chatId, sender_id: userId, content: text.trim() })
    setText('')
    setSending(false)
  }

  async function handleComplete(score: number, comment: string) {
    await supabase.from('matches').update({ status: 'completed' }).eq('id', matchId)
    await supabase.from('ratings').insert({
      match_id: matchId, rater_id: userId,
      rated_id: userId, // se reemplaza con rated_id real
      score, comment: comment || null
    })
    setShowCompleteModal(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)]">
      {/* Aviso de seguridad */}
      <div className="bg-amber/10 border-b border-amber/20 px-4 py-2">
        <p className="text-amber text-xs">⚠️ Intercambia en lugares públicos · Nunca envíes dinero</p>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map(msg => {
          const isMine = msg.sender_id === userId
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                isMine
                  ? 'bg-gradient-to-br from-primary-dark to-primary text-base rounded-br-sm'
                  : 'bg-card border border-border text-foreground rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Acciones */}
      {matchStatus !== 'completed' && (
        <div className="px-4 pb-1 pt-1">
          <button onClick={() => setShowCompleteModal(true)}
            className="w-full text-xs text-primary border border-primary/30 rounded-xl py-2 hover:bg-primary/10 transition-colors">
            ✅ Marcar intercambio como realizado
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="px-4 pb-2 pt-1 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Escribe un mensaje..."
          className="flex-1 bg-card border border-border rounded-full px-4 py-2.5 text-foreground placeholder:text-muted text-sm outline-none focus:border-primary transition-colors" />
        <Button type="submit" disabled={!text.trim() || sending} size="sm" className="px-4">↑</Button>
      </form>

      {/* Modal calificación */}
      {showCompleteModal && (
        <RatingModal onClose={() => setShowCompleteModal(false)} onSubmit={handleComplete} otherUsername={otherUsername} />
      )}
    </div>
  )
}

function RatingModal({ onClose, onSubmit, otherUsername }: {
  onClose: () => void
  onSubmit: (score: number, comment: string) => void
  otherUsername: string
}) {
  const [score, setScore] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm">
        <h3 className="text-foreground font-bold text-lg mb-1">¿Cómo fue el intercambio?</h3>
        <p className="text-muted text-sm mb-4">Califica a @{otherUsername}</p>
        <div className="flex gap-2 justify-center mb-4">
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setScore(n)}
              className={`text-2xl transition-transform ${n <= score ? 'scale-110' : 'opacity-30'}`}>⭐</button>
          ))}
        </div>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
          placeholder="Comentario opcional (ej: Muy puntual, todo bien)"
          className="w-full bg-base border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted text-sm outline-none focus:border-primary resize-none h-20 mb-4" />
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={() => onSubmit(score, comment)} className="flex-1">Enviar ✓</Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **app/app/chats/[id]/page.tsx**

```tsx
// app/app/chats/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { getChatMessages } from '@/lib/queries/chats'
import { ChatRoom } from './ChatRoom'

export default async function ChatPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: chat } = await supabase
    .from('chats')
    .select('*, matches(id, status), user_a:profiles!chats_user_a_id_fkey(id,username), user_b:profiles!chats_user_b_id_fkey(id,username)')
    .eq('id', params.id)
    .single()

  if (!chat) notFound()
  if (chat.user_a_id !== user.id && chat.user_b_id !== user.id) redirect('/app/chats')

  const messages = await getChatMessages(params.id)
  const other = (chat.user_a as any).id === user.id ? chat.user_b : chat.user_a

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <div className="font-bold text-foreground text-sm">@{(other as any).username}</div>
        <div className="text-muted text-xs">Intercambio de estampas</div>
      </div>
      <ChatRoom
        chatId={params.id}
        matchId={(chat.matches as any).id}
        userId={user.id}
        initialMessages={messages}
        otherUsername={(other as any).username}
        matchStatus={(chat.matches as any).status}
      />
    </div>
  )
}
```

- [ ] **Habilitar Realtime en Supabase Dashboard**

Supabase → Database → Replication → Habilitar Realtime para tabla `messages`.

- [ ] **Probar chat en browser**

Abre dos ventanas/tabs con cuentas distintas → navega al mismo chat → envía mensajes → verifica que aparecen en tiempo real en ambas ventanas.

- [ ] **Commit**

```bash
git add app/app/chats/
git commit -m "feat: chat en tiempo real con Supabase Realtime"
```

---

## Task 17: Landing page pública

**Files:**
- Modify: `app/page.tsx`

- [ ] **app/page.tsx**

```tsx
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
          <Link href="/login" className="text-muted text-sm hover:text-foreground transition-colors">Entrar</Link>
          <Link href="/register"
            className="bg-gradient-to-r from-primary-dark to-primary text-base font-bold text-sm px-4 py-1.5 rounded-full hover:brightness-110 transition-all"
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
            className="bg-gradient-to-r from-primary-dark to-primary text-base font-bold py-4 rounded-full text-center text-lg shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:brightness-110 transition-all"
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
        <div className="space-y-2 relative">
          {recent.map((s, i) => (
            <StampCard key={s.id} stamp={s as any}
              showOwner={!!user}
              hideOwner={!user && i >= 3}
            />
          ))}
          {!user && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base to-transparent flex items-end justify-center pb-4">
              <Link href="/register"
                className="bg-gradient-to-r from-primary-dark to-primary font-bold px-6 py-3 rounded-full text-sm shadow-lg hover:brightness-110 transition-all"
                style={{color:'#0f1923'}}>
                Ver todas → Crear cuenta
              </Link>
            </div>
          )}
        </div>
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
```

- [ ] **Verificar landing en browser**

`http://localhost:3000` — deberías ver landing completa con hero, pasos, estampas y sección de seguridad.

- [ ] **Commit**

```bash
git add app/page.tsx
git commit -m "feat: landing page pública con bloqueo estratégico"
```

---

## Task 18: PWA manifest

**Files:**
- Create: `public/manifest.json`
- Modify: `app/layout.tsx`

- [ ] **public/manifest.json**

```json
{
  "name": "StampSwap FIFA 2026",
  "short_name": "StampSwap",
  "description": "Intercambia estampas del Mundial FIFA 2026",
  "start_url": "/app",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0f1923",
  "theme_color": "#0f1923",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Crear iconos placeholder** (reemplazar con iconos reales antes del deploy)

Crea dos archivos PNG simples de 192×192 y 512×512 con el logo ⚽ y fondo `#0f1923`. Puedes usar cualquier editor de imágenes o generador online. Guárdalos en `public/icon-192.png` y `public/icon-512.png`.

- [ ] **Modificar app/layout.tsx para incluir manifest**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StampSwap — Intercambia estampas FIFA 2026',
  description: 'Completa tu álbum intercambiando estampas del Mundial FIFA 2026',
  manifest: '/manifest.json',
  themeColor: '#0f1923',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StampSwap',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Verificar PWA en Chrome DevTools**

1. Abre Chrome → `http://localhost:3000`
2. DevTools → Application → Manifest
3. Verifica que carga sin errores

- [ ] **Commit**

```bash
git add public/ app/layout.tsx
git commit -m "feat: PWA manifest"
```

---

## Task 19: Rate limiting en publicaciones

**Files:**
- Create: `app/app/publish/actions.ts`
- Modify: `app/app/publish/PublishForm.tsx`

- [ ] **app/app/publish/actions.ts** (Server Action con límite diario)

```ts
// app/app/publish/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function publishStampAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Rate limit: max 10 publicaciones por día
  const since = new Date()
  since.setHours(0, 0, 0, 0)

  const { count } = await supabase
    .from('stamps')
    .select('id', { count: 'exact', head: true })
    .eq('owner_id', user.id)
    .gte('created_at', since.toISOString())

  if ((count ?? 0) >= 10) {
    return { error: 'Límite diario alcanzado (máx. 10 publicaciones por día)' }
  }

  const number = parseInt(formData.get('number') as string)
  if (isNaN(number) || number < 1 || number > 700) {
    return { error: 'Número inválido (1-700)' }
  }

  const { error } = await supabase.from('stamps').insert({
    owner_id: user.id,
    number,
    player_name: (formData.get('player_name') as string).trim(),
    country: formData.get('country') as string,
    rarity: formData.get('rarity') as string,
    quantity: parseInt((formData.get('quantity') as string) ?? '1'),
    type: formData.get('type') as string,
  })

  if (error) return { error: error.message }
  redirect('/app/profile')
}
```

- [ ] **Actualizar PublishForm.tsx para usar Server Action**

Cambia la función `handleSubmit` en `PublishForm.tsx` para llamar la Server Action:

```tsx
// En PublishForm.tsx, reemplazar el handleSubmit con:
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setError('')
  setLoading(true)
  const fd = new FormData()
  fd.append('type', type)
  fd.append('number', form.number)
  fd.append('player_name', form.player_name)
  fd.append('country', form.country)
  fd.append('rarity', form.rarity)
  fd.append('quantity', form.quantity)
  const result = await publishStampAction(fd)
  setLoading(false)
  if (result?.error) setError(result.error)
}
```

Y agregar el import al inicio del archivo:
```tsx
import { publishStampAction } from './actions'
```

- [ ] **Commit**

```bash
git add app/app/publish/actions.ts app/app/publish/PublishForm.tsx
git commit -m "feat: rate limiting 10 publicaciones/día via Server Action"
```

---

## Task 20: Reportar y bloquear usuarios

**Files:**
- Create: `app/app/chats/[id]/ReportBlock.tsx`
- Modify: `app/app/chats/[id]/ChatRoom.tsx`

- [ ] **app/app/chats/[id]/ReportBlock.tsx**

```tsx
// app/app/chats/[id]/ReportBlock.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

const REASONS = [
  'Comportamiento sospechoso',
  'No se presentó al intercambio',
  'Contenido inapropiado',
  'Spam o estafa',
  'Otro',
]

interface ReportBlockProps {
  reporterId: string
  reportedId: string
  reportedUsername: string
  onClose: () => void
}

export function ReportBlock({ reporterId, reportedId, reportedUsername, onClose }: ReportBlockProps) {
  const supabase = createClient()
  const [reason, setReason] = useState('')
  const [done, setDone] = useState(false)

  async function handleReport() {
    if (!reason) return
    await supabase.from('reports').insert({ reporter_id: reporterId, reported_id: reportedId, reason })
    setDone(true)
  }

  async function handleBlock() {
    await supabase.from('blocks').insert({ blocker_id: reporterId, blocked_id: reportedId })
    setDone(true)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm">
        {done ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">✅</div>
            <p className="text-foreground font-semibold">Acción registrada</p>
            <p className="text-muted text-sm mt-1">Gracias por ayudar a mantener la comunidad segura.</p>
            <Button onClick={onClose} className="w-full mt-4" variant="ghost">Cerrar</Button>
          </div>
        ) : (
          <>
            <h3 className="text-foreground font-bold text-lg mb-1">Reportar a @{reportedUsername}</h3>
            <p className="text-muted text-sm mb-4">¿Qué ocurrió?</p>
            <div className="space-y-2 mb-4">
              {REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-colors ${
                    reason === r ? 'bg-danger/15 border-danger text-danger' : 'bg-base border-border text-muted hover:border-danger/40'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="danger" onClick={handleReport} disabled={!reason} className="w-full">
                Reportar usuario
              </Button>
              <Button variant="ghost" onClick={handleBlock} className="w-full">
                Bloquear y no volver a ver
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full">Cancelar</Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Agregar botón de reporte a ChatRoom.tsx**

En `ChatRoom.tsx`, añadir estado y el botón:

```tsx
// Añadir en ChatRoom junto a los otros estados:
const [showReport, setShowReport] = useState(false)

// Añadir en el JSX, dentro de la sección de acciones (encima del input):
<button onClick={() => setShowReport(true)}
  className="text-xs text-muted hover:text-danger transition-colors px-4 pb-1">
  ⚑ Reportar usuario
</button>

// Y el modal al final del return:
{showReport && (
  <ReportBlock
    reporterId={userId}
    reportedId={/* otherUserId pasado como prop */}
    reportedUsername={otherUsername}
    onClose={() => setShowReport(false)}
  />
)}
```

También agregar `otherUserId: string` a `ChatRoomProps` y pasarlo desde `page.tsx`.

- [ ] **Commit**

```bash
git add app/app/chats/
git commit -m "feat: reportar y bloquear usuarios"
```

---

## Task 21: Deploy a Vercel

**Files:**
- Create: `vercel.json`

- [ ] **Crear vercel.json**

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install"
}
```

- [ ] **Push a GitHub**

```bash
git remote add origin https://github.com/TU_USUARIO/stampswap.git
git push -u origin main
```

- [ ] **Conectar a Vercel**

1. Ve a https://vercel.com → New Project → importa el repo de GitHub
2. En "Environment Variables" agrega:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu anon key
3. Click "Deploy"

- [ ] **Verificar deploy**

URL de producción de Vercel → verifica que:
- La landing carga correctamente
- El registro funciona
- El login redirige a `/app`
- El bottom nav funciona en móvil

- [ ] **Configurar redirect URL en Supabase**

Supabase → Authentication → URL Configuration → Site URL = `https://tu-app.vercel.app`

Redirect URLs = `https://tu-app.vercel.app/**`

- [ ] **Commit final**

```bash
git add vercel.json
git commit -m "chore: vercel config + deploy inicial"
```

---

## Resumen de commits esperados

```
chore: scaffold Next.js + Supabase deps
chore: env setup + supabase project
chore: design tokens tailwind
feat: UI base components (Button, Toggle, Badge, Avatar)
feat: database schema inicial
feat: RLS policies todas las tablas
feat: supabase clients + middleware auth guard + types
feat: register page con Supabase auth
feat: login + verify-email pages
feat: app layout con Header y BottomNav
feat: queries stamps, matches, profiles, chats
feat: publicar estampa (have/want)
feat: StampCard y MatchCard components
feat: home, matches y search pages
feat: profile pages (propio y público)
feat: chat en tiempo real con Supabase Realtime
feat: landing page pública con bloqueo estratégico
feat: PWA manifest
feat: rate limiting 10 publicaciones/día via Server Action
feat: reportar y bloquear usuarios
chore: vercel config + deploy inicial
```
