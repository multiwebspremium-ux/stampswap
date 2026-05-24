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
