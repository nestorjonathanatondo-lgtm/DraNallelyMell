'use client'

import { BrandLogo } from '@/components/site/brand-logo'
import { BODY_FONTS, HEADING_FONTS, fontStack, googleFontsHref } from '@/lib/fonts'
import type { SiteContent } from '@/lib/types'
import { ColorField, Grid, MediaField, NumberField, Panel, TextField } from './fields'

type Props<K extends keyof SiteContent> = { value: SiteContent[K]; onChange: (v: SiteContent[K]) => void }

export function BrandSection({ value, onChange }: Props<'brand'>) {
  const set = (p: Partial<SiteContent['brand']>) => onChange({ ...value, ...p })
  return (
    <>
      <Panel title="Vista previa del logo" description="Así se ve en el encabezado del sitio. El logo es también la entrada oculta al panel.">
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border bg-background p-6">
          <BrandLogo brand={value} />
        </div>
        <div className="flex items-center gap-6 rounded-xl bg-dark p-6">
          <BrandLogo brand={value} inverted />
        </div>
      </Panel>
      <Panel title="Logo de texto" description="Se usa cuando no hay una imagen de logo.">
        <Grid cols={3}>
          <TextField label="Nombre" value={value.name} onChange={(name) => set({ name })} />
          <TextField label="Nombre en cursiva (acento)" value={value.nameAccent} onChange={(nameAccent) => set({ nameAccent })} />
          <TextField label="Lema" value={value.tagline} onChange={(tagline) => set({ tagline })} />
        </Grid>
      </Panel>
      <Panel title="Logo de imagen" description="Opcional. Si subes una imagen, sustituye al logo de texto (PNG o SVG con fondo transparente).">
        <Grid>
          <MediaField label="Imagen del logo" value={value.logoImage} onChange={(logoImage) => set({ logoImage })} />
          <NumberField label="Altura del logo (px)" value={value.logoHeight} min={20} max={120} onChange={(logoHeight) => set({ logoHeight })} />
          <MediaField label="Favicon / ícono de pestaña" value={value.favicon} onChange={(favicon) => set({ favicon })} help="Si está vacío se usa el logo de imagen." />
        </Grid>
      </Panel>
      <Panel title="SEO" description="Título y descripción que aparecen en Google y al compartir el enlace.">
        <TextField label="Título del sitio" value={value.seoTitle} onChange={(seoTitle) => set({ seoTitle })} />
        <TextField label="Descripción" multiline value={value.seoDescription} onChange={(seoDescription) => set({ seoDescription })} />
      </Panel>
    </>
  )
}

export function ThemeSection({ value, onChange }: Props<'theme'>) {
  const set = (p: Partial<SiteContent['theme']>) => onChange({ ...value, ...p })
  return (
    <>
      <link rel="stylesheet" href={googleFontsHref(value.headingFont, value.bodyFont)} />
      <Panel title="Colores" description="Se aplican a todo el sitio al guardar.">
        <Grid cols={3}>
          <ColorField label="Fondo" value={value.background} onChange={(background) => set({ background })} />
          <ColorField label="Texto principal / botones" value={value.foreground} onChange={(foreground) => set({ foreground })} />
          <ColorField label="Tarjetas" value={value.card} onChange={(card) => set({ card })} />
          <ColorField label="Acento (dorado oscuro)" value={value.accent} onChange={(accent) => set({ accent })} />
          <ColorField label="Acento claro" value={value.accentLight} onChange={(accentLight) => set({ accentLight })} />
          <ColorField label="Fondos suaves" value={value.muted} onChange={(muted) => set({ muted })} />
          <ColorField label="Bordes" value={value.border} onChange={(border) => set({ border })} />
          <ColorField label="Secciones oscuras / pie" value={value.dark} onChange={(dark) => set({ dark })} />
        </Grid>
        <div className="grid grid-cols-4 overflow-hidden rounded-xl border border-border sm:grid-cols-8" aria-hidden="true">
          {[value.background, value.foreground, value.card, value.accent, value.accentLight, value.muted, value.border, value.dark].map((c, i) => (
            <span key={i} className="h-10" style={{ background: c }} />
          ))}
        </div>
      </Panel>
      <Panel title="Tipografía" description="Puedes elegir de la lista o escribir el nombre exacto de cualquier fuente de Google Fonts.">
        <Grid>
          <div className="flex flex-col gap-3">
            <TextField label="Fuente de títulos" value={value.headingFont} onChange={(headingFont) => set({ headingFont })} />
            <FontChips fonts={HEADING_FONTS} active={value.headingFont} onPick={(headingFont) => set({ headingFont })} />
          </div>
          <div className="flex flex-col gap-3">
            <TextField label="Fuente de textos" value={value.bodyFont} onChange={(bodyFont) => set({ bodyFont })} />
            <FontChips fonts={BODY_FONTS} active={value.bodyFont} onPick={(bodyFont) => set({ bodyFont })} />
          </div>
        </Grid>
        <div className="flex flex-col gap-2 rounded-xl border border-border p-6" style={{ background: value.background, color: value.foreground }}>
          <p style={{ fontFamily: fontStack(value.headingFont) }} className="text-4xl leading-tight">
            Tu belleza natural, <em style={{ color: value.accent }}>realzada</em>
          </p>
          <p style={{ fontFamily: fontStack(value.bodyFont) }} className="leading-relaxed opacity-75">
            Diseño tratamientos faciales y corporales mínimamente invasivos para que te veas descansada y luminosa.
          </p>
        </div>
        <NumberField label="Redondeo de esquinas (rem)" value={value.radius} min={0} max={3} step={0.25} onChange={(radius) => set({ radius })} help="0 = esquinas rectas, 1.5 = diseño original." />
      </Panel>
    </>
  )
}

