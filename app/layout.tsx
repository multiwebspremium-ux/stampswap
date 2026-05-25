import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StampSwap — Intercambia estampas FIFA 2026',
  description: 'Completa tu álbum intercambiando estampas del Mundial FIFA 2026',
  manifest: '/manifest.json',
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
        <meta name="theme-color" content="#0f1923" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
