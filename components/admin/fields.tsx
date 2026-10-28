'use client'

import { useId, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, ImageIcon, Loader2, Plus, Trash2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export function Panel({ title, description, children, actions }: { title: string; description?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="font-sans text-base font-semibold">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}

export function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return <div className={cn('grid gap-4', cols === 2 && 'md:grid-cols-2', cols === 3 && 'md:grid-cols-3')}>{children}</div>
}

export function TextField({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
  placeholder,
  help,
  type = 'text',
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  rows?: number
  placeholder?: string
  help?: string
  type?: string
  className?: string
}) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {multiline ? (
        <Textarea id={id} rows={rows} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="bg-background leading-relaxed" />
      ) : (
        <Input id={id} type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="h-10 bg-background" />
      )}
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  )
}

export function NumberField({ label, value, onChange, min, max, step = 1, help }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; help?: string }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input id={id} type="number" min={min} max={max} step={step} value={Number.isFinite(value) ? value : 0} onChange={(e) => onChange(Number(e.target.value))} className="h-10 bg-background" />
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  )
}

export function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</Label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="h-10 rounded-lg border border-input bg-background px-2.5 text-sm">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

export function ToggleField({ label, checked, onChange, help }: { label: string; checked: boolean; onChange: (v: boolean) => void; help?: string }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3">
      <div className="flex flex-col">
        <Label htmlFor={id} className="text-sm">{label}</Label>
        {help && <p className="text-xs text-muted-foreground">{help}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId()
  const isHex = /^#[0-9a-f]{6}$/i.test(value)
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} (selector)`}
          value={isHex ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="size-10 shrink-0 cursor-pointer rounded-lg border border-input bg-background p-1"
        />
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} className="h-10 bg-background font-mono uppercase" />
      </div>
    </div>
  )
}

async function uploadFile(file: File) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error ?? 'Error al subir')
  return json.url as string
}

export function MediaField({
  label,
  value,
  onChange,
  kind = 'image',
  help,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  kind?: 'image' | 'video'
  help?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const id = useId()

  const onFile = async (file?: File) => {
    if (!file) return
    setBusy(true)
    try {
      onChange(await uploadFile(file))
      toast.success('Archivo subido. Recuerda guardar los cambios.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al subir')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex gap-3">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
          {value ? (
            kind === 'video' ? (
              <video src={value} muted className="size-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value || '/placeholder.svg'} alt="" className="size-full object-cover" />
            )
          ) : (
            <ImageIcon className="size-5 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Input id={id} value={value} placeholder="/img/... o https://..." onChange={(e) => onChange(e.target.value)} className="h-9 bg-background text-xs" />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Upload className="size-3.5" aria-hidden="true" />}
              Subir {kind === 'video' ? 'video' : 'imagen'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs">
                <X className="size-3.5" aria-hidden="true" />
                Quitar
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={kind === 'video' ? 'video/mp4,video/webm' : 'image/*'}
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>
      </div>
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  )
}

export function StringList({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            placeholder={placeholder}
            aria-label={`${label} ${i + 1}`}
            onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
            className="h-9 bg-background"
          />
          <IconButton label="Subir" disabled={i === 0} onClick={() => onChange(move(items, i, i - 1))}><ArrowUp className="size-3.5" /></IconButton>
          <IconButton label="Bajar" disabled={i === items.length - 1} onClick={() => onChange(move(items, i, i + 1))}><ArrowDown className="size-3.5" /></IconButton>
          <IconButton label="Eliminar" onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 className="size-3.5" /></IconButton>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])} className="inline-flex h-8 items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 text-xs">
        <Plus className="size-3.5" aria-hidden="true" />
        Agregar
      </button>
    </div>
  )
}

export function move<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items
  const copy = [...items]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

export function IconButton({ label, onClick, disabled, children, className }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn('flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-30', className)}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  )
}

export function ListEditor<T>({
  items,
  onChange,
  create,
  itemTitle,
  renderItem,
  addLabel = 'Agregar',
  defaultOpen = false,
}: {
  items: T[]
  onChange: (items: T[]) => void
  create: () => T
  itemTitle: (item: T, index: number) => string
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode
  addLabel?: string
  defaultOpen?: boolean
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen ? 0 : null)
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const open = openIndex === i
        const update = (patch: Partial<T>) => onChange(items.map((v, j) => (j === i ? { ...v, ...patch } : v)))
        return (
          <div key={i} className="rounded-xl border border-border bg-background">
            <div className="flex items-center gap-2 p-2 pl-3">
              <button type="button" onClick={() => setOpenIndex(open ? null : i)} className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm" aria-expanded={open}>
                <ChevronDown className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')} aria-hidden="true" />
                <span className="truncate">{itemTitle(item, i) || `Elemento ${i + 1}`}</span>
              </button>
              <IconButton label="Subir" disabled={i === 0} onClick={() => { onChange(move(items, i, i - 1)); setOpenIndex(null) }}><ArrowUp className="size-3.5" /></IconButton>
              <IconButton label="Bajar" disabled={i === items.length - 1} onClick={() => { onChange(move(items, i, i + 1)); setOpenIndex(null) }}><ArrowDown className="size-3.5" /></IconButton>
              <IconButton
                label="Eliminar"
                onClick={() => {
                  if (confirm('¿Eliminar este elemento?')) {
                    onChange(items.filter((_, j) => j !== i))
                    setOpenIndex(null)
                  }
                }}
              >
                <Trash2 className="size-3.5" />
              </IconButton>
            </div>
            {open && <div className="flex flex-col gap-4 border-t border-border p-4">{renderItem(item, update, i)}</div>}
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => {
          onChange([...items, create()])
          setOpenIndex(items.length)
        }}
        className="inline-flex h-9 items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 text-xs font-medium"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  )
}