function FontChips({ fonts, active, onPick }: { fonts: string[]; active: string; onPick: (f: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {fonts.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => onPick(f)}
          className={`rounded-full border px-3 py-1 text-xs ${active === f ? 'border-foreground bg-foreground text-background' : 'border-border bg-background'}`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}

export function ContactSection({
  value,
  onChange,
  location,
  onLocation,
}: Props<'contact'> & { location: SiteContent['location']; onLocation: (v: SiteContent['location']) => void }) {
  const set = (p: Partial<SiteContent['contact']>) => onChange({ ...value, ...p })
  const embed = value.mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(value.mapQuery)}&output=embed`
  return (
    <>
      <Panel title="Teléfono y WhatsApp">
        <Grid>
          <TextField label="Teléfono (para llamar)" value={value.phone} onChange={(phone) => set({ phone })} help="Formato internacional, ej. +528120799186" />
          <TextField label="Teléfono como se muestra" value={value.phoneDisplay} onChange={(phoneDisplay) => set({ phoneDisplay })} />
          <TextField label="Número de WhatsApp" value={value.whatsapp} onChange={(whatsapp) => set({ whatsapp: whatsapp.replace(/\D/g, '') })} help="Solo dígitos con lada de país, ej. 528120799186" />
          <TextField label="Correo (opcional)" type="email" value={value.email} onChange={(email) => set({ email })} />
        </Grid>
        <TextField label="Mensaje predeterminado de WhatsApp" value={value.whatsappMessage} onChange={(whatsappMessage) => set({ whatsappMessage })} />
      </Panel>
      <Panel title="Dirección y horario">
        <Grid>
          <TextField label="Dirección" value={value.address} onChange={(address) => set({ address })} />
          <TextField label="Ciudad / Estado" value={value.city} onChange={(city) => set({ city })} />
          <TextField label="Horario corto" value={value.hoursShort} onChange={(hoursShort) => set({ hoursShort })} />
          <TextField label="Horario completo" value={value.hoursLong} onChange={(hoursLong) => set({ hoursLong })} />
        </Grid>
        <TextField label="Enlace del catálogo digital" value={value.catalogUrl} onChange={(catalogUrl) => set({ catalogUrl })} />
      </Panel>
      <Panel title="Mapa" description="Escribe la dirección para buscar en Google Maps, o pega el enlace de inserción (Compartir → Insertar un mapa → copiar el src).">
        <Grid>
          <TextField label="Búsqueda en el mapa" value={value.mapQuery} onChange={(mapQuery) => set({ mapQuery })} />
          <TextField label="URL de inserción (opcional)" value={value.mapEmbedUrl} onChange={(mapEmbedUrl) => set({ mapEmbedUrl })} placeholder="https://www.google.com/maps/embed?pb=..." />
        </Grid>
        <iframe title="Vista previa del mapa" src={embed} className="h-64 w-full rounded-xl border border-border" loading="lazy" />
        <Grid>
          <TextField label="Sección ubicación · etiqueta" value={location.eyebrow} onChange={(eyebrow) => onLocation({ ...location, eyebrow })} />
          <TextField label="Sección ubicación · título" value={location.title} onChange={(title) => onLocation({ ...location, title })} />
        </Grid>
      </Panel>
    </>
  )
}
