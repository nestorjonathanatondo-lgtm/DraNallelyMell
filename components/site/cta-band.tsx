import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { btnLight, btnOutlineDark, container } from '@/lib/ui'
import type { SiteContent } from '@/lib/types'

export function CtaBand({ cta, whatsapp }: { cta: SiteContent['cta']; whatsapp: string }) {
  return (
    <section className={cn(container, 'pb-20 md:pb-28')}>
      <div className="flex flex-col items-center gap-6 rounded-4xl bg-dark px-6 py-16 text-center text-dark-foreground md:py-20">
        <p className="eyebrow text-accent-light">{cta.eyebrow}</p>
        <h2 className="max-w-2xl text-balance text-4xl md:text-5xl">{cta.title}</h2>
        <p className="max-w-xl leading-relaxed text-dark-foreground/70">{cta.description}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/agendar" className={btnLight}>
            Agendar mi cita
          </Link>
          <a href={whatsapp} target="_blank" rel="noreferrer" className={btnOutlineDark}>
            <MessageCircle className="size-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
