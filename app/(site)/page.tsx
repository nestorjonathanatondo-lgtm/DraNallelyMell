import { CtaBand } from '@/components/site/cta-band'
import { About } from '@/components/site/home/about'
import { Faq } from '@/components/site/home/faq'
import { Hero } from '@/components/site/home/hero'
import { Location } from '@/components/site/home/location'
import { Pillars } from '@/components/site/home/pillars'
import { ResultsSection } from '@/components/site/home/results-section'
import { Steps } from '@/components/site/home/steps'
import { Testimonials } from '@/components/site/home/testimonials'
import { TreatmentSearch } from '@/components/site/treatment-search'
import { TreatmentsPreview } from '@/components/site/home/treatments-preview'
import { Vascular } from '@/components/site/home/vascular'
import { getContent, whatsappLink } from '@/lib/content'

export default async function HomePage() {
  const content = await getContent()
  const whatsapp = whatsappLink(content)
  return (
    <>
      <Hero hero={content.hero} />
      <section className="border-y border-border/70 bg-muted/30 px-6 py-10" aria-labelledby="home-search-title">
        <div className="mx-auto max-w-6xl">
          <h2 id="home-search-title" className="mb-4 text-center font-serif text-2xl">Encuentra tu tratamiento</h2>
          <TreatmentSearch />
        </div>
      </section>
      <Pillars pillars={content.pillars} />
      <TreatmentsPreview content={content} />
      <ResultsSection results={content.results} />
      <Vascular vascular={content.vascular} />
      <Steps steps={content.steps} />
      <About about={content.about} whatsapp={whatsapp} />
      <Testimonials testimonials={content.testimonials} />
      <Faq faq={content.faq} whatsapp={whatsapp} />
      <Location content={content} />
      <CtaBand cta={content.cta} whatsapp={whatsappLink(content, 'Hola Dra. Nallely Mellado, deseo agendar mi cita de valoración')} />
    </>
  )
}
