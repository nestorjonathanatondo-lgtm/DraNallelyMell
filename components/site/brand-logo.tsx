import { cn } from '@/lib/utils'
import type { SiteContent } from '@/lib/types'

export function BrandLogo({
  brand,
  inverted = false,
  className,
}: {
  brand: SiteContent['brand']
  inverted?: boolean
  className?: string
}) {
  if (brand.logoImage || brand.name) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/images/logo-nallely.jpg"
        alt="Dra. Nallely Mellado — Medicina estética y longevidad"
        width={70}
        height={70}
        className={cn('size-[70px] object-contain invert mix-blend-multiply', className)}
        draggable={false}
      />
    )
  }
  return (
    <span className={cn('flex flex-col leading-none', className)}>
      <span className={cn('font-serif text-2xl', inverted ? 'text-dark-foreground' : 'text-foreground')}>
        {brand.name} <em className="text-accent-light">{brand.nameAccent}</em>
      </span>
      <span
        className={cn(
          'mt-1.5 text-[10px] font-medium uppercase tracking-[0.22em]',
          inverted ? 'text-dark-foreground/60' : 'text-muted-foreground',
        )}
      >
        {brand.tagline}
      </span>
    </span>
  )
}
