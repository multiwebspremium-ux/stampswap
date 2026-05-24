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
    'bg-gradient-to-r from-primary-dark to-primary text-[#0f1923] font-bold shadow-[0_0_12px_rgba(52,211,153,0.3)] hover:brightness-110 active:brightness-90 active:scale-[0.98]',
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
