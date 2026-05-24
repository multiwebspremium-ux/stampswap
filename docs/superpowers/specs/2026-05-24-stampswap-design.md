# StampSwap — Diseño MVP

**Fecha:** 2026-05-24  
**Producto:** Web app de intercambio de estampas del Mundial FIFA 2026  
**Nombre comercial:** StampSwap  

---

## 1. Objetivo

Plataforma mobile-first donde coleccionistas del álbum Panini FIFA 2026 pueden publicar sus estampas repetidas, registrar las que les faltan, encontrar coincidencias automáticas con otros usuarios, y coordinar intercambios vía chat interno.

El valor central: **"¿Quién tiene lo que me falta y necesita lo que yo tengo?"** — el sistema responde solo.

---

## 2. Alcance del MVP

**Incluido:**
- Landing page pública con bloqueo estratégico de datos para forzar registro
- Registro con email verificado + ciudad
- Inventario personal: estampas que tengo (repetidas) y me faltan (wishlist)
- Motor de matches automático (cruce de inventarios)
- Chat en tiempo real por match
- Perfiles públicos con reputación
- Búsqueda con filtros
- Sistema de calificación post-intercambio
- Reportar / bloquear usuarios
- PWA instalable en móvil

**Fuera del MVP (v2):**
- Panel admin
- Geolocalización
- Escáner de cámara (OCR de estampas)
- OTP SMS / verificación por WhatsApp
- Modo evento (meetups)
- Gamificación (logros, rankings)
- Monetización (perfiles destacados)

---

## 3. Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router), TailwindCSS, TypeScript |
| Backend / DB | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| Deploy frontend | Vercel (plan gratuito) |
| Deploy backend | Supabase (plan gratuito) |
| PWA | next-pwa o manifest manual |

No hay backend propio. Next.js se comunica con Supabase directamente via SDK desde Server Components y Client Components.

---

## 4. Diseño visual

- **Modo:** Dark mode exclusivo
- **Fondo base:** `#0f1923` (azul-negro medianoche)
- **Fondo cards:** `#1a2535`
- **Bordes:** `#263547`
- **Color primario / CTA:** `#34d399` (verde esmeralda)
- **Gradiente botones:** `linear-gradient(135deg, #059669, #34d399)`
- **Texto principal:** `#e2e8f0`
- **Texto secundario:** `#64748b`
- **Alertas/badges:** `#fbbf24` (ámbar) para "me falta", `#34d399` para "tengo", `#ef4444` para notificaciones

**Tipografía:** Inter (Google Fonts, ya incluida en Next.js)

---

## 5. Navegación

### Header (siempre visible)
```
[⚽ StampSwap]          [＋] [🔔]
```
- Botón **＋** (verde): abre modal/página para publicar estampa
- **🔔**: notificaciones con punto rojo si hay nuevas

### Bottom navigation (mobile, siempre visible)
```
[🏠 Inicio] [🔍 Buscar] [🔥 Matches] [💬 Chats] [👤 Perfil]
```

---

## 6. Modelo de datos (PostgreSQL / Supabase)

### `profiles`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | FK → auth.users |
| username | text | único, slug |
| full_name | text | |
| city | text | |
| avatar_url | text | Supabase Storage |
| verified | boolean | default false |
| reputation_score | numeric | promedio de ratings |
| trades_count | integer | intercambios completados |
| last_seen | timestamp | |
| created_at | timestamp | |

### `stamps`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| owner_id | uuid | FK → profiles |
| number | integer | número en el álbum |
| player_name | text | libre |
| country | text | libre |
| rarity | text | `common / rare / star / ultra` |
| quantity | integer | solo si type = 'have' |
| type | text | `have` o `want` |
| image_url | text | opcional, Supabase Storage |
| created_at | timestamp | |

### `matches`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| user_a_id | uuid | quien tiene la estampa |
| user_b_id | uuid | quien la necesita |
| stamp_a_id | uuid | estampa ofrecida |
| stamp_b_id | uuid | estampa deseada |
| status | text | `pending / accepted / completed / cancelled` |
| created_at | timestamp | |

### `chats`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| match_id | uuid | FK → matches |
| user_a_id | uuid | |
| user_b_id | uuid | |
| created_at | timestamp | |

### `messages`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| chat_id | uuid | FK → chats |
| sender_id | uuid | FK → profiles |
| content | text | |
| image_url | text | opcional |
| created_at | timestamp | |

### `ratings`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| match_id | uuid | FK → matches |
| rater_id | uuid | |
| rated_id | uuid | |
| score | integer | 1-5 |
| comment | text | opcional |
| created_at | timestamp | |

