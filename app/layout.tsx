import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { getContent } from '@/lib/content'
import { fontStack, googleFontsHref } from '@/lib/fonts'
import type { Theme } from '@/lib/types'
import './globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getContent()
  const icon = brand.favicon || brand.logoImage
  return {
    title: { default: brand.seoTitle, template: `%s | ${brand.name} ${brand.nameAccent}` },
    description: brand.seoDescription,
    icons: icon ? { icon, apple: icon } : { icon: '/icon.svg', apple: '/apple-icon.png' },
  }
}

export async function generateViewport(): Promise<Viewport> {
  const { theme } = await getContent()
  return { themeColor: theme.background, colorScheme: 'light' }
}

const safeColor = (value: string, fallback: string) =>
  /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/i.test(value.trim()) ? value.trim() : fallback

function themeCss(theme: Theme) {
  const radius = Number.isFinite(theme.radius) ? Math.min(Math.max(theme.radius, 0), 3) : 1.5
  return `:root{
--background:${safeColor(theme.background, '#faf8f5')};
--foreground:${safeColor(theme.foreground, '#141416')};
--card:${safeColor(theme.card, '#ffffff')};
--accent:${safeColor(theme.accent, '#8a6d45')};
--accent-light:${safeColor(theme.accentLight, '#c2a77f')};
--muted:${safeColor(theme.muted, '#f2ede6')};
--border:${safeColor(theme.border, '#e8e1d6')};
--dark:${safeColor(theme.dark, '#141416')};
--radius:${radius}rem;
--heading-font:${fontStack(theme.headingFont)};
--body-font:${fontStack(theme.bodyFont)};
}`
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { theme } = await getContent()
  return (
    <html lang="es-MX" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontsHref(theme.headingFont, theme.bodyFont)} />
        <style dangerouslySetInnerHTML={{ __html: themeCss(theme) }} />
      </head>
      <body>
        {children}
        <Toaster position="top-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
