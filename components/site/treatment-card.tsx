import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import type { Treatment } from '@/lib/types'

export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <Link href={`/tratamientos/${treatment.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {treatment.image && (
          <Image
            src={treatment.image || '/placeholder.svg'}
            alt={treatment.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {treatment.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-dark/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-dark-foreground">
            {treatment.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          <Clock className="size-3.5" aria-hidden="true" />
          {treatment.duration} · {treatment.category}
        </p>
        <h3 className="text-2xl leading-tight">
          <Link href={`/tratamientos/${treatment.slug}`} className="hover:text-accent">
            {treatment.name}
          </Link>
        </h3>
        <p className="leading-relaxed text-muted-foreground">{treatment.description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm">{treatment.price}</span>
          <Link
            href={`/agendar?servicio=${treatment.slug}`}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] hover:text-accent"
          >
            Agendar
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
            <span className="sr-only">{treatment.name}</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
