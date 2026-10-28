import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { WhatsappFloat } from '@/components/site/whatsapp-float'
import { getContent, whatsappLink } from '@/lib/content'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent()
  return (
    <>
      <SiteHeader brand={content.brand} contact={content.contact} />
      <main id="main">{children}</main>
      <SiteFooter content={content} />
      <WhatsappFloat href={whatsappLink(content, 'Hola Dra. Nallely Mellado, tengo una duda sobre sus tratamientos')} />
    </>
  )
}
