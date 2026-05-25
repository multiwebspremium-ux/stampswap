'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:border-primary/40 transition-colors text-muted hover:text-foreground"
      aria-label="Cambiar tema"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
