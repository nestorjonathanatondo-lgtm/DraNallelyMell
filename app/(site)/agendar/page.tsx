
import type { Metadata } from 'next'
import { BookingWizard } from '@/components/site/booking/booking-wizard'
import { getContent, whatsappLink } from '@/lib/content'
import { cn } from '@/lib/utils'
import { container } from '@/lib/ui'

export const metadata: Metadata = { title: 'Agendar cita' }

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ servicio?: string }> }) {
  const { servicio } = await searchParams
  const content = await getContent()
  return (
    <div className={cn(container, 'flex flex-col gap-8 pb-24 pt-14 md:pt-20')}>
      <div className="flex flex-col gap-4">
        <p className="eyebrow">{content.booking.eyebrow}</p>
        <h1 className="text-balance text-4xl md:text-6xl">{content.booking.title}</h1>
      </div>
      <BookingWizard
        treatments={content.treatments}
        categories={content.categories}
        booking={content.booking}
        initialSlug={servicio}
        whatsapp={whatsappLink(content)}
        whatsappNumber={content.contact.whatsapp}
      />
    </div>
  )
}
