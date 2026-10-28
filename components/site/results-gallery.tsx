'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Expand } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { ResultItem } from '@/lib/types'

export function ResultsGallery({ items }: { items: ResultItem[] }) {
  const [active, setActive] = useState<ResultItem | null>(null)
  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.title + item.image} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
            <button
              type="button"
              onClick={() => setActive(item)}
              className="group relative block aspect-[4/5] overflow-hidden bg-dark text-left"
            >
              <Image
                src={item.image || '/placeholder.svg'}
                alt={`Antes y después: ${item.title}`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/80 backdrop-blur">
                <Expand className="size-4" aria-hidden="true" />
                <span className="sr-only">Ver {item.title} en grande</span>
              </span>
              <span className="absolute bottom-3 left-3 flex gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
                <span className="rounded-full bg-dark px-3 py-1 text-dark-foreground">Antes</span>
                <span className="rounded-full bg-accent-light px-3 py-1 text-dark">Después</span>
              </span>
            </button>
            <div className="flex flex-col gap-2 p-5">
              <h3 className="text-xl">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl border-0 bg-card p-3 sm:max-w-3xl">
          <DialogTitle className="sr-only">{active?.title}</DialogTitle>
          {active && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-dark sm:aspect-[4/3]">
              <Image src={active.image || '/placeholder.svg'} alt={`Antes y después: ${active.title}`} fill sizes="90vw" className="object-contain" />
            </div>
          )}
          {active && <p className="px-2 pb-2 font-serif text-xl">{active.title}</p>}
        </DialogContent>
      </Dialog>
    </>
  )
}
