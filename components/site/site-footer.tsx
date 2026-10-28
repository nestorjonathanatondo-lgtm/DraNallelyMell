import Link from 'next/link'
import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { mapsLink, whatsappLink } from '@/lib/content'
import { cn } from '@/lib/utils'
import { container } from '@/lib/ui'
import type { SiteContent } from '@/lib/types'
import { BrandLogo } from './brand-logo'

export function SiteFooter({ content }: { content: SiteContent }) {
  const { brand, contact, footer, legal } = content
  const year = new Date().getFullYear()
  return (
    <footer className="bg-dark text-dark-foreground">
      <div className={cn(container, 'grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4')}>
        <div className="flex flex-col gap-5">
          <BrandLogo brand={brand} inverted />
          <p className="max-w-xs leading-relaxed text-dark-foreground/65">{footer.description}</p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Navegación</h2>
          <ul className="flex flex-col gap-3 text-dark-foreground/80">
            <li><Link href="/tratamientos" className="hover:text-accent-light">Tratamientos</Link></li>
            <li><Link href="/resultados" className="hover:text-accent-light">Resultados</Link></li>
            <li><Link href="/agendar" className="hover:text-accent-light">Agendar cita</Link></li>
            <li><Link href="/mi-cita" className="hover:text-accent-light">Mi cita</Link></li>
            <li><Link href="/contacto" className="hover:text-accent-light">Contacto</Link></li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Legal</h2>
          <ul className="flex flex-col gap-3 text-dark-foreground/80">
            {legal.map((page) => (
              <li key={page.slug}>
                <Link href={`/legal/${page.slug}`} className="hover:text-accent-light">
                  {page.title}
                </Link>
              </li>
            ))}
            {contact.catalogUrl && (
              <li>
                <a href={contact.catalogUrl} target="_blank" rel="noreferrer" className="hover:text-accent-light">
                  Catálogo digital
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">Contacto</h2>
          <ul className="flex flex-col gap-3 text-dark-foreground/80">
            <li>
              <a href={mapsLink(content)} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-accent-light">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{contact.address} · {contact.city}</span>
              </a>
            </li>
            <li>
              <a href={`tel:${contact.phone}`} className="flex gap-3 hover:text-accent-light">
                <Phone className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappLink(content)} target="_blank" rel="noreferrer" className="flex gap-3 hover:text-accent-light">
                <MessageCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                WhatsApp
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {contact.hoursShort}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-dark-foreground/10">
        <div className={cn(container, 'flex flex-col gap-2 py-6 text-xs text-dark-foreground/55 md:flex-row md:justify-between')}>
          <p>© {year} {brand.name} {brand.nameAccent} · {brand.tagline}. Todos los derechos reservados.</p>
          <p>{footer.legalNote}</p>
        </div>
      </div>
    </footer>
  )
}
