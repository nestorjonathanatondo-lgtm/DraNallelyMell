
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  ClipboardList,
  ExternalLink,
  FileText,
  Footprints,
  HelpCircle,
  Home,
  Images,
  Loader2,
  LogOut,
  MapPin,
  Megaphone,
  Palette,
  Quote,
  RotateCcw,
  Save,
  Sparkles,
  Stamp,
  Stethoscope,
  UserRound,
  Video,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SiteContent } from '@/lib/types'
import { AppointmentsPanel } from './appointments-panel'
import { BookingSection, LegalSection } from './sections-booking'
import { BrandSection, ContactSection, ThemeSection } from './sections-general'
import {
  AboutSection,
  CtaFooterSection,
  FaqSection,
  HeroSection,
  PillarsSection,
  ResultsSectionEditor,
  StepsSection,
  TestimonialsSection,
  VascularSection,
} from './sections-home'
import { TreatmentsSection } from './sections-treatments'

const SECTIONS = [
  { id: 'citas', label: 'Citas', icon: CalendarCheck, group: 'Gestión' },
  { id: 'recepcion', label: 'Hoja de recepción', icon: ClipboardList, group: 'Gestión' },
  { id: 'marca', label: 'Marca y logo', icon: Stamp, group: 'Identidad' },
  { id: 'tema', label: 'Colores y tipografía', icon: Palette, group: 'Identidad' },
  { id: 'contacto', label: 'Contacto y mapa', icon: MapPin, group: 'Identidad' },
  { id: 'portada', label: 'Portada', icon: Home, group: 'Contenido' },
  { id: 'pilares', label: 'Pilares', icon: Sparkles, group: 'Contenido' },
  { id: 'tratamientos', label: 'Tratamientos', icon: Stethoscope, group: 'Contenido' },
  { id: 'resultados', label: 'Antes y después', icon: Images, group: 'Contenido' },
  { id: 'destacado', label: 'Sección escleroterapia', icon: Video, group: 'Contenido' },
  { id: 'pasos', label: 'Pasos', icon: Footprints, group: 'Contenido' },
  { id: 'sobre', label: 'Sobre la Dra.', icon: UserRound, group: 'Contenido' },
  { id: 'testimonios', label: 'Testimonios', icon: Quote, group: 'Contenido' },
  { id: 'faq', label: 'Preguntas frecuentes', icon: HelpCircle, group: 'Contenido' },
  { id: 'cierre', label: 'Llamado final y pie', icon: Megaphone, group: 'Contenido' },
  { id: 'legal', label: 'Páginas legales', icon: FileText, group: 'Contenido' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

export function AdminPanel({ initialContent, persistent }: { initialContent: SiteContent; persistent: boolean }) {
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [saved, setSaved] = useState(() => JSON.stringify(initialContent))
  const [section, setSection] = useState<SectionId>('citas')
  const [saving, setSaving] = useState(false)
  const dirty = JSON.stringify(content) !== saved

  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const update = <K extends keyof SiteContent>(key: K) => (value: SiteContent[K]) => setContent((c) => ({ ...c, [key]: value }))

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      const json = await res.json()
      if (res.status === 401) {
        toast.error('Tu sesión expiró. Vuelve a entrar.')
        router.push('/')
        return
      }
      if (!res.ok) {
        toast.error(json.error ?? 'No se pudo guardar')
        return
      }
      setContent(json)
      setSaved(JSON.stringify(json))
      toast.success('Cambios publicados en el sitio')
      router.refresh()
    } catch {
      toast.error('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const reset = async () => {
    if (!confirm('¿Restablecer TODO el contenido al diseño original? Las citas no se borran.')) return
    const res = await fetch('/api/admin/content', { method: 'DELETE' })
    if (res.ok) {
      const json = await res.json()
      setContent(json)
      setSaved(JSON.stringify(json))
      toast.success('Contenido restablecido')
      router.refresh()
    }
  }

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const groups = [...new Set(SECTIONS.map((s) => s.group))]
  const current = SECTIONS.find((s) => s.id === section)

  return (
    <div className="min-h-dvh bg-muted/50">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex h-16 items-center gap-3 px-4 md:px-6">
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="font-serif text-lg">Panel de administración</span>
            <span className="truncate text-xs text-muted-foreground">
              {content.brand.name} {content.brand.nameAccent}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {dirty && <span className="hidden text-xs text-accent sm:inline">Cambios sin guardar</span>}
            <Link href="/" target="_blank" className="hidden h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs sm:inline-flex">
              <ExternalLink className="size-3.5" aria-hidden="true" />
              Ver sitio
            </Link>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground disabled:opacity-40"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" aria-hidden="true" /> : <Save className="size-3.5" aria-hidden="true" />}
              Guardar
            </button>
            <button type="button" onClick={logout} title="Cerrar sesión" className="flex size-9 items-center justify-center rounded-lg border border-border">
              <LogOut className="size-4" aria-hidden="true" />
              <span className="sr-only">Cerrar sesión</span>
            </button>
          </div>
        </div>
        <nav aria-label="Secciones" className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 lg:hidden">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={cn('shrink-0 rounded-full px-3 py-1.5 text-xs', section === s.id ? 'bg-foreground text-background' : 'bg-muted')}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-card p-4 lg:flex">
          {groups.map((group) => (
            <div key={group} className="flex flex-col gap-1">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group}</p>
              {SECTIONS.filter((s) => s.group === group).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  aria-current={section === s.id ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                    section === s.id ? 'bg-foreground text-background' : 'hover:bg-muted',
                  )}
                >
                  <s.icon className="size-4" aria-hidden="true" />
                  {s.label}
                </button>
              ))}
            </div>
          ))}
          <button type="button" onClick={reset} className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-muted-foreground hover:bg-muted">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Restablecer diseño original
          </button>
        </aside>

        <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 p-4 pb-24 md:p-8">
          {!persistent && (
            <p className="rounded-xl border border-accent-light/50 bg-accent-light/10 p-4 text-sm leading-relaxed">
              Almacenamiento local activo: los cambios se guardan en esta vista previa. Para guardarlos en el sitio publicado, conecta Vercel Blob en la configuración del proyecto.
            </p>
          )}
          <h1 className="font-serif text-3xl">{current?.label}</h1>

          {section === 'citas' && <AppointmentsPanel fields={content.booking.fields} />}
          {section === 'recepcion' && <BookingSection value={content.booking} onChange={update('booking')} />}
          {section === 'marca' && <BrandSection value={content.brand} onChange={update('brand')} />}
          {section === 'tema' && <ThemeSection value={content.theme} onChange={update('theme')} />}
          {section === 'contacto' && (
            <ContactSection value={content.contact} onChange={update('contact')} location={content.location} onLocation={update('location')} />
          )}
          {section === 'portada' && <HeroSection value={content.hero} onChange={update('hero')} />}
          {section === 'pilares' && <PillarsSection value={content.pillars} onChange={update('pillars')} />}
          {section === 'tratamientos' && (
            <TreatmentsSection
              section={content.treatmentsSection}
              categories={content.categories}
              treatments={content.treatments}
              onSection={update('treatmentsSection')}
              onCategories={update('categories')}
              onTreatments={update('treatments')}
            />
          )}
          {section === 'resultados' && <ResultsSectionEditor value={content.results} onChange={update('results')} />}
          {section === 'destacado' && (
            <VascularSection value={content.vascular} onChange={update('vascular')} slugs={content.treatments.map((t) => t.slug)} />
          )}
          {section === 'pasos' && <StepsSection value={content.steps} onChange={update('steps')} />}
          {section === 'sobre' && <AboutSection value={content.about} onChange={update('about')} />}
          {section === 'testimonios' && <TestimonialsSection value={content.testimonials} onChange={update('testimonials')} />}
          {section === 'faq' && <FaqSection value={content.faq} onChange={update('faq')} />}
          {section === 'cierre' && (
            <CtaFooterSection cta={content.cta} footer={content.footer} onCta={update('cta')} onFooter={update('footer')} />
          )}
          {section === 'legal' && <LegalSection value={content.legal} onChange={update('legal')} />}

          <button type="button" onClick={reset} className="flex items-center gap-2 self-start text-xs text-muted-foreground lg:hidden">
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Restablecer diseño original
          </button>
        </main>
      </div>

      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 shadow-2xl md:hidden">
          <span className="text-sm text-accent">Cambios sin guardar</span>
          <button type="button" onClick={save} disabled={saving} className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-primary px-5 text-sm text-primary-foreground">
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />}
            Guardar
          </button>
        </div>
      )}
    </div>
  )
}
