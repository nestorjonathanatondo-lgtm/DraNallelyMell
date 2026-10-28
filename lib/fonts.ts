export const HEADING_FONTS = [
  'Playfair Display',
  'Cormorant Garamond',
  'Bodoni Moda',
  'Libre Caslon Display',
  'DM Serif Display',
  'Marcellus',
  'Lora',
  'Fraunces',
  'Italiana',
  'Montserrat',
]

export const BODY_FONTS = [
  'Plus Jakarta Sans',
  'Inter',
  'Manrope',
  'DM Sans',
  'Outfit',
  'Montserrat',
  'Lato',
  'Nunito Sans',
  'Work Sans',
  'Raleway',
]

const SERIF_FONTS = new Set(['Playfair Display', 'Cormorant Garamond', 'Bodoni Moda', 'Libre Caslon Display', 'DM Serif Display', 'Marcellus', 'Lora', 'Fraunces', 'Italiana'])

const SINGLE_WEIGHT = new Set(['Libre Caslon Display', 'DM Serif Display', 'Marcellus', 'Italiana'])

function familyParam(name: string, kind: 'heading' | 'body') {
  const family = name.trim().replace(/\s+/g, '+')
  if (SINGLE_WEIGHT.has(name)) return `family=${family}`
  if (kind === 'heading') return `family=${family}:ital,wght@0,400;0,500;0,600;1,400;1,500`
  return `family=${family}:wght@300;400;500;600;700`
}

export function googleFontsHref(heading: string, body: string) {
  const params = [familyParam(heading, 'heading')]
  if (body !== heading) params.push(familyParam(body, 'body'))
  return `https://fonts.googleapis.com/css2?${params.join('&')}&display=swap`
}

export function fontStack(name: string) {
  return `'${name.replace(/'/g, '')}', ${SERIF_FONTS.has(name) ? 'Georgia, serif' : 'system-ui, sans-serif'}`
}
