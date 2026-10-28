'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { container } from '@/lib/ui'
import type { SiteContent } from '@/lib/types'
import { AdminGesture } from './admin-gesture'
import { BrandLogo } from './brand-logo'

const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/tratamientos', label: 'Tratamientos' },
  { href: '/resultados', label: 'Resultados' },
  { href: '/#sobre', label: 'Sobre la Dra.' },
  { href: '/contacto', label: 'Contacto' },
]

export function SiteHeader({ brand, contact }: { brand: SiteContent['brand']; contact: SiteContent['contact'] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al contenido
      </a>
      <div className={cn(container, 'flex h-18 items-center justify-between gap-6')}>
        <AdminGesture>
          <Link href="/" aria-label={`${brand.name} ${brand.nameAccent}, inicio`} draggable={false}>
            <BrandLogo brand={brand} />
          </Link>
        </AdminGesture>

        <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => {
            const active = item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href) && !item.href.includes('#'))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm text-foreground/80 transition-colors hover:text-accent',
                  active && 'text-foreground underline decoration-accent-light underline-offset-8',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${contact.phone}`}
            className="hidden items-center gap-2 text-sm text-foreground/80 hover:text-accent md:flex lg:hidden xl:flex"
          >
            <Phone className="size-4" aria-hidden="true" />
            {contact.phoneDisplay}
          </a>
          <Link
            href="/agendar"
            className="hidden h-9 items-center gap-2 rounded-full bg-primary px-4 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-primary/85 sm:inline-flex"
          >
            Agendar cita
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            <span className="sr-only">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>
      <div className="flex justify-center border-t border-border/70 py-2" aria-label="Logo oficial Dra. Nallely Mellado">
        {/* Official brand mark supplied by the site owner. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Meta_AI_DRA_NALLELY_3000px_REDONDO_BLANCO_FINAL_20261026_214505-rd3Vge1AZJlnQZZpiKng4aMpyWpsE3.png"
          alt="Logo oficial Dra. Nallely Mellado"
          width={50}
          height={50}
          className="size-[50px] object-contain"
          draggable={false}
        />
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background lg:hidden">
          <nav aria-label="Móvil" className={cn(container, 'flex flex-col py-4')}>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="border-b border-border py-4 font-serif text-xl">
                {item.label}
              </Link>
            ))}
            <Link href="/mi-cita" className="border-b border-border py-4 font-serif text-xl">
              Mi cita
            </Link>
            <Link
              href="/agendar"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground"
            >
              Agendar cita
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
