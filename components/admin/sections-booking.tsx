'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { WEEKDAYS } from '@/lib/schedule'
import type { FieldType, IntakeField, SiteContent } from '@/lib/types'
import { Grid, ListEditor, NumberField, Panel, SelectField, StringList, TextField, ToggleField } from './fields'

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Texto corto' },
  { value: 'textarea', label: 'Texto largo' },
  { value: 'tel', label: 'Teléfono' },
  { value: 'email', label: 'Correo' },
  { value: 'date', label: 'Fecha' },
  { value: 'select', label: 'Lista desplegable' },
  { value: 'choice', label: 'Botones de opción' },
]

const LOCKED = new Set(['name', 'phone'])

export function BookingSection({ value, onChange }: { value: SiteContent['booking']; onChange: (v: SiteContent['booking']) => void }) {
  const set = (p: Partial<SiteContent['booking']>) => onChange({ ...value, ...p })
  const order = [1, 2, 3, 4, 5, 6, 0]

  return (
    <>
      <Panel title="Campos de la hoja de recepción" description="Lo que la paciente llena al agendar. Nombre y teléfono son obligatorios para poder contactarla.">
        <ListEditor<IntakeField>
          items={value.fields}
          onChange={(fields) => {
            const kept = value.fields.filter((f) => LOCKED.has(f.id) && !fields.some((n) => n.id === f.id))
            set({ fields: [...kept, ...fields] })
          }}
          addLabel="Agregar campo"
          itemTitle={(f) => `${f.label}${f.required ? ' *' : ''} · ${FIELD_TYPES.find((t) => t.value === f.type)?.label ?? f.type}`}
          create={() => ({
            id: `campo_${Date.now().toString(36)}`,
            label: 'Nuevo campo',
            type: 'text',
            required: false,
            placeholder: '',
            help: '',
            options: [],
          })}
          renderItem={(f, update) => (
            <>
              <Grid>
                <TextField label="Etiqueta" value={f.label} onChange={(label) => update({ label })} />
                {LOCKED.has(f.id) ? (
                  <p className="self-end pb-2 text-xs text-muted-foreground">Campo del sistema: no se puede cambiar el tipo ni eliminar.</p>
                ) : (
                  <SelectField label="Tipo" value={f.type} onChange={(type) => update({ type: type as FieldType })} options={FIELD_TYPES} />
                )}
                <TextField label="Texto de ejemplo" value={f.placeholder} onChange={(placeholder) => update({ placeholder })} />
                <TextField label="Ayuda bajo el campo" value={f.help} onChange={(help) => update({ help })} />
              </Grid>
              {(f.type === 'select' || f.type === 'choice') && <StringList label="Opciones" items={f.options} onChange={(options) => update({ options })} />}
              <ToggleField
                label="Obligatorio"
                checked={LOCKED.has(f.id) ? true : f.required}
                onChange={(required) => !LOCKED.has(f.id) && update({ required })}
              />
            </>
          )}
        />
      </Panel>

      <Panel title="Horario de citas" description="Define los días y horas en que se pueden agendar citas.">
        <Grid>
          <NumberField label="Duración de cada espacio (min)" value={value.slotMinutes} min={10} max={240} step={5} onChange={(slotMinutes) => set({ slotMinutes })} />
          <NumberField label="Días máximos de anticipación" value={value.maxDaysAhead} min={1} max={365} onChange={(maxDaysAhead) => set({ maxDaysAhead })} />
        </Grid>
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-background">
          {order.map((d) => {
            const day = value.schedule[d]
            const update = (p: Partial<typeof day>) => set({ schedule: value.schedule.map((s, i) => (i === d ? { ...s, ...p } : s)) })
            return (
              <div key={d} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <Switch checked={day.open} onCheckedChange={(open) => update({ open })} aria-label={`Abrir ${WEEKDAYS[d]}`} />
                <span className="w-24 text-sm">{WEEKDAYS[d]}</span>
                {day.open ? (
                  <div className="flex items-center gap-2">
                    <Input type="time" value={day.start} onChange={(e) => update({ start: e.target.value })} className="h-9 w-28 bg-card" aria-label={`Apertura ${WEEKDAYS[d]}`} />
                    <span className="text-muted-foreground">a</span>
                    <Input type="time" value={day.end} onChange={(e) => update({ end: e.target.value })} className="h-9 w-28 bg-card" aria-label={`Cierre ${WEEKDAYS[d]}`} />
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Cerrado</span>
                )}
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel title="Textos de la reserva">
        <Grid>
          <TextField label="Etiqueta" value={value.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
          <TextField label="Título de la página" value={value.title} onChange={(title) => set({ title })} />
          <TextField label="Título del formulario" value={value.formTitle} onChange={(formTitle) => set({ formTitle })} />
          <TextField label="Subtítulo del formulario" value={value.formSubtitle} onChange={(formSubtitle) => set({ formSubtitle })} />
          <TextField label="Texto de aceptación de privacidad" value={value.privacyText} onChange={(privacyText) => set({ privacyText })} />
          <TextField label="Nota de confirmación pendiente" value={value.pendingNote} onChange={(pendingNote) => set({ pendingNote })} />
          <TextField label="Título al terminar" value={value.successTitle} onChange={(successTitle) => set({ successTitle })} />
          <TextField label="Mensaje al terminar" value={value.successText} onChange={(successText) => set({ successText })} />
        </Grid>
      </Panel>
    </>
  )
}

export function LegalSection({ value, onChange }: { value: SiteContent['legal']; onChange: (v: SiteContent['legal']) => void }) {
  return (
    <Panel title="Páginas legales" description="Usa «## » para subtítulos y «- » para listas.">
      <ListEditor
        items={value}
        onChange={onChange}
        addLabel="Agregar página"
        itemTitle={(p) => `${p.title} · /legal/${p.slug}`}
        create={() => ({ slug: `pagina-${Date.now().toString(36)}`, title: 'Nueva página', intro: '', body: '', updated: '' })}
        renderItem={(p, update) => (
          <>
            <Grid>
              <TextField label="Título" value={p.title} onChange={(title) => update({ title })} />
              <TextField
                label="Identificador en la URL"
                value={p.slug}
                onChange={(slug) => update({ slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              />
            </Grid>
            <TextField label="Introducción" multiline value={p.intro} onChange={(intro) => update({ intro })} />
            <TextField label="Contenido" multiline rows={12} value={p.body} onChange={(body) => update({ body })} />
            <TextField label="Última actualización" value={p.updated} onChange={(updated) => update({ updated })} placeholder="septiembre 2026" />
          </>
        )}
      />
    </Panel>
  )
}
