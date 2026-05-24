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
