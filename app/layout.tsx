import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StampSwap — Intercambia estampas FIFA 2026',
  description: 'Completa tu álbum intercambiando estampas del Mundial FIFA 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
