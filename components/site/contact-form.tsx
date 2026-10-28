'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { btnPrimary } from '@/lib/ui'

const inputClass =
  'h-12 w-full rounded-2xl border border-border bg-card px-4 text-base outline-none placeholder:text-muted-foreground/70 focus:border-accent-light focus:ring-2 focus:ring-ring/40'

export function ContactForm({ whatsappNumber, treatments }: { whatsappNumber: string; treatments: string[] }) {
  const [name, setName] = useState('')
  const [interest, setInterest] = useState('')
  const [message, setMessage] = useState('')

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const text = [`Hola Dra. Nallely Mellado, soy ${name}.`, interest && `Me interesa: ${interest}.`, message].filter(Boolean).join(' ')
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="c-name" className="text-sm font-medium">Nombre *</label>
        <input id="c-name" required maxLength={120} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="c-interest" className="text-sm font-medium">Tratamiento de interés</label>
        <select id="c-interest" value={interest} onChange={(e) => setInterest(e.target.value)} className={inputClass}>
          <option value="">Aún no lo sé</option>
          {treatments.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="c-message" className="text-sm font-medium">Mensaje</label>
        <textarea
          id="c-message"
          rows={4}
          maxLength={800}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} h-auto py-3 leading-relaxed`}
        />
      </div>
      <button type="submit" className={btnPrimary}>
        <MessageCircle className="size-4" aria-hidden="true" />
        Enviar por WhatsApp
      </button>
    </form>
  )
}
