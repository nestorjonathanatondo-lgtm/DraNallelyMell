'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Download, Loader2, MessageCircle, Phone, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatLongDate, formatTime } from '@/lib/schedule'
import type { Appointment, AppointmentStatus, IntakeField } from '@/lib/types'
import { Panel } from './fields'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('No autorizado')
  return res.json()
}

const STATUS: { value: AppointmentStatus; label: string; className: string }[] = [
  { value: 'pendiente', label: 'Pendiente', className: 'bg-accent-light/25 text-accent' },
  { value: 'confirmada', label: 'Confirmada', className: 'bg-foreground text-background' },
  { value: 'completada', label: 'Completada', className: 'bg-muted text-foreground' },
  { value: 'cancelada', label: 'Cancelada', className: 'bg-destructive/10 text-destructive' },
]

export function AppointmentsPanel({ fields }: { fields: IntakeField[] }) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<Appointment[]>('/api/admin/appointments', fetcher)
  const [filter, setFilter] = useState<AppointmentStatus | 'todas' | 'proximas'>('proximas')
  const [query, setQuery] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const list = useMemo(() => {
    let items = data ?? []
    if (filter === 'proximas') items = items.filter((a) => a.date >= today && a.status !== 'cancelada')
    else if (filter !== 'todas') items = items.filter((a) => a.status === filter)
    if (query) {
      const q = query.toLowerCase()
      items = items.filter((a) => `${a.folio} ${a.treatmentName} ${Object.values(a.data).join(' ')}`.toLowerCase().includes(q))
    }
    return [...items].sort((a, b) => (filter === 'proximas' ? `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`) : b.createdAt.localeCompare(a.createdAt)))
  }, [data, filter, query, today])

  const patch = async (folio: string, body: Partial<Appointment>) => {
    const res = await fetch('/api/admin/appointments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folio, ...body }),
    })
    if (!res.ok) return toast.error('No se pudo actualizar')
    mutate()
    toast.success('Cita actualizada')
  }

  const remove = async (folio: string) => {
    if (!confirm(`¿Eliminar la cita ${folio}? Esta acción no se puede deshacer.`)) return
    await fetch(`/api/admin/appointments?folio=${encodeURIComponent(folio)}`, { method: 'DELETE' })
    mutate()
  }

  const exportCsv = () => {
    const headers = ['Folio', 'Estado', 'Tratamiento', 'Fecha', 'Hora', ...fields.map((f) => f.label), 'Notas', 'Creada']
    const rows = (data ?? []).map((a) => [a.folio, a.status, a.treatmentName, a.date, a.time, ...fields.map((f) => a.data[f.id] ?? ''), a.notes, a.createdAt])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `citas-${today}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Panel
      title="Citas recibidas"
      description="Solicitudes enviadas desde la hoja de recepción en línea."
      actions={
        <div className="flex gap-2">
          <button type="button" onClick={() => mutate()} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs">
            <RefreshCw className={cn('size-3.5', isValidating && 'animate-spin')} aria-hidden="true" />
            Actualizar
          </button>
          <button type="button" onClick={exportCsv} disabled={!data?.length} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs disabled:opacity-40">
            <Download className="size-3.5" aria-hidden="true" />
            Exportar CSV
          </button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        {[
          { value: 'proximas', label: 'Próximas' },
          { value: 'todas', label: 'Todas' },
          ...STATUS.map((s) => ({ value: s.value, label: s.label })),
        ].map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value as typeof filter)}
            className={cn('rounded-full px-3 py-1.5 text-xs', filter === f.value ? 'bg-foreground text-background' : 'bg-muted')}
          >
            {f.label}
          </button>
        ))}
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar nombre, folio…" aria-label="Buscar cita" className="ml-auto h-9 w-56 bg-background" />
      </div>

      {isLoading && <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Cargando" />}
      {error && <p className="text-sm text-destructive">No se pudieron cargar las citas.</p>}
      {!isLoading && list.length === 0 && <p className="rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">No hay citas en esta vista.</p>}

      <ul className="flex flex-col gap-3">
        {list.map((a) => {
          const status = STATUS.find((s) => s.value === a.status)
          const phone = (a.data.phone ?? '').replace(/\D/g, '')
          const waPhone = phone.length === 10 ? `52${phone}` : phone
          return (
            <li key={a.folio} className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-mono text-muted-foreground">{a.folio}</p>
                  <p className="font-semibold">{a.data.name || 'Sin nombre'}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.treatmentName} · {formatLongDate(a.date)} · {formatTime(a.time)}
                  </p>
                </div>
                <span className={cn('rounded-full px-3 py-1 text-xs font-medium', status?.className)}>{status?.label}</span>
              </div>
              <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {fields
                  .filter((f) => f.id !== 'name' && a.data[f.id])
                  .map((f) => (
                    <div key={f.id} className="flex flex-col">
                      <dt className="text-xs text-muted-foreground">{f.label}</dt>
                      <dd className="break-words">{a.data[f.id]}</dd>
                    </div>
                  ))}
              </dl>
              <NotesField initial={a.notes} onSave={(notes) => patch(a.folio, { notes })} />
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={a.status}
                  onChange={(e) => patch(a.folio, { status: e.target.value as AppointmentStatus })}
                  aria-label="Cambiar estado"
                  className="h-9 rounded-lg border border-input bg-card px-2 text-sm"
                >
                  {STATUS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {phone && (
                  <>
                    <a
                      href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hola ${a.data.name ?? ''}, te escribimos del consultorio de la Dra. Nallely Mellado para confirmar tu cita de ${a.treatmentName} el ${formatLongDate(a.date)} a las ${formatTime(a.time)}. Folio ${a.folio}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs text-primary-foreground"
                    >
                      <MessageCircle className="size-3.5" aria-hidden="true" />
                      WhatsApp
                    </a>
                    <a href={`tel:${phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs">
                      <Phone className="size-3.5" aria-hidden="true" />
                      Llamar
                    </a>
                  </>
                )}
                <button type="button" onClick={() => remove(a.folio)} className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Eliminar
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}

function NotesField({ initial, onSave }: { initial: string; onSave: (v: string) => void }) {
  const [value, setValue] = useState(initial)
  return (
    <div className="flex gap-2">
      <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Notas internas" aria-label="Notas internas" className="h-9 bg-card" />
      {value !== initial && (
        <button type="button" onClick={() => onSave(value)} className="h-9 shrink-0 rounded-lg bg-primary px-3 text-xs text-primary-foreground">
          Guardar nota
        </button>
      )}
    </div>
  )
}
