'use client'

import { cn } from '@/lib/utils'
import type { IntakeField } from '@/lib/types'

const inputClass =
  'w-full rounded-2xl border border-border bg-card px-4 text-base outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent-light focus:ring-2 focus:ring-ring/40'

export function IntakeFields({
  fields,
  values,
  onChange,
}: {
  fields: IntakeField[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((field) => {
        const id = `field-${field.id}`
        const wide = field.type === 'textarea' || field.type === 'choice' || field.type === 'text'
        const value = values[field.id] ?? ''
        const label = (
          <span className="text-sm font-medium">
            {field.label}
            {field.required && ' *'}
          </span>
        )
        return (
          <div key={field.id} className={cn('flex flex-col gap-2', wide && 'sm:col-span-2')}>
            {field.type === 'choice' ? (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2">{label}</legend>
                <div className="flex flex-wrap gap-2">
                  {field.options.map((option) => (
                    <label
                      key={option}
                      className={cn(
                        'cursor-pointer rounded-full px-4 py-2.5 text-sm transition-colors',
                        value === option ? 'bg-foreground text-background' : 'bg-muted hover:bg-border',
                      )}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name={field.id}
                        value={option}
                        checked={value === option}
                        onChange={() => onChange(field.id, option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : (
              <>
                <label htmlFor={id}>{label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={id}
                    rows={4}
                    maxLength={1000}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    className={cn(inputClass, 'py-3 leading-relaxed')}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={id}
                    required={field.required}
                    value={value}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    className={cn(inputClass, 'h-12')}
                  >
                    <option value="">{field.placeholder || 'Selecciona una opción'}</option>
                    {field.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    type={field.type}
                    maxLength={200}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={value}
                    autoComplete={field.id === 'name' ? 'name' : field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : undefined}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    className={cn(inputClass, 'h-12')}
                  />
                )}
              </>
            )}
            {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
          </div>
        )
      })}
    </div>
  )
}
