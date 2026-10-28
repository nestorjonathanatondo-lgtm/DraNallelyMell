'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { SiteContent, Treatment } from '@/lib/types'
import { Grid, ListEditor, MediaField, Panel, SelectField, StringList, TextField, ToggleField } from './fields'

const slugify = (v: string) =>
  v
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

type Props = {
  section: SiteContent['treatmentsSection']
  categories: string[]
  treatments: Treatment[]
  onSection: (v: SiteContent['treatmentsSection']) => void
  onCategories: (v: string[]) => void
  onTreatments: (v: Treatment[]) => void
}

export function TreatmentsSection({ section, categories, treatments, onSection, onCategories, onTreatments }: Props) {
  const [query, setQuery] = useState('')
  const filtered = query
    ? treatments.filter((t) => `${t.name} ${t.category}`.toLowerCase().includes(query.toLowerCase()))
    : null

  const editor = (t: Treatment, update: (p: Partial<Treatment>) => void) => (
    <>
      <Grid>
        <TextField
          label="Nombre"
          value={t.name}
          onChange={(name) => update(t.slug.startsWith('nuevo-tratamiento') ? { name, slug: slugify(name) } : { name })}
        />
        <TextField label="Identificador en la URL" value={t.slug} onChange={(slug) => update({ slug: slugify(slug) })} help={`/tratamientos/${t.slug}`} />
        <SelectField
          label="Categoría"
          value={t.category}
          onChange={(category) => update({ category })}
          options={[...new Set([...categories, t.category])].map((c) => ({ value: c, label: c }))}
        />
        <TextField label="Duración" value={t.duration} onChange={(duration) => update({ duration })} placeholder="45 min" />
        <TextField label="Inversión / precio" value={t.price} onChange={(price) => update({ price })} placeholder="Valoración previa o $3,500" />
        <TextField label="Insignia (opcional)" value={t.badge} onChange={(badge) => update({ badge })} placeholder="Más solicitado" />
      </Grid>
      <TextField label="Descripción" multiline value={t.description} onChange={(description) => update({ description })} />
      <MediaField label="Imagen" value={t.image} onChange={(image) => update({ image })} />
      <StringList label="Beneficios" items={t.benefits} onChange={(benefits) => update({ benefits })} />
      <ToggleField label="Destacar en la página de inicio" checked={t.featured} onChange={(featured) => update({ featured })} help="Se muestran hasta 6 destacados." />
    </>
  )

  return (
    <>
      <Panel title="Encabezado de tratamientos">
        <Grid cols={3}>
          <TextField label="Etiqueta" value={section.eyebrow} onChange={(eyebrow) => onSection({ ...section, eyebrow })} />
          <TextField label="Título" value={section.title} onChange={(title) => onSection({ ...section, title })} />
          <TextField label="Botón" value={section.ctaLabel} onChange={(ctaLabel) => onSection({ ...section, ctaLabel })} />
        </Grid>
        <TextField label="Descripción (página de tratamientos)" multiline value={section.description} onChange={(description) => onSection({ ...section, description })} />
      </Panel>
      <Panel title="Categorías">
        <StringList label="Categorías (en orden)" items={categories} onChange={onCategories} />
      </Panel>
      <Panel
        title={`Tratamientos (${treatments.length})`}
        description="Toca un tratamiento para editarlo. Usa las flechas para cambiar el orden."
        actions={
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar" aria-label="Buscar tratamiento" className="h-9 w-48 bg-background pl-8" />
          </div>
        }
      >
        {filtered ? (
          <div className="flex flex-col gap-2">
            {filtered.length === 0 && <p className="text-sm text-muted-foreground">Sin resultados.</p>}
            {filtered.map((t) => {
              const index = treatments.indexOf(t)
              return (
                <details key={index} className="rounded-xl border border-border bg-background">
                  <summary className="cursor-pointer p-3 text-sm">{t.name}</summary>
                  <div className="flex flex-col gap-4 border-t border-border p-4">
                    {editor(t, (p) => onTreatments(treatments.map((x, j) => (j === index ? { ...x, ...p } : x))))}
                  </div>
                </details>
              )
            })}
          </div>
        ) : (
          <ListEditor
            items={treatments}
            onChange={onTreatments}
            addLabel="Agregar tratamiento"
            itemTitle={(t) => `${t.name} · ${t.category}${t.featured ? ' ★' : ''}`}
            create={() => ({
              slug: `nuevo-tratamiento-${Date.now().toString(36)}`,
              name: 'Nuevo tratamiento',
              category: categories[0] ?? '',
              duration: '45 min',
              description: '',
              badge: '',
              image: '',
              benefits: [],
              price: 'Valoración previa',
              featured: false,
            })}
            renderItem={(t, update) => editor(t, update)}
          />
        )}
      </Panel>
    </>
  )
}