### `reports`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| reporter_id | uuid | |
| reported_id | uuid | |
| reason | text | |
| created_at | timestamp | |

### `blocks`
| Campo | Tipo | Notas |
|---|---|---|
| id | uuid | |
| blocker_id | uuid | FK → profiles |
| blocked_id | uuid | FK → profiles |
| created_at | timestamp | |

---

## 7. Motor de matches

Query ejecutada al cargar `/app/matches` para el usuario actual:

```sql
SELECT DISTINCT
  p.id, p.username, p.city, p.avatar_url, p.reputation_score,
  s_they.id AS stamp_id, s_they.player_name, s_they.number, s_they.country, s_they.rarity
FROM stamps s_they
JOIN stamps s_mine
  ON s_they.number = s_mine.number
  AND s_they.type = 'have'
  AND s_mine.type = 'want'
  AND s_they.owner_id != s_mine.owner_id
  AND s_mine.owner_id = :current_user_id
JOIN profiles p ON p.id = s_they.owner_id
ORDER BY p.reputation_score DESC;
```

Se ejecuta también al publicar una estampa nueva para notificar matches recién creados.

---

## 8. Pantallas

| Ruta | Pantalla | Auth |
|---|---|---|
| `/` | Landing pública | No |
| `/register` | Registro | No |
| `/verify-email` | Espera verificación | No |
| `/login` | Login | No |
| `/app` | Home (matches + recientes) | Sí |
| `/app/search` | Búsqueda con filtros | Sí |
| `/app/matches` | Mis coincidencias | Sí |
| `/app/chats` | Lista de chats | Sí |
| `/app/chats/[id]` | Chat en tiempo real | Sí |
| `/app/profile` | Mi perfil + mis estampas | Sí |
| `/app/profile/[username]` | Perfil público | Sí |
| `/app/publish` | Publicar estampa | Sí |

### Landing (`/`)
- Hero: headline + CTA enorme
- Sección "Cómo funciona": 5 pasos con íconos
- Grid "Últimas estampas publicadas": muestra foto/número/jugador/país pero **oculta el usuario** si no estás logueado
- Sección seguridad con checks
- Estadísticas (hardcoded al inicio, luego dinámicas)
- Footer

### Auth
- Registro: nombre completo, username único, email, ciudad (select), contraseña
- Email de verificación vía Supabase Auth (template personalizable)
- Login: email + contraseña
- Middleware Next.js redirige `/app/*` a `/login` si no hay sesión

### Publicar estampa (`/app/publish`)
- Tipo: radio "Tengo (repetida)" / "Me falta"
- Número de estampa (input numérico)
- Nombre del jugador (texto libre)
- País (texto libre o select de selecciones del Mundial)
- Rareza (select: Común / Rara / Estrella / Ultra Rara)
- Cantidad (solo si "Tengo")
- Foto opcional (upload a Supabase Storage)

### Chat (`/app/chats/[id]`)
- Mensajes en tiempo real con Supabase Realtime
- Upload de fotos
- Botón "Marcar intercambio como realizado" → abre modal de calificación
- Botón "Reportar usuario"
- Aviso de seguridad fijo en la parte superior del chat

---

## 9. Seguridad y anti-spam

- Email verificado obligatorio antes de publicar o chatear
- Row Level Security (RLS) en todas las tablas de Supabase
- Rate limiting: máximo 10 publicaciones por día por usuario (via Supabase Edge Function o check en Server Action)
- Bloqueo de usuarios: tabla `blocks`, filtra de búsquedas y matches
- Reportes visibles en futuro panel admin

---

## 10. PWA

- `manifest.json` con nombre, íconos, `theme_color: #0f1923`, `background_color: #0f1923`
- `display: standalone` para experiencia de app
- Sin service worker complejo en MVP (solo manifest)

---

## 11. Decisiones de diseño tomadas

- **Sin catálogo oficial:** el usuario ingresa datos de forma libre. El match se hace por número de estampa, no por jugador. Esto simplifica el MVP enormemente.
- **Sin OTP SMS:** email verification es suficiente para el MVP. Elimina bots sin integrar Twilio.
- **Chat solo post-match:** el chat se crea automáticamente cuando el sistema detecta un match (status `pending`). Ambos usuarios pueden chatear desde ese momento. El chat no desaparece si el match se cancela, pero se marca como cerrado.
- **Sin geolocalización en MVP:** la ciudad se declara en el registro. En v2 se agrega distancia aproximada.
