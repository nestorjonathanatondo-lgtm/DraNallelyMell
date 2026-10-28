'use client'

import { useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { btnOutline, btnPrimary } from '@/lib/ui'
import { formatLongDate, formatTime } from '@/lib/schedule'

type Found = { folio: string; treatmentName: string; date: string; time: string; status: string }

const inputClass =
  'h-12 w-full rounded-2xl border border-border bg-card px-4 text-base uppercase outline-none placeholder:normal-case placeholder:text-muted-foreground/70 focus:border-accent-light focus:ring-2 focus:ring-ring/40'

const STATUS: Record<string, string> = {
  pendiente: 'Pendiente de confirmación',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  completada: 'Completada',
}

export function AppointmentLookup() {
  const [folio, setFolio] = useState('')
  const [phone, setPhone] = useState('')
  const [found, setFound] = useState<Found | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const call = async (action: 'lookup' | 'cancel') => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/appointments/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folio: folio.trim().toUpperCase(), phone, action }),
      })
      const json = await res.json()
      if (!res.ok) {
        setFound(null)
        setError(json.error ?? 'No encontramos tu cita.')
        return
      }
      setFound(json.appointment)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          call('lookup')
        }}
        className="grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="folio" className="text-sm font-medium">Folio</label>
          <input id="folio" required value={folio} onChange={(e) => setFolio(e.target.value)} placeholder="NM-XXXXXX" className={inputClass} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium">Teléfono</label>
          <input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="844 123 4567" className={inputClass} />
        </div>
        <button type="submit" disabled={loading} className={btnPrimary}>
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Search className="size-4" aria-hidden="true" />}
          Buscar
        </button>
      </form>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {found && (
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6">
          <p className="eyebrow">Folio {found.folio}</p>
          <h2 className="text-3xl">{found.treatmentName}</h2>
          <p className="text-muted-foreground first-letter:uppercase">
            {formatLongDate(found.date)} · {formatTime(found.time)}
          </p>
          <p className="self-start rounded-full bg-muted px-4 py-1.5 text-sm">{STATUS[found.status] ?? found.status}</p>
          {(found.status === 'pendiente' || found.status === 'confirmada') && (
            <button type="button" onClick={() => call('cancel')} disabled={loading} className={`${btnOutline} self-start`}>
              Cancelar cita
            </button>
          )}
        </div>
      )}
    </div>
  )
}
