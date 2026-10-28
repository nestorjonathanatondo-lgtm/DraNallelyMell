'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export function TreatmentSearch() {
  const [query, setQuery] = useState('')
  const { data, isLoading } = useSWR(query.trim() ? `/api/search?q=${encodeURIComponent(query.trim())}` : null, fetcher, { keepPreviousData: true })
  const hits = data?.hits ?? []
  return <div className="mx-auto mb-10 max-w-2xl">
    <label htmlFor="treatment-search" className="sr-only">Buscar tratamiento</label>
    <div className="relative">
      <Search aria-hidden="true" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <input id="treatment-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca por tratamiento, zona o beneficio" className="h-14 w-full rounded-full border border-border bg-card pl-12 pr-5 shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20" />
    </div>
    {query.trim() && <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      {isLoading ? <p className="p-5 text-sm text-muted-foreground">Buscando…</p> : hits.length ? <ul className="divide-y divide-border">{hits.map((hit: { objectID: string; name: string; category: string; description: string; url: string }) => <li key={hit.objectID}><Link href={hit.url} className="block p-4 transition hover:bg-muted"><span className="text-xs uppercase tracking-[0.18em] text-accent">{hit.category}</span><span className="mt-1 block font-serif text-xl">{hit.name}</span><span className="mt-1 block line-clamp-2 text-sm text-muted-foreground">{hit.description}</span></Link></li>)}</ul> : <p className="p-5 text-sm text-muted-foreground">No encontramos tratamientos con esa búsqueda.</p>}
    </div>}
  </div>
}
