export type Stat = { value: string; label: string }

export type Treatment = {
  slug: string
  name: string
  category: string
  duration: string
  description: string
  badge: string
  image: string
  benefits: string[]
  price: string
  featured: boolean
}

export type ResultItem = { title: string; text: string; image: string }
export type Pillar = { title: string; text: string }
export type Step = { title: string; text: string }
export type Testimonial = { quote: string; name: string; treatment: string; rating: number }
export type FaqItem = { q: string; a: string }
export type LegalPage = { slug: string; title: string; intro: string; body: string; updated: string }

export type FieldType = 'text' | 'tel' | 'email' | 'textarea' | 'select' | 'choice' | 'date'

export type IntakeField = {
  id: string
  label: string
  type: FieldType
  required: boolean
  placeholder: string
  help: string
  options: string[]
}

export type DaySchedule = { open: boolean; start: string; end: string }

export type Theme = {
  background: string
  foreground: string
  card: string
  accent: string
  accentLight: string
  muted: string
  border: string
  dark: string
  headingFont: string
  bodyFont: string
  radius: number
}

export type SiteContent = {
  brand: {
    name: string
    nameAccent: string
    tagline: string
    logoImage: string
    logoHeight: number
    favicon: string
    seoTitle: string
    seoDescription: string
  }
  theme: Theme
  contact: {
    phone: string
    phoneDisplay: string
    whatsapp: string
    whatsappMessage: string
    email: string
    address: string
    city: string
    mapQuery: string
    mapEmbedUrl: string
    hoursShort: string
    hoursLong: string
    catalogUrl: string
    instagram: string
    facebook: string
  }
  hero: {
    eyebrow: string
    titleBefore: string
    titleAccent: string
    titleAfter: string
    description: string
    image: string
    imageAlt: string
    badge: string
    locationEyebrow: string
    locationTitle: string
    primaryCta: string
    secondaryCta: string
    stats: Stat[]
  }
  pillars: { eyebrow: string; title: string; items: Pillar[] }
  treatmentsSection: { eyebrow: string; title: string; ctaLabel: string; description: string }
  categories: string[]
  treatments: Treatment[]
  results: { eyebrow: string; title: string; description: string; disclaimer: string; items: ResultItem[] }
  vascular: {
    enabled: boolean
    eyebrow: string
    titleBefore: string
    titleAccent: string
    description: string
    video: string
    image: string
    ctaLabel: string
    treatmentSlug: string
  }
  steps: { eyebrow: string; title: string; ctaLabel: string; items: Step[] }
  about: {
    eyebrow: string
    title: string
    quote: string
    text: string
    image: string
    credentials: string[]
  }
  testimonials: { eyebrow: string; title: string; items: Testimonial[] }
  faq: { eyebrow: string; title: string; description: string; items: FaqItem[] }
  location: { eyebrow: string; title: string }
  cta: { eyebrow: string; title: string; description: string }
  footer: { description: string; legalNote: string }
  booking: {
    eyebrow: string
    title: string
    formTitle: string
    formSubtitle: string
    privacyText: string
    pendingNote: string
    successTitle: string
    successText: string
    slotMinutes: number
    maxDaysAhead: number
    schedule: DaySchedule[]
    fields: IntakeField[]
  }
  legal: LegalPage[]
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada'

export type Appointment = {
  folio: string
  createdAt: string
  status: AppointmentStatus
  treatmentSlug: string
  treatmentName: string
  date: string
  time: string
  data: Record<string, string>
  notes: string
}
