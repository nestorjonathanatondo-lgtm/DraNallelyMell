'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Clock, Loader2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { btnOutline, btnPrimary } from '@/lib/ui'
import { formatLongDate, formatTime, slotsForDay, toISODate } from '@/lib/schedule'
import type { Appointment, SiteContent, Treatment } from '@/lib/types'
import { IntakeFields } from './intake-fields'

const STEPS = ['Tratamiento', 'Fecha y hora', 'Tus datos', 'Confirmación']
const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Props = {
  treatments: Treatment[]
  categories: string[]
  booking: SiteContent['booking']
  initialSlug?: string
  whatsapp: string
  whatsappNumber: string
}

export function BookingWizard({ treatments, categories, booking, initialSlug, whatsapp, whatsappNumber }: Props) {
  const initial = treatments.find((t) => t.slug === initialSlug)
  const [step, setStep] = useState(initial ? 1 : 0)
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(booking.fields.filter((f) => f.type === 'choice' && f.options[0]).map((f) => [f.id, f.options[0]])),
  )
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Appointment | null>(null)

  const treatment = treatments.find((t) => t.slug === slug)

  const requiredOk = booking.fields.every((f) => !f.required || (values[f.id] ?? '').trim().length > 0)
  const canContinue = [Boolean(treatment), Boolean(date && time), requiredOk && accepted, true][step]

  const submit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ treatmentSlug: slug, date, time, data: values, accepted }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'No pudimos registrar tu cita. Intenta de nuevo.')
        if (res.status === 409) {
          setTime('')
          setStep(1)
        }
        return
      }
      setResult(json.appointment)
      setStep(3)
    } catch {
      setError('No pudimos registrar tu cita. Revisa tu conexión.')
    } finally {
      setSubmitting(false)
    }
  }

  const next = () => (step === 2 ? submit() : setStep((s) => Math.min(s + 1, 3)))

  return (
    <div className="flex flex-col gap-10">
      <ol className="grid grid-cols-4 gap-2 md:gap-3">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-col gap-2" aria-current={i === step ? 'step' : undefined}>
            <span className={cn('h-1 rounded-full', i <= step ? 'bg-accent-light' : 'bg-border')} />
            <span className={cn('text-[10px] font-semibold uppercase tracking-[0.14em] md:text-xs', i === step ? 'text-foreground' : 'text-muted-foreground')}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span className="hidden sm:inline"> · {label}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-8">
          {step === 0 && <TreatmentStep treatments={treatments} categories={categories} slug={slug} onSelect={setSlug} />}
          {step === 1 && (
            <DateStep
              booking={booking}
              date={date}
              time={time}
              onDate={(d) => {
                setDate(d)
                setTime('')
              }}
              onTime={setTime}
            />
          )}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl">{booking.formTitle}</h2>
                <p className="text-muted-foreground">{booking.formSubtitle}</p>
              </div>
              <IntakeFields fields={booking.fields} values={values} onChange={(id, v) => setValues((prev) => ({ ...prev, [id]: v }))} />
              <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mt-1 size-4 accent-[var(--foreground)]"
                  required
                />
                <span>
                  {booking.privacyText}{' '}
                  <Link href="/legal/aviso-de-privacidad" target="_blank" className="text-foreground underline underline-offset-2">
                    Ver aviso de privacidad
                  </Link>{' '}
                  *
                </span>
              </label>
            </div>
          )}
          {step === 3 && result && (
            <div className="flex flex-col items-start gap-5 rounded-3xl border border-border bg-card p-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-accent-light/30 text-accent">
                <Check className="size-6" aria-hidden="true" />
              </span>
              <h2 className="text-3xl">{booking.successTitle}</h2>
              <p className="text-muted-foreground">{booking.successText}</p>
              <div className="rounded-2xl bg-muted px-6 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Tu folio</p>
                <p className="font-serif text-3xl tracking-wide">{result.folio}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hola, acabo de agendar ${result.treatmentName} el ${formatLongDate(result.date)} a las ${formatTime(result.time)}. Mi folio es ${result.folio}.`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={btnPrimary}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Confirmar por WhatsApp
                </a>
                <Link href="/mi-cita" className={btnOutline}>
                  Consultar mi cita
                </Link>
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </p>
          )}

          {step < 3 && (
            <div className="flex items-center justify-between gap-3">
              {step > 0 ? (
                <button type="button" onClick={() => setStep((s) => s - 1)} className={btnOutline}>
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Regresar
                </button>
              ) : (
                <a href={whatsapp} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground underline underline-offset-4">
                  ¿Dudas? Escríbenos
                </a>
              )}
              <button type="button" onClick={next} disabled={!canContinue || submitting} className={btnPrimary}>
                {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                {step === 2 ? 'Confirmar cita' : 'Continuar'}
                {step === 2 ? <Check className="size-4" aria-hidden="true" /> : <ArrowRight className="size-4" aria-hidden="true" />}
              </button>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24">
          <h2 className="eyebrow font-sans">Resumen de tu cita</h2>
          <dl className="mt-5 flex flex-col gap-4 text-sm">
            <SummaryRow label="Tratamiento" value={treatment?.name} />
            <SummaryRow label="Duración" value={treatment?.duration} />
            <SummaryRow label="Fecha" value={date ? formatLongDate(date) : undefined} />
            <SummaryRow label="Hora" value={time ? formatTime(time) : undefined} />
            <SummaryRow label="Inversión" value={treatment?.price} />
          </dl>
          <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">{booking.pendingNote}</p>
        </aside>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value || '—'}</dd>
    </div>
  )
}

function TreatmentStep({
  treatments,
  categories,
  slug,
  onSelect,
}: {
  treatments: Treatment[]
  categories: string[]
  slug: string
  onSelect: (slug: string) => void
}) {
  const groups = categories
    .map((c) => ({ category: c, items: treatments.filter((t) => t.category === c) }))
    .filter((g) => g.items.length)
  const orphans = treatments.filter((t) => !categories.includes(t.category))
  if (orphans.length) groups.push({ category: 'Otros', items: orphans })

  return (
    <div className="flex flex-col gap-8">
      <p className="text-muted-foreground">
        Si no estás segura(o), elige <strong className="text-foreground">Consulta de Valoración</strong>.
      </p>
      {groups.map((group) => (
        <fieldset key={group.category} className="flex flex-col gap-3">
          <legend className="eyebrow mb-3">{group.category}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((t) => (
              <label
                key={t.slug}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 transition-colors',
                  slug === t.slug ? 'border-foreground ring-1 ring-foreground' : 'border-border hover:border-accent-light',
                )}
              >
                <input type="radio" name="treatment" value={t.slug} checked={slug === t.slug} onChange={() => onSelect(t.slug)} className="sr-only" />
                <span
                  className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border',
                    slug === t.slug ? 'border-foreground bg-foreground text-background' : 'border-border',
                  )}
                >
                  {slug === t.slug && <Check className="size-3" aria-hidden="true" />}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-medium">{t.name}</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3" aria-hidden="true" />
                    {t.duration} · {t.price}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

function DateStep({
  booking,
  date,
  time,
  onDate,
  onTime,
}: {
  booking: SiteContent['booking']
  date: string
  time: string
  onDate: (d: string) => void
  onTime: (t: string) => void
}) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const lastDay = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() + (booking.maxDaysAhead || 60))
    return d
  }, [today, booking.maxDaysAhead])
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const { data, isLoading } = useSWR<{ taken: string[] }>(date ? `/api/appointments/availability?date=${date}` : null, fetcher)

  const days = useMemo(() => {
    const first = new Date(cursor)
    const offset = (first.getDay() + 6) % 7
    const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate()
    const cells: (Date | null)[] = Array.from({ length: offset }, () => null)
    for (let d = 1; d <= total; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d))
    return cells
  }, [cursor])

  const isAvailable = (d: Date) => d >= today && d <= lastDay && booking.schedule[d.getDay()]?.open

  const selected = date ? new Date(`${date}T00:00:00`) : null
  const now = new Date()
  const slots = selected
    ? slotsForDay(booking.schedule[selected.getDay()], booking.slotMinutes).filter((s) => {
        if (toISODate(selected) !== toISODate(now)) return true
        const [h, m] = s.split(':').map(Number)
        return h * 60 + m > now.getHours() * 60 + now.getMinutes() + 30
      })
    : []
  const taken = new Set(data?.taken ?? [])

  const canPrev = cursor > new Date(today.getFullYear(), today.getMonth(), 1)
  const canNext = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) <= lastDay

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr]">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            disabled={!canPrev}
            className="flex size-9 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <p className="font-serif text-lg first-letter:uppercase">
            {cursor.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
          </p>
          <button
            type="button"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            disabled={!canNext}
            className="flex size-9 items-center justify-center rounded-full hover:bg-muted disabled:opacity-30"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <span key={i} className="py-2 text-[11px] font-semibold text-muted-foreground">
              {d}
            </span>
          ))}
          {days.map((d, i) =>
            d ? (
              <button
                key={i}
                type="button"
                disabled={!isAvailable(d)}
                onClick={() => onDate(toISODate(d))}
                aria-label={d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                aria-pressed={date === toISODate(d)}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-full text-sm transition-colors disabled:text-muted-foreground/40',
                  date === toISODate(d) ? 'bg-foreground text-background' : 'enabled:hover:bg-muted',
                  toISODate(d) === toISODate(today) && date !== toISODate(d) && 'ring-1 ring-accent-light',
                )}
              >
                {d.getDate()}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">Horarios disponibles</h2>
        {!date && <p className="text-muted-foreground">Selecciona un día en el calendario.</p>}
        {date && isLoading && <Loader2 className="size-5 animate-spin text-muted-foreground" aria-label="Cargando horarios" />}
        {date && !isLoading && slots.length === 0 && <p className="text-muted-foreground">No hay horarios disponibles este día.</p>}
        {date && !isLoading && slots.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((s) => {
              const busy = taken.has(s)
              return (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  onClick={() => onTime(s)}
                  aria-pressed={time === s}
                  className={cn(
                    'h-11 rounded-full border text-sm transition-colors disabled:cursor-not-allowed disabled:line-through disabled:opacity-40',
                    time === s ? 'border-foreground bg-foreground text-background' : 'border-border bg-card enabled:hover:border-accent-light',
                  )}
                >
                  {formatTime(s)}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
