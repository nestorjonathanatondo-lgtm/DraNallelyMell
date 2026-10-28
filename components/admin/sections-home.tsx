'use client'

import type { SiteContent } from '@/lib/types'
import { Grid, ListEditor, MediaField, NumberField, Panel, StringList, TextField, ToggleField } from './fields'

type Props<K extends keyof SiteContent> = { value: SiteContent[K]; onChange: (v: SiteContent[K]) => void }

export function HeroSection({ value, onChange }: Props<'hero'>) {
  const set = (p: Partial<SiteContent['hero']>) => onChange({ ...value, ...p })
  return (
    <>
      <Panel title="Encabezado principal">
        <TextField label="Etiqueta superior" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <Grid cols={3}>
          <TextField label="Título · inicio" value={value.titleBefore} onChange={(titleBefore) => set({ titleBefore })} />
          <TextField label="Título · palabra en cursiva" value={value.titleAccent} onChange={(titleAccent) => set({ titleAccent })} />
          <TextField label="Título · final" value={value.titleAfter} onChange={(titleAfter) => set({ titleAfter })} />
        </Grid>
        <TextField label="Descripción" multiline value={value.description} onChange={(description) => set({ description })} help="Usa **texto** para resaltar en negritas." />
        <Grid>
          <TextField label="Botón principal" value={value.primaryCta} onChange={(primaryCta) => set({ primaryCta })} />
          <TextField label="Botón secundario" value={value.secondaryCta} onChange={(secondaryCta) => set({ secondaryCta })} />
        </Grid>
      </Panel>
      <Panel title="Imagen principal">
        <Grid>
          <MediaField label="Fotografía" value={value.image} onChange={(image) => set({ image })} />
          <TextField label="Texto alternativo" value={value.imageAlt} onChange={(imageAlt) => set({ imageAlt })} />
          <TextField label="Insignia" value={value.badge} onChange={(badge) => set({ badge })} />
          <TextField label="Tarjeta · etiqueta" value={value.locationEyebrow} onChange={(locationEyebrow) => set({ locationEyebrow })} />
          <TextField label="Tarjeta · texto" value={value.locationTitle} onChange={(locationTitle) => set({ locationTitle })} />
        </Grid>
      </Panel>
      <Panel title="Cifras">
        <ListEditor
          items={value.stats}
          onChange={(stats) => set({ stats })}
          create={() => ({ value: '', label: '' })}
          itemTitle={(s) => `${s.value} ${s.label}`}
          renderItem={(s, update) => (
            <Grid>
              <TextField label="Valor" value={s.value} onChange={(v) => update({ value: v })} />
              <TextField label="Etiqueta" value={s.label} onChange={(label) => update({ label })} />
            </Grid>
          )}
        />
      </Panel>
    </>
  )
}

export function PillarsSection({ value, onChange }: Props<'pillars'>) {
  const set = (p: Partial<SiteContent['pillars']>) => onChange({ ...value, ...p })
  return (
    <Panel title="Pilares de excelencia">
      <Grid>
        <TextField label="Etiqueta" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={value.title} onChange={(title) => set({ title })} />
      </Grid>
      <ListEditor
        items={value.items}
        onChange={(items) => set({ items })}
        create={() => ({ title: 'Nuevo pilar', text: '' })}
        itemTitle={(i) => i.title}
        renderItem={(item, update) => (
          <>
            <TextField label="Título" value={item.title} onChange={(title) => update({ title })} />
            <TextField label="Texto" multiline value={item.text} onChange={(text) => update({ text })} />
          </>
        )}
      />
    </Panel>
  )
}

export function ResultsSectionEditor({ value, onChange }: Props<'results'>) {
  const set = (p: Partial<SiteContent['results']>) => onChange({ ...value, ...p })
  return (
    <Panel title="Antes y después">
      <Grid>
        <TextField label="Etiqueta" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={value.title} onChange={(title) => set({ title })} />
      </Grid>
      <TextField label="Descripción" multiline value={value.description} onChange={(description) => set({ description })} />
      <TextField label="Aviso legal" value={value.disclaimer} onChange={(disclaimer) => set({ disclaimer })} />
      <ListEditor
        items={value.items}
        onChange={(items) => set({ items })}
        create={() => ({ title: 'Nuevo resultado', text: '', image: '' })}
        itemTitle={(i) => i.title}
        addLabel="Agregar caso"
        renderItem={(item, update) => (
          <>
            <MediaField label="Imagen antes/después" value={item.image} onChange={(image) => update({ image })} />
            <TextField label="Título" value={item.title} onChange={(title) => update({ title })} />
            <TextField label="Descripción" multiline value={item.text} onChange={(text) => update({ text })} />
          </>
        )}
      />
    </Panel>
  )
}

export function VascularSection({ value, onChange, slugs }: Props<'vascular'> & { slugs: string[] }) {
  const set = (p: Partial<SiteContent['vascular']>) => onChange({ ...value, ...p })
  return (
    <Panel title="Sección destacada (oscura)">
      <ToggleField label="Mostrar sección" checked={value.enabled} onChange={(enabled) => set({ enabled })} />
      <TextField label="Etiqueta" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
      <Grid>
        <TextField label="Título · inicio" value={value.titleBefore} onChange={(titleBefore) => set({ titleBefore })} />
        <TextField label="Título · cursiva" value={value.titleAccent} onChange={(titleAccent) => set({ titleAccent })} />
      </Grid>
      <TextField label="Descripción" multiline value={value.description} onChange={(description) => set({ description })} />
      <Grid>
        <MediaField label="Video (opcional)" kind="video" value={value.video} onChange={(video) => set({ video })} help="Si hay video, se muestra en lugar de la imagen." />
        <MediaField label="Imagen" value={value.image} onChange={(image) => set({ image })} />
        <TextField label="Texto del botón" value={value.ctaLabel} onChange={(ctaLabel) => set({ ctaLabel })} />
        <TextField label="Tratamiento enlazado (identificador)" value={value.treatmentSlug} onChange={(treatmentSlug) => set({ treatmentSlug })} help={slugs.includes(value.treatmentSlug) ? '' : 'No coincide con ningún tratamiento.'} />
      </Grid>
    </Panel>
  )
}

