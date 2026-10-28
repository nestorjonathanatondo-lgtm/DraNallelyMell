import { cn } from '@/lib/utils'
import { container } from '@/lib/ui'

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn(container, 'flex flex-col gap-5 pb-10 pt-14 md:pt-20')}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="max-w-3xl text-balance text-4xl md:text-6xl">{title}</h1>
      {children && <div className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  )
}