export function StepsSection({ value, onChange }: Props<'steps'>) {
  const set = (p: Partial<SiteContent['steps']>) => onChange({ ...value, ...p })
  return (
    <Panel title="Experiencia paso a paso">
      <Grid cols={3}>
        <TextField label="Etiqueta" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={value.title} onChange={(title) => set({ title })} />
        <TextField label="Botón" value={value.ctaLabel} onChange={(ctaLabel) => set({ ctaLabel })} />
      </Grid>
      <ListEditor
        items={value.items}
        onChange={(items) => set({ items })}
        create={() => ({ title: 'Nuevo paso', text: '' })}
        itemTitle={(i, n) => `${n + 1}. ${i.title}`}
        renderItem={(item, update) => (
          <>
            <TextField label="Título" value={item.title} onChange={(title) => update({ title })} />
            <TextField label="Texto" multiline value={item.text} onChange={(text) => update({ text })} />
          </>
        )}
      />
    </Panel>
  )
}

export function AboutSection({ value, onChange }: Props<'about'>) {
  const set = (p: Partial<SiteContent['about']>) => onChange({ ...value, ...p })
  return (
    <Panel title="Sobre la doctora">
      <MediaField label="Retrato" value={value.image} onChange={(image) => set({ image })} />
      <Grid>
        <TextField label="Etiqueta" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={value.title} onChange={(title) => set({ title })} />
      </Grid>
      <TextField label="Frase" value={value.quote} onChange={(quote) => set({ quote })} />
      <TextField label="Biografía" multiline rows={5} value={value.text} onChange={(text) => set({ text })} />
      <StringList label="Credenciales" items={value.credentials} onChange={(credentials) => set({ credentials })} />
    </Panel>
  )
}

export function TestimonialsSection({ value, onChange }: Props<'testimonials'>) {
  const set = (p: Partial<SiteContent['testimonials']>) => onChange({ ...value, ...p })
  return (
    <Panel title="Testimonios">
      <Grid>
        <TextField label="Etiqueta" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={value.title} onChange={(title) => set({ title })} />
      </Grid>
      <ListEditor
        items={value.items}
        onChange={(items) => set({ items })}
        create={() => ({ quote: '', name: '', treatment: '', rating: 5 })}
        itemTitle={(i) => `${i.name} · ${i.treatment}`}
        addLabel="Agregar testimonio"
        renderItem={(item, update) => (
          <>
            <TextField label="Testimonio" multiline value={item.quote} onChange={(quote) => update({ quote })} />
            <Grid cols={3}>
              <TextField label="Nombre" value={item.name} onChange={(name) => update({ name })} />
              <TextField label="Tratamiento" value={item.treatment} onChange={(treatment) => update({ treatment })} />
              <NumberField label="Estrellas (1-5)" min={1} max={5} value={item.rating} onChange={(rating) => update({ rating: Math.min(5, Math.max(1, rating)) })} />
            </Grid>
          </>
        )}
      />
    </Panel>
  )
}

export function FaqSection({ value, onChange }: Props<'faq'>) {
  const set = (p: Partial<SiteContent['faq']>) => onChange({ ...value, ...p })
  return (
    <Panel title="Preguntas frecuentes">
      <Grid>
        <TextField label="Etiqueta" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <TextField label="Título" value={value.title} onChange={(title) => set({ title })} />
      </Grid>
      <TextField label="Descripción" value={value.description} onChange={(description) => set({ description })} />
      <ListEditor
        items={value.items}
        onChange={(items) => set({ items })}
        create={() => ({ q: 'Nueva pregunta', a: '' })}
        itemTitle={(i) => i.q}
        addLabel="Agregar pregunta"
        renderItem={(item, update) => (
          <>
            <TextField label="Pregunta" value={item.q} onChange={(q) => update({ q })} />
            <TextField label="Respuesta" multiline rows={4} value={item.a} onChange={(a) => update({ a })} />
          </>
        )}
      />
    </Panel>
  )
}

export function CtaFooterSection({
  cta,
  footer,
  onCta,
  onFooter,
}: {
  cta: SiteContent['cta']
  footer: SiteContent['footer']
  onCta: (v: SiteContent['cta']) => void
  onFooter: (v: SiteContent['footer']) => void
}) {
  return (
    <>
      <Panel title="Llamado final">
        <Grid>
          <TextField label="Etiqueta" value={cta.eyebrow} onChange={(eyebrow) => onCta({ ...cta, eyebrow })} />
          <TextField label="Título" value={cta.title} onChange={(title) => onCta({ ...cta, title })} />
        </Grid>
        <TextField label="Descripción" multiline value={cta.description} onChange={(description) => onCta({ ...cta, description })} />
      </Panel>
      <Panel title="Pie de página">
        <TextField label="Descripción" multiline value={footer.description} onChange={(description) => onFooter({ ...footer, description })} />
        <TextField label="Nota legal" value={footer.legalNote} onChange={(legalNote) => onFooter({ ...footer, legalNote })} />
      </Panel>
    </>
  )
}
